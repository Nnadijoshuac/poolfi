const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying PoolFi Ultimate Contract to Reef Pelagia...");
  console.log("⏰ Hackathon Deadline: 5 hours remaining!");

  // Get the contract factory
  const PoolFiUltimate = await ethers.getContractFactory("PoolFiUltimate");

  // Deploy the contract
  console.log("📦 Deploying contract...");
  const poolFiUltimate = await PoolFiUltimate.deploy();

  // Wait for deployment to complete
  await poolFiUltimate.waitForDeployment();

  const contractAddress = await poolFiUltimate.getAddress();
  const deploymentTx = poolFiUltimate.deploymentTransaction();

  console.log("\n✅ PoolFi Ultimate deployed successfully!");
  console.log("🎉 HACKATHON READY!");
  console.log("\n📋 Contract Details:");
  console.log(`   Address: ${contractAddress}`);
  console.log(`   Transaction Hash: ${deploymentTx?.hash}`);
  console.log(`   Network: Reef Pelagia (Chain ID: 13939)`);
  console.log(`   Explorer: https://dev.papi.how/explorer`);
  console.log(`   Gas Used: ${deploymentTx?.gasLimit?.toString()}`);

  // Save deployment info
  const deploymentInfo = {
    contractName: "PoolFiUltimate",
    contractAddress: contractAddress,
    transactionHash: deploymentTx?.hash,
    network: "reefPelagia",
    chainId: 13939,
    deployedAt: new Date().toISOString(),
    deployer: deploymentTx?.from,
    gasUsed: deploymentTx?.gasLimit?.toString(),
    features: [
      "Advanced Pool Management",
      "Gas Optimized",
      "Reentrancy Protection",
      "Emergency Controls",
      "Comprehensive Statistics",
      "User Pool Tracking",
      "Flexible Withdrawal System",
      "Deadline Management",
      "Member Management",
      "Production Ready"
    ]
  };

  console.log("\n📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to deployments file
  const fs = require('fs');
  const deploymentsFile = './deployments-ultimate.json';
  fs.writeFileSync(deploymentsFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to ${deploymentsFile}`);

  console.log("\n🔧 Next Steps for Hackathon:");
  console.log("1. Copy the contract address above");
  console.log("2. Update frontend/.env.local with:");
  console.log(`   NEXT_PUBLIC_POOL_MANAGER_ADDRESS=${contractAddress}`);
  console.log("3. Update frontend ABI to match PoolFiUltimate");
  console.log("4. Test all functions");
  console.log("5. Deploy frontend to Vercel");
  console.log("6. Submit to hackathon! 🏆");

  console.log("\n🎯 Contract Features:");
  console.log("✅ Create pools with flexible parameters");
  console.log("✅ Join pools with member limits");
  console.log("✅ Contribute with exact amounts");
  console.log("✅ Automatic pool completion");
  console.log("✅ Flexible withdrawal system");
  console.log("✅ Emergency controls");
  console.log("✅ Comprehensive statistics");
  console.log("✅ Gas optimized");
  console.log("✅ Production ready");

  console.log("\n🏆 GOOD LUCK WITH YOUR HACKATHON SUBMISSION! 🏆");

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    console.log("\n🆘 Emergency Backup:");
    console.log("1. Use the existing BasicPool contract");
    console.log("2. Update frontend ABI to match BasicPool");
    console.log("3. Deploy frontend as is");
    process.exit(1);
  });
