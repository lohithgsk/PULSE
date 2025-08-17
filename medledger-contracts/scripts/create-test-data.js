const ConsentManagement = artifacts.require("ConsentManagement");
const MultiSignatureAccess = artifacts.require("MultiSignatureAccess");
const RecordRegistry = artifacts.require("RecordRegistry");

module.exports = async function(callback) {
  try {
    console.log("🧪 Creating test data for audit trail...");
    
    const accounts = await web3.eth.getAccounts();
    const [admin, patient, doctor, hospital] = accounts;
    
    const consent = await ConsentManagement.deployed();
    const multisig = await MultiSignatureAccess.deployed();
    const registry = await RecordRegistry.deployed();
    
    console.log("📋 Setting up providers...");
    await registry.addProvider(doctor, "Dr. Smith", { from: admin });
    await registry.addProvider(hospital, "City Hospital", { from: admin });
    
    console.log("✅ Granting patient consent...");
    const expiry = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
    await consent.grantConsent(doctor, "blood-test", expiry, { from: patient });
    await consent.grantConsent(hospital, "surgery-records", expiry, { from: patient });
    
    console.log("📁 Registering medical records...");
    const recordTx = await registry.registerRecord(
      patient,
      "blood-test",
      2, // LabResult
      "QmTestBloodResults123",
      '{"test": "CBC", "results": "normal"}',
      false,
      "",
      false,
      { from: doctor }
    );
    
    const recordEvent = recordTx.logs.find(log => log.event === 'RecordRegistered');
    const recordId = recordEvent.args.recordId;
    
    console.log("🔍 Accessing records...");
    await registry.accessRecord(
      recordId,
      "Patient reviewing test results",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      { from: patient }
    );
    
    await registry.accessRecord(
      recordId,
      "Doctor reviewing for treatment planning",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      { from: doctor }
    );
    
    console.log("✅ Test data created! Now you can view the audit trail.");
    console.log("Run: truffle exec scripts/audit-trail.js --network ganache");
    
    callback();
  } catch (error) {
    console.error("❌ Error creating test data:", error);
    callback(error);
  }
};