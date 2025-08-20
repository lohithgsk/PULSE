const ConsentManagement = artifacts.require("ConsentManagement");

module.exports = function (deployer, network, accounts) {
  console.log("🚀 Deploying ConsentManagement contract...");
  console.log("Network:", network);
  console.log("Deployer account:", accounts[0]);
  
  deployer.deploy(ConsentManagement).then(async () => {
    const instance = await ConsentManagement.deployed();
    console.log("✅ ConsentManagement deployed to:", instance.address);
    
    // Test basic functionality if not on mainnet
    if (network !== 'mainnet' && network !== 'sepolia') {
      try {
        console.log("\n🧪 Running basic tests...");
        
        const [deployer, patient, doctor] = accounts;
        
        // Test 1: Grant consent
        console.log("Test 1: Granting consent...");
        const expiry = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
        await instance.grantConsent(doctor, "blood-test", expiry, { from: patient });
        console.log("✅ Consent granted successfully");
        
        // Test 2: Check consent using view function instead
        console.log("Test 2: Checking consent...");
        const consentDetails = await instance.getConsentDetails.call(patient, doctor, "blood-test");
        console.log("✅ Consent check result:", {
        isActive: consentDetails.isActive,
        expiryTimestamp: consentDetails.expiryTimestamp.toString()
        });
        
        // Test 3: Get active consent count
        console.log("Test 3: Getting active consent count...");
        const count = await instance.getActiveConsentCount(patient);
        console.log("✅ Active consents:", count.toString());
        
        console.log("\n🎉 All tests passed! Contract is working correctly.");
        
      } catch (error) {
        console.error("❌ Test failed:", error.message);
      }
    }
    
    console.log("\n📊 Deployment Summary:");
    console.log({
      network: network,
      contractAddress: instance.address,
      deployerAddress: accounts[0],
      deploymentTime: new Date().toISOString()
    });
    
    console.log("\n🔗 For Flask API Integration:");
    console.log("Contract Address:", instance.address);
    console.log("Network:", network);
    console.log("ABI Location: ./build/contracts/ConsentManagement.json");
    
    // Save deployment info to a file
    const fs = require('fs');
    const deploymentInfo = {
      network: network,
      contractAddress: instance.address,
      deployerAddress: accounts[0],
      deploymentTime: new Date().toISOString(),
      abi: instance.abi
    };
    
    fs.writeFileSync(
      `./deployments/${network}_deployment.json`, 
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`Deployment info saved to ./deployments/${network}_deployment.json`);
  });
};