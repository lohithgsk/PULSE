const ConsentManagement = artifacts.require("ConsentManagement");
const { expect } = require('chai');

contract("ConsentManagement", accounts => {
  let consentContract;
  const [deployer, patient, doctor, hospital, unauthorized] = accounts;
  let expiry;

  beforeEach(async () => {
    consentContract = await ConsentManagement.new();
    expiry = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now
  });

  describe("Grant Consent", () => {
    it("should grant consent successfully", async () => {
      const tx = await consentContract.grantConsent(
        doctor,
        "blood-test",
        expiry,
        { from: patient }
      );

      // Check for ConsentGranted event
      const event = tx.logs.find(log => log.event === 'ConsentGranted');
      expect(event).to.exist;
      expect(event.args.patient).to.equal(patient);
      expect(event.args.accessor).to.equal(doctor);
      expect(event.args.dataType).to.equal("blood-test");
    });

    it("should not allow granting consent to yourself", async () => {
      try {
        await consentContract.grantConsent(
          patient,
          "blood-test",
          expiry,
          { from: patient }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Cannot grant consent to yourself");
      }
    });

    it("should not allow empty data type", async () => {
      try {
        await consentContract.grantConsent(
          doctor,
          "",
          expiry,
          { from: patient }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Data type cannot be empty");
      }
    });

    it("should not allow past expiry date", async () => {
      const pastExpiry = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      
      try {
        await consentContract.grantConsent(
          doctor,
          "blood-test",
          pastExpiry,
          { from: patient }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("Expiry must be in the future");
      }
    });

    it("should allow indefinite consent (expiry = 0)", async () => {
      const tx = await consentContract.grantConsent(
        doctor,
        "blood-test",
        0,
        { from: patient }
      );

      const event = tx.logs.find(log => log.event === 'ConsentGranted');
      expect(event).to.exist;
      expect(event.args.expiryTimestamp.toString()).to.equal("0");
    });
  });

  describe("Check Consent", () => {
    beforeEach(async () => {
      await consentContract.grantConsent(
        doctor,
        "blood-test",
        expiry,
        { from: patient }
      );
    });

    it("should return true for valid consent", async () => {
      const result = await consentContract.checkConsent(
        patient,
        doctor,
        "blood-test",
        { from: doctor }
      );
      
      expect(result.granted).to.be.true;
      expect(result.expiry.toString()).to.equal(expiry.toString());
    });

    it("should return false for non-existent consent", async () => {
      const result = await consentContract.checkConsent(
        patient,
        unauthorized,
        "blood-test",
        { from: unauthorized }
      );
      
      expect(result.granted).to.be.false;
    });

    it("should return false for wrong data type", async () => {
      const result = await consentContract.checkConsent(
        patient,
        doctor,
        "x-ray",
        { from: doctor }
      );
      
      expect(result.granted).to.be.false;
    });
  });

  describe("Revoke Consent", () => {
    beforeEach(async () => {
      await consentContract.grantConsent(
        doctor,
        "blood-test",
        expiry,
        { from: patient }
      );
    });

    it("should revoke consent successfully", async () => {
      const tx = await consentContract.revokeConsent(
        doctor,
        "blood-test",
        { from: patient }
      );

      const event = tx.logs.find(log => log.event === 'ConsentRevoked');
      expect(event).to.exist;
      expect(event.args.patient).to.equal(patient);
      expect(event.args.accessor).to.equal(doctor);
      expect(event.args.dataType).to.equal("blood-test");
    });

    it("should not allow revoking non-existent consent", async () => {
      try {
        await consentContract.revokeConsent(
          unauthorized,
          "blood-test",
          { from: patient }
        );
        expect.fail("Expected revert not received");
      } catch (error) {
        expect(error.reason).to.include("No active consent found");
      }
    });

    it("should make consent check return false after revocation", async () => {
      await consentContract.revokeConsent(
        doctor,
        "blood-test",
        { from: patient }
      );
      
      const result = await consentContract.checkConsent(
        patient,
        doctor,
        "blood-test",
        { from: doctor }
      );
      
      expect(result.granted).to.be.false;
    });
  });

  describe("Get Functions", () => {
    beforeEach(async () => {
      await consentContract.grantConsent(
        doctor,
        "blood-test",
        expiry,
        { from: patient }
      );
      await consentContract.grantConsent(
        doctor,
        "x-ray",
        expiry,
        { from: patient }
      );
      await consentContract.grantConsent(
        hospital,
        "full-record",
        0,
        { from: patient }
      );
    });

    it("should return correct patient accessors", async () => {
      const accessors = await consentContract.getPatientAccessors(patient);
      expect(accessors).to.include(doctor);
      expect(accessors).to.include(hospital);
    });

    it("should return correct granted data types", async () => {
      const dataTypes = await consentContract.getGrantedDataTypes(patient, doctor);
      expect(dataTypes).to.include("blood-test");
      expect(dataTypes).to.include("x-ray");
    });

    it("should return correct active consent count", async () => {
      const count = await consentContract.getActiveConsentCount(patient);
      expect(count.toString()).to.equal("3");
    });

    it("should return correct consent details", async () => {
      const details = await consentContract.getConsentDetails(
        patient,
        doctor,
        "blood-test"
      );
      
      expect(details.isActive).to.be.true;
      expect(details.grantedAt.toString()).to.not.equal("0");
      expect(details.expiryTimestamp.toString()).to.equal(expiry.toString());
      expect(details.consentHash).to.not.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
    });
  });

  describe("Revoke All Consents", () => {
    beforeEach(async () => {
      await consentContract.grantConsent(
        doctor,
        "blood-test",
        expiry,
        { from: patient }
      );
      await consentContract.grantConsent(
        hospital,
        "x-ray",
        expiry,
        { from: patient }
      );
    });

    it("should revoke all consents", async () => {
      await consentContract.revokeAllConsents({ from: patient });
      
      const count = await consentContract.getActiveConsentCount(patient);
      expect(count.toString()).to.equal("0");
    });

    it("should emit ConsentRevoked events for each revocation", async () => {
      const tx = await consentContract.revokeAllConsents({ from: patient });
      
      const revokedEvents = tx.logs.filter(log => log.event === 'ConsentRevoked');
      expect(revokedEvents.length).to.be.at.least(1);
    });
  });

  describe("Gas Usage", () => {
    it("should report gas usage for major operations", async () => {
      console.log("\n⛽ Gas Usage Report:");
      
      // Grant consent
      const grantTx = await consentContract.grantConsent(
        doctor,
        "blood-test",
        expiry,
        { from: patient }
      );
      console.log(`Grant Consent: ${grantTx.receipt.gasUsed} gas`);
      
      // Check consent
      const checkTx = await consentContract.checkConsent(
        patient,
        doctor,
        "blood-test",
        { from: doctor }
      );
      console.log(`Check Consent: ${checkTx.receipt.gasUsed} gas`);
      
      // Revoke consent
      const revokeTx = await consentContract.revokeConsent(
        doctor,
        "blood-test",
        { from: patient }
      );
      console.log(`Revoke Consent: ${revokeTx.receipt.gasUsed} gas`);
    });
  });
});