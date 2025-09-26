const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting PoolFi deployment to Reef Network...");
  
  try {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    
    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "REEF");

    if (balance < ethers.parseEther("0.01")) {
      console.log("⚠️  Low balance! Please get REEF tokens from faucet");
      console.log("💡 Faucet URL: https://faucet.reefscan.com/");
    }

    // Deploy MockREEF token first
    console.log("\n🪙 Deploying MockREEF token...");
    const MockREEF = await ethers.getContractFactory("MockREEF");
    const mockREEF = await MockREEF.deploy();
    await mockREEF.waitForDeployment();
    const mockREEFAddress = await mockREEF.getAddress();
    console.log("✅ MockREEF deployed to:", mockREEFAddress);

    // Deploy PoolManager contract
    console.log("\n🏦 Deploying PoolManager...");
    const PoolManager = await ethers.getContractFactory("PoolManager");
    const poolManager = await PoolManager.deploy();
    await poolManager.waitForDeployment();
    const poolManagerAddress = await poolManager.getAddress();
    console.log("✅ PoolManager deployed to:", poolManagerAddress);

    // Deploy BasicPool contract
    console.log("\n🔧 Deploying BasicPool...");
    const BasicPool = await ethers.getContractFactory("BasicPool");
    const basicPool = await BasicPool.deploy();
    await basicPool.waitForDeployment();
    const basicPoolAddress = await basicPool.getAddress();
    console.log("✅ BasicPool deployed to:", basicPoolAddress);

    // Deploy MinimalPool contract
    console.log("\n⚡ Deploying MinimalPool...");
    const MinimalPool = await ethers.getContractFactory("MinimalPool");
    const minimalPool = await MinimalPool.deploy();
    await minimalPool.waitForDeployment();
    const minimalPoolAddress = await minimalPool.getAddress();
    console.log("✅ MinimalPool deployed to:", minimalPoolAddress);

    // Verify deployments
    console.log("\n🔍 Verifying deployments...");
    
    // PoolManager verification
    const poolManagerOwner = await poolManager.owner();
    const poolCount = await poolManager.poolCount();
    const platformFee = await poolManager.platformFee();
    
    console.log("👤 PoolManager owner:", poolManagerOwner);
    console.log("📊 Initial pool count:", poolCount.toString());
    console.log("💸 Platform fee:", platformFee.toString(), "basis points");

    // MockREEF verification
    const tokenName = await mockREEF.name();
    const tokenSymbol = await mockREEF.symbol();
    const totalSupply = await mockREEF.totalSupply();
    
    console.log("🪙 Token name:", tokenName);
    console.log("🪙 Token symbol:", tokenSymbol);
    console.log("🪙 Total supply:", ethers.formatEther(totalSupply), "tokens");

    // Test basic functionality
    console.log("\n🧪 Testing basic functionality...");
    
    // Create a test pool
    const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
    const createPoolTx = await poolManager.createPool(
      "Test Pool",
      "A test pool for deployment verification",
      ethers.parseEther("10"),
      ethers.parseEther("1"),
      5,
      deadline
    );
    await createPoolTx.wait();
    
    const testPoolCount = await poolManager.poolCount();
    console.log("✅ Test pool created successfully. Pool count:", testPoolCount.toString());

    // Get network information
    const network = await ethers.provider.getNetwork();
    const gasPrice = await ethers.provider.getGasPrice();
    
    console.log("\n🌐 Network Information:");
    console.log("Network name:", network.name);
    console.log("Chain ID:", network.chainId.toString());
    console.log("Gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");

    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("=" * 60);
    console.log("📋 Contract Addresses:");
    console.log("PoolManager Contract:", poolManagerAddress);
    console.log("BasicPool Contract:  ", basicPoolAddress);
    console.log("MinimalPool Contract:", minimalPoolAddress);
    console.log("MockREEF Token:      ", mockREEFAddress);
    console.log("Network: Reef Network (Chain ID: 13939)");
    console.log("=" * 60);
    
    console.log("\n📝 Next Steps:");
    console.log("1. Add these addresses to your frontend .env.local file:");
    console.log(`NEXT_PUBLIC_POOL_MANAGER_ADDRESS=${poolManagerAddress}`);
    console.log(`NEXT_PUBLIC_BASIC_POOL_ADDRESS=${basicPoolAddress}`);
    console.log(`NEXT_PUBLIC_MINIMAL_POOL_ADDRESS=${minimalPoolAddress}`);
    console.log(`NEXT_PUBLIC_MOCK_REEF_ADDRESS=${mockREEFAddress}`);
    console.log("\n2. Update the ABI in your frontend hooks");
    console.log("3. Test the application with the deployed contracts");
    console.log("4. Run tests: npm test");
    console.log("\n🚀 PoolFi is ready for testing!");

    // Save deployment info to file
    const deploymentInfo = {
      network: network.name,
      chainId: network.chainId.toString(),
      timestamp: new Date().toISOString(),
      contracts: {
        PoolManager: poolManagerAddress,
        BasicPool: basicPoolAddress,
        MinimalPool: minimalPoolAddress,
        MockREEF: mockREEFAddress
      },
      deployer: deployer.address,
      gasPrice: ethers.formatUnits(gasPrice, "gwei") + " gwei"
    };

    const fs = require('fs');
    fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    console.log("\n💾 Deployment info saved to deployment-info.json");

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Solution: Get REEF tokens from faucet");
      console.log("   Faucet URL: https://faucet.reefscan.com/");
    } else if (error.message.includes("timeout")) {
      console.log("\n💡 Solution: Try again in a few minutes");
      console.log("   The network might be experiencing high traffic");
    } else if (error.message.includes("nonce")) {
      console.log("\n💡 Solution: Wait a moment and try again");
      console.log("   There might be a nonce conflict");
    } else if (error.message.includes("gas")) {
      console.log("\n💡 Solution: Increase gas limit or gas price");
      console.log("   Try running with --gas-limit 5000000");
    } else {
      console.log("\n💡 Check the error details above and try again");
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
