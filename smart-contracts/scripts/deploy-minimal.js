const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Minimal PoolFi deployment to Reef Network...");
  
  try {
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "REEF");

    console.log("\n🏦 Deploying MinimalPool...");
    const MinimalPool = await ethers.getContractFactory("MinimalPool");
    const minimalPool = await MinimalPool.deploy();
    await minimalPool.waitForDeployment();
    const minimalPoolAddress = await minimalPool.getAddress();
    
    console.log("✅ MinimalPool deployed to:", minimalPoolAddress);

    const poolCount = await minimalPool.poolCount();
    console.log("📊 Initial pool count:", poolCount.toString());

    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("=" * 50);
    console.log("📋 Contract Address:");
    console.log("MinimalPool:", minimalPoolAddress);
    console.log("=" * 50);
    
    console.log("\n📝 Add to frontend .env.local:");
    console.log(`NEXT_PUBLIC_POOL_MANAGER_ADDRESS=${minimalPoolAddress}`);

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
