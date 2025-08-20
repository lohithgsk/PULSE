const ConsentManagement = artifacts.require("ConsentManagement");
const MultiSignatureAccess = artifacts.require("MultiSignatureAccess");
const RecordRegistry = artifacts.require("RecordRegistry");

module.exports = async function(callback) {
  try {
    console.log("🔍 MedLedger Audit Trail Report");
    console.log("================================\n");
    
    // Get contract instances
    const consent = await ConsentManagement.deployed();
    const multisig = await MultiSignatureAccess.deployed();
    const registry = await RecordRegistry.deployed();
    
    console.log("Contract Addresses:");
    console.log(`ConsentManagement: ${consent.address}`);
    console.log(`MultiSignatureAccess: ${multisig.address}`);
    console.log(`RecordRegistry: ${registry.address}\n`);
    
    // Get all consent events
    console.log("📋 CONSENT MANAGEMENT AUDIT TRAIL:");
    console.log("-".repeat(50));
    
    const consentGranted = await consent.getPastEvents('ConsentGranted', {
      fromBlock: 0, 
      toBlock: 'latest'
    });
    
    const consentRevoked = await consent.getPastEvents('ConsentRevoked', {
      fromBlock: 0, 
      toBlock: 'latest'
    });
    
    const consentChecked = await consent.getPastEvents('ConsentChecked', {
      fromBlock: 0, 
      toBlock: 'latest'
    });
    
    console.log(`\n✅ Consent Granted Events: ${consentGranted.length}`);
    consentGranted.forEach((event, i) => {
      console.log(`  ${i+1}. Patient: ${event.args.patient.substring(0,10)}...`);
      console.log(`     Accessor: ${event.args.accessor.substring(0,10)}...`);
      console.log(`     Data Type: ${event.args.dataType}`);
      console.log(`     Block: ${event.blockNumber}`);
      console.log(`     Transaction: ${event.transactionHash}`);
      console.log('');
    });
    
    console.log(`\n❌ Consent Revoked Events: ${consentRevoked.length}`);
    consentRevoked.forEach((event, i) => {
      console.log(`  ${i+1}. Patient: ${event.args.patient.substring(0,10)}...`);
      console.log(`     Accessor: ${event.args.accessor.substring(0,10)}...`);
      console.log(`     Data Type: ${event.args.dataType}`);
      console.log(`     Block: ${event.blockNumber}`);
      console.log('');
    });
    
    console.log(`\n🔍 Consent Check Events: ${consentChecked.length}`);
    consentChecked.slice(0, 10).forEach((event, i) => { // Show only first 10
      console.log(`  ${i+1}. Patient: ${event.args.patient.substring(0,10)}...`);
      console.log(`     Accessor: ${event.args.accessor.substring(0,10)}...`);
      console.log(`     Data Type: ${event.args.dataType}`);
      console.log(`     Granted: ${event.args.granted}`);
      console.log(`     Time: ${new Date(event.args.timestamp * 1000)}`);
      console.log('');
    });
    
    // Get multi-sig events
    console.log("\n🏥 MULTI-SIGNATURE ACCESS AUDIT TRAIL:");
    console.log("-".repeat(50));
    
    const proposalsCreated = await multisig.getPastEvents('ProposalCreated', {
      fromBlock: 0, 
      toBlock: 'latest'
    });
    
    const proposalsApproved = await multisig.getPastEvents('ProposalApproved', {
      fromBlock: 0, 
      toBlock: 'latest'
    });
    
    const proposalsExecuted = await multisig.getPastEvents('ProposalExecuted', {
      fromBlock: 0, 
      toBlock: 'latest'
    });
    
    console.log(`\n📝 Proposals Created: ${proposalsCreated.length}`);
    proposalsCreated.forEach((event, i) => {
      console.log(`  ${i+1}. Proposer: ${event.args.proposer.substring(0,10)}...`);
      console.log(`     Patient: ${event.args.patient.substring(0,10)}...`);
      console.log(`     Data Type: ${event.args.dataType}`);
      console.log(`     Reason: ${event.args.reason}`);
      console.log(`     Required Signatures: ${event.args.requiredSignatures}`);
      console.log('');
    });
    
    console.log(`\n✅ Proposals Approved: ${proposalsApproved.length}`);
    console.log(`\n🚀 Proposals Executed: ${proposalsExecuted.length}`);
    
    // Get record events
    console.log("\n📁 RECORD REGISTRY AUDIT TRAIL:");
    console.log("-".repeat(50));
    
    const recordsRegistered = await registry.getPastEvents('RecordRegistered', {
      fromBlock: 0, 
      toBlock: 'latest'
    });
    
    const recordsAccessed = await registry.getPastEvents('RecordAccessed', {
      fromBlock: 0, 
      toBlock: 'latest'
    });
    
    const recordsUpdated = await registry.getPastEvents('RecordUpdated', {
      fromBlock: 0, 
      toBlock: 'latest'
    });
    
    console.log(`\n📋 Records Registered: ${recordsRegistered.length}`);
    recordsRegistered.forEach((event, i) => {
      console.log(`  ${i+1}. Patient: ${event.args.patient.substring(0,10)}...`);
      console.log(`     Provider: ${event.args.provider.substring(0,10)}...`);
      console.log(`     Data Type: ${event.args.dataType}`);
      console.log(`     IPFS Hash: ${event.args.ipfsHash}`);
      console.log(`     Encrypted: ${event.args.encrypted}`);
      console.log(`     Time: ${new Date(event.args.timestamp * 1000)}`);
      console.log('');
    });
    
    console.log(`\n🔍 Record Access Events: ${recordsAccessed.length}`);
    recordsAccessed.forEach((event, i) => {
      console.log(`  ${i+1}. Accessor: ${event.args.accessor.substring(0,10)}...`);
      console.log(`     Patient: ${event.args.patient.substring(0,10)}...`);
      console.log(`     Reason: ${event.args.accessReason}`);
      console.log(`     Time: ${new Date(event.args.timestamp * 1000)}`);
      console.log('');
    });
    
    console.log(`\n📝 Record Updates: ${recordsUpdated.length}`);
    
    // Summary
    const totalEvents = consentGranted.length + consentRevoked.length + consentChecked.length + 
                       proposalsCreated.length + proposalsApproved.length + proposalsExecuted.length +
                       recordsRegistered.length + recordsAccessed.length + recordsUpdated.length;
    
    console.log("\n" + "=".repeat(60));
    console.log("📊 AUDIT TRAIL SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total Audit Events: ${totalEvents}`);
    console.log(`Consent Events: ${consentGranted.length + consentRevoked.length + consentChecked.length}`);
    console.log(`Multi-Sig Events: ${proposalsCreated.length + proposalsApproved.length + proposalsExecuted.length}`);
    console.log(`Record Events: ${recordsRegistered.length + recordsAccessed.length + recordsUpdated.length}`);
    console.log("\n✅ Your MedLedger system has a complete, tamper-proof audit trail!");
    
    callback();
  } catch (error) {
    console.error("❌ Error viewing audit trail:", error);
    callback(error);
  }
};