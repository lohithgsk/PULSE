const MultiSignatureAccess = artifacts.require("MultiSignatureAccess");
const ConsentManagement = artifacts.require("ConsentManagement");
const { expect } = require('chai');

contract("MultiSignatureAccess", accounts => {
  let multiSigContract, consentContract;
  const [admin, patient, doctor, deptHead, medDirector, ethicsCommittee, unauthorized] = accounts;
  let expiry;

  beforeEach(async () => {
    // Deploy ConsentManagement first
    consentContract = await ConsentManagement.new();
    
    // Deploy MultiSignatureAccess with ConsentManagement address
    multiSigContract = await MultiSignatureAccess.new(consentContract.address);
    
    // Set up approvers
    await multiSigContract.addApprover(deptHead, "Department Head", { from: admin });
    await multiSigContract.addApprover(medDirector, "Medical Director", { from: admin });
    await multiSigContract.addApprover(ethicsCommittee, "Ethics Committee", { from: admin });
    
    // Grant patient consent first
    expiry = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
    await consentContract.grantConsent(doctor, "surgery-records", expiry, { from: patient });
  });

  describe("Contract Initialization", () => {
    it("should set admin correctly", async () => {
      const contractAdmin = await multiSigContract.admin();
      expect(contractAdmin).to.equal(admin);
    });

    it("should reference ConsentManagement contract", async () => {
      const consentAddress = await multiSigContract.consentContract();
      expect(consentAddress).to.equal(consentContract.address);
    });

    it("should set default signature requirements", async () => {
      const sigReqs = await multiSigContract.getSignatureRequirements();
      expect(sigReqs.standard.toString()).to.equal("3");
      expect(sigReqs.emergency.toString()).to.equal("2");
      expect(sigReqs.research.toString()).to.equal("4");
    });
  });

  describe("Approver Management", () => {
    it("should add approvers correctly", async () => {
      const isApprover = await multiSigContract.authorizedApprovers(deptHead);
      const role = await multiSigContract.approverRoles(deptHead);
      
      expect(isApprover).to.be.true;
      expect(role).to.equal("Department Head");
    });

    it("should remove approvers", async () => {
      await multiSigContract.removeApprover(deptHead, { from: admin });
      
      const isApprover = await multiSigContract.authorizedApprovers(deptHead);
      expect(isApprover).to.be.false;
    });

    it("should not allow non-admin to add approvers", async () => {
      try {
        await multiSigContract.addApprover(unauthorized, "Unauthorized", { from: doctor });
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Only admin can call this function");
      }
    });
  });

  describe("Proposal Creation", () => {
    it("should create proposal successfully", async () => {
      const tx = await multiSigContract.proposeAction(
        patient,
        "surgery-records",
        0, // AccessType.Read
        "Need records for follow-up treatment",
        ["QmHash1", "QmHash2"],
        { from: doctor }
      );

      const event = tx.logs.find(log => log.event === 'ProposalCreated');
      expect(event).to.exist;
      expect(event.args.proposer).to.equal(doctor);
      expect(event.args.patient).to.equal(patient);
      expect(event.args.dataType).to.equal("surgery-records");
    });

    it("should not create proposal without patient consent", async () => {
      try {
        await multiSigContract.proposeAction(
          patient,
          "x-ray", // No consent for this data type
          0,
          "Need x-ray records",
          [],
          { from: doctor }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("No valid consent from patient");
      }
    });

    it("should not allow empty reason", async () => {
      try {
        await multiSigContract.proposeAction(
          patient,
          "surgery-records",
          0,
          "", // Empty reason
          [],
          { from: doctor }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Reason cannot be empty");
      }
    });
  });

  describe("Proposal Approval", () => {
    let proposalId;

    beforeEach(async () => {
      const tx = await multiSigContract.proposeAction(
        patient,
        "surgery-records",
        0,
        "Need records for follow-up treatment",
        ["QmHash1"],
        { from: doctor }
      );
      
      const event = tx.logs.find(log => log.event === 'ProposalCreated');
      proposalId = event.args.proposalId;
    });

    it("should approve proposal successfully", async () => {
      const tx = await multiSigContract.approveAction(proposalId, { from: deptHead });
      
      const event = tx.logs.find(log => log.event === 'ProposalApproved');
      expect(event).to.exist;
      expect(event.args.approver).to.equal(deptHead);
      expect(event.args.currentApprovals.toString()).to.equal("1");
    });

    it("should not allow unauthorized user to approve", async () => {
      try {
        await multiSigContract.approveAction(proposalId, { from: unauthorized });
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Not authorized to approve proposals");
      }
    });

    it("should not allow proposer to approve own proposal", async () => {
      try {
        await multiSigContract.approveAction(proposalId, { from: doctor });
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Proposer cannot approve own proposal");
      }
    });

    it("should not allow double approval", async () => {
      await multiSigContract.approveAction(proposalId, { from: deptHead });
      
      try {
        await multiSigContract.approveAction(proposalId, { from: deptHead });
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Already approved this proposal");
      }
    });

    it("should mark proposal as approved when enough signatures collected", async () => {
      // Need 3 signatures for standard access
      await multiSigContract.approveAction(proposalId, { from: deptHead });
      await multiSigContract.approveAction(proposalId, { from: medDirector });
      await multiSigContract.approveAction(proposalId, { from: admin });
      
      const details = await multiSigContract.getProposalDetails(proposalId);
      expect(details.status.toString()).to.equal("1"); // ProposalStatus.Approved
    });
  });

  describe("Proposal Rejection", () => {
    let proposalId;

    beforeEach(async () => {
      const tx = await multiSigContract.proposeAction(
        patient,
        "surgery-records",
        0,
        "Need records for follow-up treatment",
        [],
        { from: doctor }
      );
      
      const event = tx.logs.find(log => log.event === 'ProposalCreated');
      proposalId = event.args.proposalId;
    });

    it("should reject proposal successfully", async () => {
      const tx = await multiSigContract.rejectAction(
        proposalId, 
        "Insufficient medical justification", 
        { from: deptHead }
      );
      
      const event = tx.logs.find(log => log.event === 'ProposalRejected');
      expect(event).to.exist;
      expect(event.args.rejector).to.equal(deptHead);
      
      const details = await multiSigContract.getProposalDetails(proposalId);
      expect(details.status.toString()).to.equal("3"); // ProposalStatus.Rejected
    });

    it("should not allow rejection without reason", async () => {
      try {
        await multiSigContract.rejectAction(proposalId, "", { from: deptHead });
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Rejection reason required");
      }
    });
  });

  describe("Proposal Execution", () => {
    let proposalId;

    beforeEach(async () => {
      const tx = await multiSigContract.proposeAction(
        patient,
        "surgery-records",
        0,
        "Need records for follow-up treatment",
        [],
        { from: doctor }
      );
      
      const event = tx.logs.find(log => log.event === 'ProposalCreated');
      proposalId = event.args.proposalId;
      
      // Get enough approvals
      await multiSigContract.approveAction(proposalId, { from: deptHead });
      await multiSigContract.approveAction(proposalId, { from: medDirector });
      await multiSigContract.approveAction(proposalId, { from: admin });
    });

    it("should execute approved proposal successfully", async () => {
      const tx = await multiSigContract.executeAction(proposalId, { from: doctor });
      
      const event = tx.logs.find(log => log.event === 'ProposalExecuted');
      expect(event).to.exist;
      expect(event.args.success).to.be.true;
      
      const details = await multiSigContract.getProposalDetails(proposalId);
      expect(details.status.toString()).to.equal("2"); // ProposalStatus.Executed
    });

    it("should not execute unapproved proposal", async () => {
      // Create new proposal without approvals
      const tx = await multiSigContract.proposeAction(
        patient,
        "surgery-records",
        0,
        "Another request",
        [],
        { from: doctor }
      );
      
      const event = tx.logs.find(log => log.event === 'ProposalCreated');
      const newProposalId = event.args.proposalId;
      
      try {
        await multiSigContract.executeAction(newProposalId, { from: doctor });
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Proposal not approved");
      }
    });

    it("should verify patient consent before execution", async () => {
      // Revoke patient consent
      await consentContract.revokeConsent(doctor, "surgery-records", { from: patient });
      
      try {
        await multiSigContract.executeAction(proposalId, { from: doctor });
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Patient consent revoked");
      }
    });
  });

  describe("Emergency Access", () => {
    it("should require fewer signatures for emergency access", async () => {
      const tx = await multiSigContract.proposeAction(
        patient,
        "surgery-records",
        4, // AccessType.Emergency
        "Emergency medical situation",
        [],
        { from: doctor }
      );
      
      const event = tx.logs.find(log => log.event === 'ProposalCreated');
      const proposalId = event.args.proposalId;
      
      // Should only need 2 signatures for emergency
      expect(event.args.requiredSignatures.toString()).to.equal("2");
      
      // Approve with 2 signatures
      await multiSigContract.approveAction(proposalId, { from: deptHead });
      await multiSigContract.approveAction(proposalId, { from: admin });
      
      const details = await multiSigContract.getProposalDetails(proposalId);
      expect(details.status.toString()).to.equal("1"); // Should be approved
    });
  });

  describe("View Functions", () => {
    let proposalId;

    beforeEach(async () => {
      const tx = await multiSigContract.proposeAction(
        patient,
        "surgery-records",
        0,
        "Need records for follow-up treatment",
        ["QmHash1", "QmHash2"],
        { from: doctor }
      );
      
      const event = tx.logs.find(log => log.event === 'ProposalCreated');
      proposalId = event.args.proposalId;
    });

    it("should get proposal details correctly", async () => {
      const details = await multiSigContract.getProposalDetails(proposalId);
      
      expect(details.proposer).to.equal(doctor);
      expect(details.patient).to.equal(patient);
      expect(details.dataType).to.equal("surgery-records");
      expect(details.reason).to.equal("Need records for follow-up treatment");
      expect(details.requiredSignatures.toString()).to.equal("3");
      expect(details.currentApprovals.toString()).to.equal("0");
      expect(details.status.toString()).to.equal("0"); // Pending
    });

    it("should get IPFS hashes correctly", async () => {
      const hashes = await multiSigContract.getProposalIPFSHashes(proposalId);
      expect(hashes).to.include("QmHash1");
      expect(hashes).to.include("QmHash2");
      expect(hashes.length).to.equal(2);
    });

    it("should track proposer history", async () => {
      const proposals = await multiSigContract.getProposalsByProposer(doctor);
      expect(proposals).to.include(proposalId);
    });

    it("should get total proposals count", async () => {
      const total = await multiSigContract.getTotalProposals();
      expect(total.toString()).to.equal("1");
    });
  });

  describe("Access Type Requirements", () => {
    it("should return correct signature requirements for each access type", async () => {
      expect((await multiSigContract.getRequiredSignatures(0)).toString()).to.equal("3"); // Read
      expect((await multiSigContract.getRequiredSignatures(4)).toString()).to.equal("2"); // Emergency
      expect((await multiSigContract.getRequiredSignatures(5)).toString()).to.equal("4"); // Research
      expect((await multiSigContract.getRequiredSignatures(7)).toString()).to.equal("2"); // Legal
      expect((await multiSigContract.getRequiredSignatures(6)).toString()).to.equal("3"); // Insurance
    });
  });

  describe("Gas Usage Reporting", () => {
    it("should report gas usage for major operations", async () => {
      console.log("\n⛽ Multi-Sig Gas Usage Report:");
      
      // Propose action
      const proposeTx = await multiSigContract.proposeAction(
        patient,
        "surgery-records",
        0,
        "Gas test proposal",
        ["QmHash1"],
        { from: doctor }
      );
      console.log(`Propose Action: ${proposeTx.receipt.gasUsed} gas`);
      
      const event = proposeTx.logs.find(log => log.event === 'ProposalCreated');
      const proposalId = event.args.proposalId;
      
      // Approve action
      const approveTx = await multiSigContract.approveAction(proposalId, { from: deptHead });
      console.log(`Approve Action: ${approveTx.receipt.gasUsed} gas`);
      
      // Get more approvals for execution
      await multiSigContract.approveAction(proposalId, { from: medDirector });
      await multiSigContract.approveAction(proposalId, { from: admin });
      
      // Execute action
      const executeTx = await multiSigContract.executeAction(proposalId, { from: doctor });
      console.log(`Execute Action: ${executeTx.receipt.gasUsed} gas`);
    });
  });
});