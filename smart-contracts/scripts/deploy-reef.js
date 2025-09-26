const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying PoolFi contracts to Reef Network...");

  // Deploy Mock REEF token first
  console.log("Deploying Mock REEF token...");
  const MockREEF = await ethers.getContractFactory("MockREEF");
  const mockREEF = await MockREEF.deploy();
  await mockREEF.deployed();
  
  console.log("Mock REEF deployed to:", mockREEF.address);

  // Deploy PoolManager with Mock REEF token address
  console.log("Deploying PoolManager...");
  const PoolManager = await ethers.getContractFactory("PoolManager");
  const poolManager = await PoolManager.deploy(mockREEF.address);
  await poolManager.deployed();

  console.log("PoolManager deployed to:", poolManager.address);
  console.log("Deployed on Reef Network");
  
  // Verify the deployment
  console.log("Verifying deployment...");
  const owner = await poolManager.owner();
  console.log("PoolManager owner:", owner);
  
  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("Mock REEF Token:", mockREEF.address);
  console.log("PoolManager Contract:", poolManager.address);
  console.log("Network: Reef Testnet");
  
  console.log("\n=== CONFERENCE DEMO SETUP ===");
  console.log("1. Add these addresses to your .env.local:");
  console.log(`NEXT_PUBLIC_POOL_MANAGER_ADDRESS=${poolManager.address}`);
  console.log(`NEXT_PUBLIC_REEF_TOKEN_ADDRESS=${mockREEF.address}`);
  console.log("\n2. Get test tokens by calling getTestTokens() on Mock REEF");
  console.log("3. Update frontend configuration");
  console.log("4. Test the complete flow!");
  
  console.log("\nDeployment completed successfully! 🚀");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
