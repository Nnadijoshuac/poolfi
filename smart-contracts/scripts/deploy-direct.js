const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting PoolFi deployment to Reef Testnet...");
  
  try {
    // Get the deployer account from Hardhat
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    
    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "REEF");

    if (balance < ethers.parseEther("0.01")) {
      console.log("⚠️  Low balance! Please get test REEF tokens from:");
      console.log("   https://testnet.reefscan.com/faucet");
    }

    // Deploy Mock REEF token
    console.log("\n🪙 Deploying Mock REEF token...");
    const MockREEF = await ethers.getContractFactory("MockREEF");
    const mockREEF = await MockREEF.deploy();
    await mockREEF.waitForDeployment();
    const mockREEFAddress = await mockREEF.getAddress();
    console.log("✅ Mock REEF deployed to:", mockREEFAddress);

    // Deploy PoolManager
    console.log("\n🏦 Deploying PoolManager...");
    const PoolManager = await ethers.getContractFactory("PoolManager");
    const poolManager = await PoolManager.deploy(mockREEFAddress);
    await poolManager.waitForDeployment();
    const poolManagerAddress = await poolManager.getAddress();
    console.log("✅ PoolManager deployed to:", poolManagerAddress);

    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    const owner = await poolManager.owner();
    console.log("👤 PoolManager owner:", owner);

    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("=" * 50);
    console.log("📋 Contract Addresses:");
    console.log("Mock REEF Token:", mockREEF.address);
    console.log("PoolManager:", poolManager.address);
    console.log("Network: Reef Testnet (13940)");
    console.log("=" * 50);
    
    console.log("\n📝 Next Steps:");
    console.log("1. Add these addresses to your .env.local file:");
    console.log(`NEXT_PUBLIC_POOL_MANAGER_ADDRESS=${poolManagerAddress}`);
    console.log(`NEXT_PUBLIC_REEF_TOKEN_ADDRESS=${mockREEFAddress}`);
    console.log("\n2. Update your frontend configuration");
    console.log("3. Test the application at http://localhost:3000/demo");
    console.log("\n🚀 Ready for Web3Conf Enugu!");

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Solution: Get test REEF tokens from:");
      console.log("   https://testnet.reefscan.com/faucet");
    } else if (error.message.includes("timeout")) {
      console.log("\n💡 Solution: Try again in a few minutes");
      console.log("   Reef testnet can be slow sometimes");
    }
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
