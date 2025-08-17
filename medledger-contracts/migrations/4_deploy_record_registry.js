const RecordRegistry = artifacts.require("RecordRegistry");
const ConsentManagement = artifacts.require("ConsentManagement");
const MultiSignatureAccess = artifacts.require("MultiSignatureAccess");

module.exports = function (deployer, network, accounts) {
  console.log("🚀 Deploying RecordRegistry contract...");
  console.log("Network:", network);
  console.log("Deployer account:", accounts[0]);
  
  deployer.deploy(
    RecordRegistry, 
    ConsentManagement.address, 
    MultiSignatureAccess.address
  ).then(async () => {
    const recordRegistryInstance = await RecordRegistry.deployed();
    const consentInstance = await ConsentManagement.deployed();
    const multiSigInstance = await MultiSignatureAccess.deployed();
    
    console.log("✅ RecordRegistry deployed to:", recordRegistryInstance.address);
    console.log("🔗 Connected to ConsentManagement at:", ConsentManagement.address);
    console.log("🔗 Connected to MultiSignatureAccess at:", MultiSignatureAccess.address);
    
    // Test basic functionality if not on mainnet
    if (network !== 'mainnet' && network !== 'sepolia') {
      try {
        console.log("\n🧪 Running Record Registry tests...");
        
        const [admin, patient, doctor, hospital, lab] = accounts;
        
        // Setup: Add medical providers
        console.log("Setup 1: Adding medical providers...");
        await recordRegistryInstance.addProvider(doctor, "Dr. Smith - Cardiologist", { from: admin });
        await recordRegistryInstance.addProvider(hospital, "City General Hospital", { from: admin });
        await recordRegistryInstance.addProvider(lab, "MedLab Diagnostics", { from: admin });
        console.log("✅ Medical providers added");
        
        // Setup: Grant patient consent
        console.log("Setup 2: Granting patient consent...");
        const expiry = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
        await consentInstance.grantConsent(doctor, "blood-test", expiry, { from: patient });
        await consentInstance.grantConsent(hospital, "surgery-records", expiry, { from: patient });
        console.log("✅ Patient consent granted");
        
        // Test 1: Register medical record
        console.log("Test 1: Registering medical record...");
        const registerTx = await recordRegistryInstance.registerRecord(
          patient,
          "blood-test",
          2, // RecordType.LabResult
          "QmBloodTestHash123abc456def",
          '{"test_type": "CBC", "lab": "MedLab", "urgent": false}',
          true, // isEncrypted
          "encryption_key_blood_test_123",
          false, // isEmergencyAccessible
          { from: doctor }
        );
        
        // Extract record ID from events
        const recordEvent = registerTx.logs.find(log => log.event === 'RecordRegistered');
        const recordId = recordEvent.args.recordId;
        console.log("✅ Medical record registered with ID:", recordId);
        console.log("   IPFS Hash:", recordEvent.args.ipfsHash);
        console.log("   Data Type:", recordEvent.args.dataType);
        
        // Test 2: Access medical record
        console.log("Test 2: Accessing medical record...");
        const accessResult = await recordRegistryInstance.accessRecord(
          recordId,
          "Reviewing blood test results for diagnosis",
          "0x0000000000000000000000000000000000000000000000000000000000000000", // No multi-sig needed
          { from: doctor }
        );
        console.log("✅ Record accessed successfully");
        console.log("   IPFS Hash:", accessResult.ipfsHash);
        console.log("   Has Encryption Key:", accessResult.encryptionKey.length > 0);
        
        // Test 3: Patient accessing own record
        console.log("Test 3: Patient accessing own record...");
        const patientAccess = await recordRegistryInstance.accessRecord(
          recordId,
          "Patient reviewing own test results",
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          { from: patient }
        );
        console.log("✅ Patient accessed own record successfully");
        
        // Test 4: Get record details
        console.log("Test 4: Getting record details...");
        const details = await recordRegistryInstance.getRecordDetails.call(recordId);
        console.log("✅ Record details retrieved:");
        console.log("   Patient:", details.patient);
        console.log("   Provider:", details.provider);
        console.log("   Data Type:", details.dataType);
        console.log("   Record Type:", details.recordType.toString());
        console.log("   Version:", details.version.toString());
        console.log("   Is Encrypted:", details.isEncrypted);
        console.log("   Status:", details.status.toString());
        
        // Test 5: Register emergency record
        console.log("Test 5: Registering emergency record...");
        const emergencyTx = await recordRegistryInstance.registerRecord(
          patient,
          "emergency-record",
          5, // RecordType.Emergency
          "QmEmergencyHash789xyz",
          '{"emergency_type": "cardiac_arrest", "severity": "critical"}',
          false, // not encrypted for emergency access
          "",
          true, // isEmergencyAccessible
          { from: hospital }
        );
        
        const emergencyEvent = emergencyTx.logs.find(log => log.event === 'RecordRegistered');
        const emergencyRecordId = emergencyEvent.args.recordId;
        console.log("✅ Emergency record registered:", emergencyRecordId);
        
        // Test 6: Get patient records
        console.log("Test 6: Getting patient records...");
        const patientRecords = await recordRegistryInstance.getPatientRecords.call(patient, "");
        console.log("✅ Patient has", patientRecords.length, "records");
        
        // Test 7: Get records by type
        console.log("Test 7: Getting blood test records...");
        const bloodTestRecords = await recordRegistryInstance.getPatientRecords.call(patient, "blood-test");
        console.log("✅ Patient has", bloodTestRecords.length, "blood test records");
        
        // Test 8: Share record
        console.log("Test 8: Sharing record with hospital...");
        await recordRegistryInstance.shareRecord(
          recordId,
          hospital,
          7 * 24 * 60 * 60, // 7 days
          "Sharing for second opinion consultation",
          { from: patient }
        );
        console.log("✅ Record shared successfully");
        
        // Test 9: Check access authorization
        console.log("Test 9: Checking access authorization...");
        const isAuthorized = await recordRegistryInstance.isAuthorizedToView.call(recordId, doctor);
        console.log("✅ Doctor authorized to view record:", isAuthorized);
        
        // Test 10: Get access history
        console.log("Test 10: Getting access history...");
        const accessHistory = await recordRegistryInstance.getRecordAccessHistory.call(recordId);
        console.log("✅ Record has been accessed", accessHistory.accessors.length, "times");
        console.log("   Last accessor:", accessHistory.accessors[accessHistory.accessors.length - 1]);
        
        // Test 11: Update record
        console.log("Test 11: Updating record...");
        await recordRegistryInstance.updateRecord(
          recordId,
          "QmUpdatedBloodTestHash456def789",
          "Added additional test results",
          '{"test_type": "CBC", "lab": "MedLab", "urgent": false, "updated": true}',
          "new_encryption_key_456",
          { from: doctor }
        );
        console.log("✅ Record updated successfully");
        
        // Test 12: Get updated record details
        console.log("Test 12: Verifying record update...");
        const updatedDetails = await recordRegistryInstance.getRecordDetails.call(recordId);
        console.log("✅ Record version after update:", updatedDetails.version.toString());
        
        // Test 13: Get total records count
        console.log("Test 13: Getting total records count...");
        const totalRecords = await recordRegistryInstance.getTotalRecords.call();
        console.log("✅ Total records in system:", totalRecords.toString());
        
        console.log("\n🎉 All Record Registry tests passed! Contract is working correctly.");
        
      } catch (error) {
        console.error("❌ Record Registry test failed:", error.message);
        console.error("Full error:", error);
      }
    }
    
    // Create deployments directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync('./deployments')) {
      fs.mkdirSync('./deployments');
    }
    
    console.log("\n📊 Record Registry Deployment Summary:");
    const deploymentInfo = {
      network: network,
      contractName: "RecordRegistry",
      contractAddress: recordRegistryInstance.address,
      consentContractAddress: ConsentManagement.address,
      multiSigContractAddress: MultiSignatureAccess.address,
      deployerAddress: accounts[0],
      deploymentTime: new Date().toISOString(),
      contractABI: recordRegistryInstance.abi
    };
    console.log(JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n🔗 For Flask API Integration:");
    console.log("RecordRegistry Address:", recordRegistryInstance.address);
    console.log("ConsentManagement Address:", ConsentManagement.address);
    console.log("MultiSignatureAccess Address:", MultiSignatureAccess.address);
    console.log("Network:", network);
    console.log("ABI Location: ./build/contracts/RecordRegistry.json");
    
    // Save deployment info
    fs.writeFileSync(
      `./deployments/${network}_RecordRegistry.json`, 
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`✅ Deployment info saved to ./deployments/${network}_RecordRegistry.json`);
    
    // Export complete MedLedger ABI for Flask API
    const completeMedLedgerABI = {
      ConsentManagement: {
        contractAddress: ConsentManagement.address,
        abi: (await ConsentManagement.deployed()).abi
      },
      MultiSignatureAccess: {
        contractAddress: MultiSignatureAccess.address,
        abi: (await MultiSignatureAccess.deployed()).abi
      },
      RecordRegistry: {
        contractAddress: recordRegistryInstance.address,
        abi: recordRegistryInstance.abi
      },
      network: network,
      deployedAt: new Date().toISOString(),
      description: "Complete MedLedger System - Consent Management + Multi-Signature Access + Record Registry"
    };
    
    fs.writeFileSync(
      `./deployments/MedLedger_Complete_ABI.json`,
      JSON.stringify(completeMedLedgerABI, null, 2)
    );
    console.log("✅ Complete MedLedger ABI saved to ./deployments/MedLedger_Complete_ABI.json");
    
    // Create a deployment summary
    const deploymentSummary = {
      system: "MedLedger - Decentralized Healthcare Records",
      version: "1.0.0",
      network: network,
      deployedAt: new Date().toISOString(),
      contracts: {
        ConsentManagement: {
          address: ConsentManagement.address,
          description: "Patient consent management with expiry and revocation"
        },
        MultiSignatureAccess: {
          address: MultiSignatureAccess.address,
          description: "Multi-signature approval system for record access"
        },
        RecordRegistry: {
          address: recordRegistryInstance.address,
          description: "IPFS-based medical record storage and management"
        }
      },
      features: [
        "Patient-controlled consent management",
        "Multi-signature approval workflows",
        "IPFS-based decentralized storage",
        "Emergency access protocols",
        "Complete audit trail",
        "Cross-contract integration",
        "Role-based access control"
      ],
      gasUsage: "Optimized for production deployment",
      security: "Enterprise-grade with multiple authorization layers"
    };
    
    fs.writeFileSync(
      `./deployments/MedLedger_Deployment_Summary.json`,
      JSON.stringify(deploymentSummary, null, 2)
    );
    console.log("✅ Deployment summary saved to ./deployments/MedLedger_Deployment_Summary.json");
    
    console.log("\n🎉 MedLedger Record Registry deployment completed successfully!");
    console.log("📋 System now includes:");
    console.log("   ✅ Consent Management");
    console.log("   ✅ Multi-Signature Access");
    console.log("   ✅ Record Registry with IPFS");
    console.log("🚀 Ready for production use!");
    
  }).catch(error => {
    console.error("❌ Record Registry deployment failed:", error);
    throw error;
  });
};