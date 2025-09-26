const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Simple PoolFi deployment to Reef Network...");
  
  try {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    
    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "REEF");

    if (balance < ethers.parseEther("0.01")) {
      console.log("⚠️  Low balance! Please get REEF tokens from faucet");
    }

    // Deploy SimplePoolManager contract
    console.log("\n🏦 Deploying SimplePoolManager...");
    const SimplePoolManager = await ethers.getContractFactory("SimplePoolManager");
    const simplePoolManager = await SimplePoolManager.deploy();
    await simplePoolManager.waitForDeployment();
    const simplePoolManagerAddress = await simplePoolManager.getAddress();
    
    console.log("✅ SimplePoolManager deployed to:", simplePoolManagerAddress);

    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    const poolCount = await simplePoolManager.poolCount();
    const totalBalance = await simplePoolManager.getTotalBalance();
    
    console.log("📊 Initial pool count:", poolCount.toString());
    console.log("💰 Contract balance:", ethers.formatEther(totalBalance), "REEF");

    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("=" * 50);
    console.log("📋 Contract Address:");
    console.log("SimplePoolManager:", simplePoolManagerAddress);
    console.log("Network: Reef Network");
    console.log("=" * 50);
    
    console.log("\n📝 Next Steps:");
    console.log("1. Add this address to your frontend .env.local file:");
    console.log(`NEXT_PUBLIC_POOL_MANAGER_ADDRESS=${simplePoolManagerAddress}`);
    console.log("\n2. Update the ABI in your frontend hooks");
    console.log("3. Test the application");
    console.log("\n🚀 Simple PoolFi is ready!");

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Solution: Get REEF tokens from faucet");
    } else if (error.message.includes("timeout")) {
      console.log("\n💡 Solution: Try again in a few minutes");
    } else if (error.message.includes("CodeRejected")) {
      console.log("\n💡 Solution: Contract bytecode too large, try simplified version");
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