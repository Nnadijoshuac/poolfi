const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SecurePool to Reef Pelagia...");

  // Get the contract factory
  const SecurePool = await ethers.getContractFactory("SecurePool");

  // Deploy the contract
  const securePool = await SecurePool.deploy();

  // Wait for deployment to complete
  await securePool.waitForDeployment();

  const contractAddress = await securePool.getAddress();
  const deploymentTx = securePool.deploymentTransaction();

  console.log("✅ SecurePool deployed successfully!");
  console.log("📋 Contract Details:");
  console.log(`   Address: ${contractAddress}`);
  console.log(`   Transaction Hash: ${deploymentTx?.hash}`);
  console.log(`   Network: Reef Pelagia (Chain ID: 13939)`);
  console.log(`   Explorer: https://dev.papi.how/explorer`);

  // Save deployment info
  const deploymentInfo = {
    contractName: "SecurePool",
    contractAddress: contractAddress,
    transactionHash: deploymentTx?.hash,
    network: "reefPelagia",
    chainId: 13939,
    deployedAt: new Date().toISOString(),
    deployer: deploymentTx?.from
  };

  console.log("\n📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to deployments file
  const fs = require('fs');
  const deploymentsFile = './deployments-reef-pelagia.json';
  fs.writeFileSync(deploymentsFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to ${deploymentsFile}`);

  console.log("\n🔧 Next Steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update frontend/.env.local with:");
  console.log(`   NEXT_PUBLIC_POOL_MANAGER_ADDRESS=${contractAddress}`);
  console.log("3. Restart your frontend development server");

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
