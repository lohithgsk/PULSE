const MultiSignatureAccess = artifacts.require("MultiSignatureAccess");
const ConsentManagement = artifacts.require("ConsentManagement");

module.exports = function (deployer, network, accounts) {
  console.log("🚀 Deploying MultiSignatureAccess contract...");
  console.log("Network:", network);
  console.log("Deployer account:", accounts[0]);
  
  deployer.deploy(MultiSignatureAccess, ConsentManagement.address).then(async () => {
    const multiSigInstance = await MultiSignatureAccess.deployed();
    const consentInstance = await ConsentManagement.deployed();
    
    console.log("✅ MultiSignatureAccess deployed to:", multiSigInstance.address);
    console.log("🔗 Connected to ConsentManagement at:", ConsentManagement.address);
    
    // Test basic functionality if not on mainnet
    if (network !== 'mainnet' && network !== 'sepolia') {
      try {
        console.log("\n🧪 Running Multi-Sig tests...");
        
        const [admin, patient, doctor, deptHead, medDirector] = accounts;
        
        // Setup: Add approvers
        console.log("Setup 1: Adding authorized approvers...");
        await multiSigInstance.addApprover(deptHead, "Department Head", { from: admin });
        await multiSigInstance.addApprover(medDirector, "Medical Director", { from: admin });
        console.log("✅ Approvers added successfully");
        
        // Setup: Grant consent in ConsentManagement first
        console.log("Setup 2: Granting patient consent...");
        const expiry = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
        await consentInstance.grantConsent(doctor, "surgery-records", expiry, { from: patient });
        console.log("✅ Patient consent granted");
        
        // Test 1: Propose action
        console.log("Test 1: Proposing multi-sig action...");
        const proposeTx = await multiSigInstance.proposeAction(
          patient,
          "surgery-records",
          0, // AccessType.Read
          "Need surgery records for follow-up treatment",
          ["QmExampleHash1", "QmExampleHash2"],
          { from: doctor }
        );
        
        // Extract proposal ID from events
        const proposalEvent = proposeTx.logs.find(log => log.event === 'ProposalCreated');
        const proposalId = proposalEvent.args.proposalId;
        console.log("✅ Proposal created with ID:", proposalId);
        
        // Test 2: Approve action
        console.log("Test 2: Approving proposal (1/3)...");
        await multiSigInstance.approveAction(proposalId, { from: deptHead });
        console.log("✅ First approval completed");
        
        console.log("Test 3: Approving proposal (2/3)...");
        await multiSigInstance.approveAction(proposalId, { from: medDirector });
        console.log("✅ Second approval completed");
        
        console.log("Test 4: Approving proposal (3/3)...");
        await multiSigInstance.approveAction(proposalId, { from: admin });
        console.log("✅ Third approval completed - Proposal should be approved now");
        
        // Test 3: Execute action
        console.log("Test 5: Executing approved proposal...");
        const executeTx = await multiSigInstance.executeAction(proposalId, { from: doctor });
        console.log("✅ Proposal executed successfully");
        console.log("   Transaction hash:", executeTx.tx);
        
        // Test 4: Get proposal details
        console.log("Test 6: Getting proposal details...");
        const details = await multiSigInstance.getProposalDetails.call(proposalId);
        console.log("✅ Proposal details retrieved:");
        console.log("   Proposer:", details.proposer);
        console.log("   Patient:", details.patient);
        console.log("   Data Type:", details.dataType);
        console.log("   Status:", details.status.toString()); // Should be 2 (Executed)
        console.log("   Required Signatures:", details.requiredSignatures.toString());
        console.log("   Current Approvals:", details.currentApprovals.toString());
        
        // Test 5: Get approvers
        console.log("Test 7: Getting proposal approvers...");
        const approvers = await multiSigInstance.getProposalApprovers.call(proposalId);
        console.log("✅ Proposal approvers:", approvers);
        
        // Test 6: Check signature requirements
        console.log("Test 8: Getting signature requirements...");
        const sigReqs = await multiSigInstance.getSignatureRequirements.call();
        console.log("✅ Signature requirements:");
        console.log("   Standard Access:", sigReqs.standard.toString());
        console.log("   Emergency Access:", sigReqs.emergency.toString());
        console.log("   Research Access:", sigReqs.research.toString());
        console.log("   Legal Access:", sigReqs.legal.toString());
        console.log("   Insurance Access:", sigReqs.insurance.toString());
        
        console.log("\n🎉 All Multi-Sig tests passed! Contract is working correctly.");
        
      } catch (error) {
        console.error("❌ Multi-Sig test failed:", error.message);
        console.error("Full error:", error);
      }
    }
    
    // Create deployments directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync('./deployments')) {
      fs.mkdirSync('./deployments');
    }
    
    console.log("\n📊 Multi-Sig Deployment Summary:");
    const deploymentInfo = {
      network: network,
      contractName: "MultiSignatureAccess",
      contractAddress: multiSigInstance.address,
      consentContractAddress: ConsentManagement.address,
      deployerAddress: accounts[0],
      deploymentTime: new Date().toISOString(),
      contractABI: multiSigInstance.abi
    };
    console.log(JSON.stringify(deploymentInfo, null, 2));
    
    console.log("\n🔗 For Flask API Integration:");
    console.log("MultiSignatureAccess Address:", multiSigInstance.address);
    console.log("ConsentManagement Address:", ConsentManagement.address);
    console.log("Network:", network);
    console.log("ABI Location: ./build/contracts/MultiSignatureAccess.json");
    
    // Save deployment info
    fs.writeFileSync(
      `./deployments/${network}_MultiSignatureAccess.json`, 
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`✅ Deployment info saved to ./deployments/${network}_MultiSignatureAccess.json`);
    
    // Export combined ABI for Flask API
    const combinedABI = {
      ConsentManagement: {
        contractAddress: ConsentManagement.address,
        abi: (await ConsentManagement.deployed()).abi
      },
      MultiSignatureAccess: {
        contractAddress: multiSigInstance.address,
        abi: multiSigInstance.abi
      },
      network: network,
      deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      `./deployments/MedLedger_Combined_ABI.json`,
      JSON.stringify(combinedABI, null, 2)
    );
    console.log("✅ Combined ABI saved to ./deployments/MedLedger_Combined_ABI.json");
    
  }).catch(error => {
    console.error("❌ Multi-Sig deployment failed:", error);
    throw error;
  });
};