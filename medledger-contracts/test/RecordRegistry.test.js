const RecordRegistry = artifacts.require("RecordRegistry");
const ConsentManagement = artifacts.require("ConsentManagement");
const MultiSignatureAccess = artifacts.require("MultiSignatureAccess");
const { expect } = require('chai');

contract("RecordRegistry", accounts => {
  let recordRegistry, consentContract, multiSigContract;
  const [admin, patient, doctor, hospital, lab, specialist, unauthorized] = accounts;
  let expiry;

  beforeEach(async () => {
    // Deploy all contracts
    consentContract = await ConsentManagement.new();
    multiSigContract = await MultiSignatureAccess.new(consentContract.address);
    recordRegistry = await RecordRegistry.new(consentContract.address, multiSigContract.address);
    
    // Set up providers
    await recordRegistry.addProvider(doctor, "Dr. Smith - Cardiologist", { from: admin });
    await recordRegistry.addProvider(hospital, "City General Hospital", { from: admin });
    await recordRegistry.addProvider(lab, "MedLab Diagnostics", { from: admin });
    
    // Grant patient consent
    expiry = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
    await consentContract.grantConsent(doctor, "blood-test", expiry, { from: patient });
    await consentContract.grantConsent(hospital, "surgery-records", expiry, { from: patient });
  });

  describe("Contract Initialization", () => {
    it("should set admin correctly", async () => {
      const contractAdmin = await recordRegistry.admin();
      expect(contractAdmin).to.equal(admin);
    });

    it("should reference other contracts correctly", async () => {
      const consentAddress = await recordRegistry.consentContract();
      const multiSigAddress = await recordRegistry.multiSigContract();
      
      expect(consentAddress).to.equal(consentContract.address);
      expect(multiSigAddress).to.equal(multiSigContract.address);
    });

    it("should set admin as authorized provider", async () => {
      const isAuthorized = await recordRegistry.authorizedProviders(admin);
      expect(isAuthorized).to.be.true;
    });
  });

  describe("Provider Management", () => {
    it("should add providers correctly", async () => {
      const isProvider = await recordRegistry.authorizedProviders(doctor);
      const providerName = await recordRegistry.providerNames(doctor);
      
      expect(isProvider).to.be.true;
      expect(providerName).to.equal("Dr. Smith - Cardiologist");
    });

    it("should remove providers", async () => {
      await recordRegistry.removeProvider(doctor, { from: admin });
      
      const isProvider = await recordRegistry.authorizedProviders(doctor);
      expect(isProvider).to.be.false;
    });

    it("should not allow non-admin to add providers", async () => {
      try {
        await recordRegistry.addProvider(unauthorized, "Unauthorized Provider", { from: doctor });
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Only admin can call this function");
      }
    });
  });

  describe("Record Registration", () => {
    it("should register medical record successfully", async () => {
      const tx = await recordRegistry.registerRecord(
        patient,
        "blood-test",
        2, // LabResult
        "QmBloodTestHash123",
        '{"test_type": "CBC"}',
        true, // encrypted
        "encryption_key_123",
        false, // not emergency accessible
        { from: doctor }
      );

      const event = tx.logs.find(log => log.event === 'RecordRegistered');
      expect(event).to.exist;
      expect(event.args.patient).to.equal(patient);
      expect(event.args.provider).to.equal(doctor);
      expect(event.args.dataType).to.equal("blood-test");
      expect(event.args.ipfsHash).to.equal("QmBloodTestHash123");
      expect(event.args.encrypted).to.be.true;
    });

    it("should not allow unauthorized provider to register", async () => {
      try {
        await recordRegistry.registerRecord(
          patient,
          "blood-test",
          2,
          "QmUnauthorizedHash",
          "{}",
          false,
          "",
          false,
          { from: unauthorized }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Not authorized provider");
      }
    });

    it("should not allow duplicate IPFS hash", async () => {
      await recordRegistry.registerRecord(
        patient,
        "blood-test",
        2,
        "QmDuplicateHash",
        "{}",
        false,
        "",
        false,
        { from: doctor }
      );

      try {
        await recordRegistry.registerRecord(
          patient,
          "x-ray",
          3,
          "QmDuplicateHash", // Same hash
          "{}",
          false,
          "",
          false,
          { from: doctor }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("IPFS hash already registered");
      }
    });

    it("should increment total records count", async () => {
      const initialCount = await recordRegistry.getTotalRecords();
      
      await recordRegistry.registerRecord(
        patient,
        "blood-test",
        2,
        "QmCountTest",
        "{}",
        false,
        "",
        false,
        { from: doctor }
      );

      const newCount = await recordRegistry.getTotalRecords();
      expect(newCount.toNumber()).to.equal(initialCount.toNumber() + 1);
    });
  });

  describe("Record Access", () => {
    let recordId;

    beforeEach(async () => {
      const tx = await recordRegistry.registerRecord(
        patient,
        "blood-test",
        2,
        "QmAccessTestHash",
        "{}",
        true,
        "test_encryption_key",
        false,
        { from: doctor }
      );
      
      const event = tx.logs.find(log => log.event === 'RecordRegistered');
      recordId = event.args.recordId;
    });

    it("should allow patient to access own record", async () => {
      const result = await recordRegistry.accessRecord(
        recordId,
        "Patient accessing own record",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        { from: patient }
      );

      expect(result.ipfsHash).to.equal("QmAccessTestHash");
      expect(result.encryptionKey).to.equal("test_encryption_key");
    });

    it("should allow provider to access their record", async () => {
      const result = await recordRegistry.accessRecord(
        recordId,
        "Provider accessing their record",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        { from: doctor }
      );

      expect(result.ipfsHash).to.equal("QmAccessTestHash");
    });

    it("should allow access with valid consent", async () => {
      const result = await recordRegistry.accessRecord(
        recordId,
        "Accessing with patient consent",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        { from: doctor }
      );

      expect(result.ipfsHash).to.equal("QmAccessTestHash");
    });

    it("should deny access without authorization", async () => {
      try {
        await recordRegistry.accessRecord(
          recordId,
          "Unauthorized access attempt",
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          { from: unauthorized }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Not authorized to access this record");
      }
    });

    it("should log access in history", async () => {
      await recordRegistry.accessRecord(
        recordId,
        "Test access for history",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        { from: patient }
      );

      const history = await recordRegistry.getRecordAccessHistory(recordId);
      expect(history.accessors.length).to.be.at.least(1);
      expect(history.accessors[history.accessors.length - 1]).to.equal(patient);
      expect(history.reasons[history.reasons.length - 1]).to.equal("Test access for history");
    });
  });

  describe("Emergency Access", () => {
    let emergencyRecordId;

    beforeEach(async () => {
      const tx = await recordRegistry.registerRecord(
        patient,
        "emergency-record",
        5, // Emergency
        "QmEmergencyHash",
        "{}",
        false,
        "",
        true, // emergency accessible
        { from: hospital }
      );
      
      const event = tx.logs.find(log => log.event === 'RecordRegistered');
      emergencyRecordId = event.args.recordId;
    });

    it("should allow emergency access for authorized providers", async () => {
      const result = await recordRegistry.accessRecord(
        emergencyRecordId,
        "Emergency medical situation",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        { from: doctor }
      );

      expect(result.ipfsHash).to.equal("QmEmergencyHash");
    });
  });

  describe("Record Updates", () => {
    let recordId;

    beforeEach(async () => {
      const tx = await recordRegistry.registerRecord(
        patient,
        "blood-test",
        2,
        "QmUpdateTestHash",
        '{"version": 1}',
        false,
        "",
        false,
        { from: doctor }
      );
      
      const event = tx.logs.find(log => log.event === 'RecordRegistered');
      recordId = event.args.recordId;
    });

    it("should update record successfully", async () => {
      const tx = await recordRegistry.updateRecord(
        recordId,
        "QmUpdatedHash",
        "Added new test results",
        '{"version": 2}',
        "new_key",
        { from: doctor }
      );

      const event = tx.logs.find(log => log.event === 'RecordUpdated');
      expect(event).to.exist;
      expect(event.args.newIpfsHash).to.equal("QmUpdatedHash");
      expect(event.args.version.toString()).to.equal("2");
    });

    it("should not allow unauthorized user to update", async () => {
      try {
        await recordRegistry.updateRecord(
          recordId,
          "QmUnauthorizedUpdate",
          "Unauthorized update",
          "{}",
          "",
          { from: unauthorized }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Not authorized to access this record");
      }
    });

    it("should increment version number", async () => {
      await recordRegistry.updateRecord(
        recordId,
        "QmVersionTest",
        "Version increment test",
        "{}",
        "",
        { from: doctor }
      );

      const details = await recordRegistry.getRecordDetails(recordId);
      expect(details.version.toString()).to.equal("2");
    });
  });

  describe("Record Sharing", () => {
    let recordId;

    beforeEach(async () => {
      const tx = await recordRegistry.registerRecord(
        patient,
        "blood-test",
        2,
        "QmShareTestHash",
        "{}",
        false,
        "",
        false,
        { from: doctor }
      );
      
      const event = tx.logs.find(log => log.event === 'RecordRegistered');
      recordId = event.args.recordId;
    });

    it("should share record successfully", async () => {
      const shareExpiry = 7 * 24 * 60 * 60; // 7 days
      
      const tx = await recordRegistry.shareRecord(
        recordId,
        specialist,
        shareExpiry,
        "Second opinion consultation",
        { from: patient }
      );

      const event = tx.logs.find(log => log.event === 'RecordShared');
      expect(event).to.exist;
      expect(event.args.sharedWith).to.equal(specialist);
    });

    it("should not allow non-patient to share", async () => {
      try {
        await recordRegistry.shareRecord(
          recordId,
          specialist,
          7 * 24 * 60 * 60,
          "Unauthorized sharing",
          { from: doctor }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Only patient can share records");
      }
    });
  });

  describe("Query Functions", () => {
    let bloodTestId, xrayId;

    beforeEach(async () => {
      // Register blood test
      const bloodTx = await recordRegistry.registerRecord(
        patient,
        "blood-test",
        2,
        "QmBloodQuery",
        "{}",
        false,
        "",
        false,
        { from: doctor }
      );
      bloodTestId = bloodTx.logs.find(log => log.event === 'RecordRegistered').args.recordId;

      // Register x-ray
      const xrayTx = await recordRegistry.registerRecord(
        patient,
        "x-ray",
        3,
        "QmXrayQuery",
        "{}",
        false,
        "",
        false,
        { from: doctor }
      );
      xrayId = xrayTx.logs.find(log => log.event === 'RecordRegistered').args.recordId;
    });

    it("should get patient records by type", async () => {
      const bloodTests = await recordRegistry.getPatientRecords(patient, "blood-test");
      expect(bloodTests).to.include(bloodTestId);
      expect(bloodTests).to.not.include(xrayId);
    });

    it("should get all patient records", async () => {
      const allRecords = await recordRegistry.getPatientRecords(patient, "");
      expect(allRecords).to.include(bloodTestId);
      expect(allRecords).to.include(xrayId);
      expect(allRecords.length).to.be.at.least(2);
    });

    it("should get record by IPFS hash", async () => {
      const foundRecordId = await recordRegistry.getRecordByIPFSHash("QmBloodQuery");
      expect(foundRecordId).to.equal(bloodTestId);
    });

    it("should check authorization correctly", async () => {
      const isAuthorized = await recordRegistry.isAuthorizedToView(bloodTestId, doctor);
      expect(isAuthorized).to.be.true;

      const isUnauthorized = await recordRegistry.isAuthorizedToView(bloodTestId, unauthorized);
      expect(isUnauthorized).to.be.false;
    });
  });

  describe("Record Deletion", () => {
    let recordId;

    beforeEach(async () => {
      const tx = await recordRegistry.registerRecord(
        patient,
        "blood-test",
        2,
        "QmDeleteTestHash",
        "{}",
        false,
        "",
        false,
        { from: doctor }
      );
      
      const event = tx.logs.find(log => log.event === 'RecordRegistered');
      recordId = event.args.recordId;
    });

    it("should delete record successfully", async () => {
      const tx = await recordRegistry.deleteRecord(
        recordId,
        "Record no longer needed",
        { from: patient }
      );

      const event = tx.logs.find(log => log.event === 'RecordDeleted');
      expect(event).to.exist;

      const details = await recordRegistry.getRecordDetails(recordId);
      expect(details.status.toString()).to.equal("2"); // Deleted status
    });

    it("should not allow unauthorized deletion", async () => {
      try {
        await recordRegistry.deleteRecord(
          recordId,
          "Unauthorized deletion",
          { from: unauthorized }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Not authorized to access this record");
      }
    });
  });

  describe("Multi-Signature Integration", () => {
    let recordId;

    beforeEach(async () => {
      const tx = await recordRegistry.registerRecord(
        patient,
        "surgery-records",
        4, // Surgery
        "QmMultiSigTestHash",
        "{}",
        false,
        "",
        false,
        { from: hospital }
      );
      
      const event = tx.logs.find(log => log.event === 'RecordRegistered');
      recordId = event.args.recordId;
    });

    it("should allow access with executed multi-sig proposal", async () => {
      // Create multi-sig proposal
      const proposeTx = await multiSigContract.proposeAction(
        patient,
        "surgery-records",
        0, // Read access
        "Need surgery records for insurance claim",
        [],
        { from: doctor }
      );
      
      const proposalEvent = proposeTx.logs.find(log => log.event === 'ProposalCreated');
      const proposalId = proposalEvent.args.proposalId;
      
      // Approve and execute proposal (need 3 approvals for standard access)
      await multiSigContract.approveAction(proposalId, { from: hospital });
      await multiSigContract.approveAction(proposalId, { from: admin });
      await multiSigContract.approveAction(proposalId, { from: doctor }); // Note: proposer can't approve own proposal, this will fail
      
      // Let's approve with different accounts
      await multiSigContract.addApprover(specialist, "Specialist Doctor", { from: admin });
      await multiSigContract.approveAction(proposalId, { from: specialist });
      
      // Execute the proposal
      await multiSigContract.executeAction(proposalId, { from: doctor });
      
      // Verify proposal is executed
      const isExecuted = await multiSigContract.isProposalExecuted(proposalId);
      expect(isExecuted).to.be.true;
      
      // Now access should work with the executed proposal
      const result = await recordRegistry.accessRecord(
        recordId,
        "Accessing with multi-sig approval",
        proposalId,
        { from: doctor }
      );

      expect(result.ipfsHash).to.equal("QmMultiSigTestHash");
    });

    it("should deny access with non-executed multi-sig proposal", async () => {
      // Create multi-sig proposal but don't execute it
      const proposeTx = await multiSigContract.proposeAction(
        patient,
        "surgery-records",
        0,
        "Need surgery records",
        [],
        { from: doctor }
      );
      
      const proposalEvent = proposeTx.logs.find(log => log.event === 'ProposalCreated');
      const proposalId = proposalEvent.args.proposalId;
      
      // Try to access without executing proposal
      try {
        await recordRegistry.accessRecord(
          recordId,
          "Attempting access with pending proposal",
          proposalId,
          { from: doctor }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Not authorized to access this record");
      }
    });
  });

  describe("Gas Usage Reporting", () => {
    it("should report gas usage for major operations", async () => {
      console.log("\n⛽ Record Registry Gas Usage Report:");
      
      // Register record
      const registerTx = await recordRegistry.registerRecord(
        patient,
        "gas-test",
        2,
        "QmGasTestHash",
        "{}",
        false,
        "",
        false,
        { from: doctor }
      );
      console.log(`Register Record: ${registerTx.receipt.gasUsed} gas`);
      
      const recordId = registerTx.logs.find(log => log.event === 'RecordRegistered').args.recordId;
      
      // Access record
      const accessTx = await recordRegistry.accessRecord(
        recordId,
        "Gas test access",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        { from: patient }
      );
      console.log(`Access Record: ${accessTx.receipt.gasUsed} gas`);
      
      // Update record
      const updateTx = await recordRegistry.updateRecord(
        recordId,
        "QmGasTestUpdated",
        "Gas test update",
        "{}",
        "",
        { from: doctor }
      );
      console.log(`Update Record: ${updateTx.receipt.gasUsed} gas`);
    });
  });
});