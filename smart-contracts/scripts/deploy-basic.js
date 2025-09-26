const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Basic Pool to Reef...");
  
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Account:", deployer.address);
    
    const BasicPool = await ethers.getContractFactory("BasicPool");
    const basicPool = await BasicPool.deploy();
    await basicPool.waitForDeployment();
    const address = await basicPool.getAddress();
    
    console.log("✅ BasicPool deployed to:", address);
    console.log("\n📝 Add to frontend .env.local:");
    console.log(`NEXT_PUBLIC_POOL_MANAGER_ADDRESS=${address}`);

  } catch (error) {
    console.error("❌ Failed:", error.message);
    process.exit(1);
  }
}

main().then(() => process.exit(0)).catch(console.error);
