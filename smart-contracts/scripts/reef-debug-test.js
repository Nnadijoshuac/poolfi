const hre = require("hardhat");

/**
 * Simple reproduction script for Reef team debugging
 * This script attempts to deploy the simplest contract (MockREEF) to identify Revive pallet limitations
 */
async function main() {
  console.log("=== Reef Pelagia Debug Test ===");
  console.log("Testing contract deployment to identify Revive pallet limitations\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // Test 1: Deploy MockREEF (simplest contract)
  console.log("\n=== Test 1: MockREEF Token ===");
  try {
    const MockREEF = await hre.ethers.getContractFactory("MockREEF");
    console.log("✅ Contract factory created successfully");
    
    const mockREEF = await MockREEF.deploy();
    console.log("✅ Deployment transaction sent");
    
    await mockREEF.waitForDeployment();
    console.log("✅ Deployment confirmed");
    
    const address = await mockREEF.getAddress();
    console.log("✅ MockREEF deployed at:", address);
    
    // Test basic functionality
    const totalSupply = await mockREEF.totalSupply();
    console.log("✅ Total supply:", hre.ethers.formatEther(totalSupply), "mREEF");
    
  } catch (error) {
    console.log("❌ MockREEF deployment failed:");
    console.log("Error:", error.message);
    console.log("Error code:", error.code);
    console.log("Full error:", error);
  }

  // Test 2: Deploy SimplePoolManager (no OpenZeppelin dependencies)
  console.log("\n=== Test 2: SimplePoolManager (No Dependencies) ===");
  try {
    const SimplePoolManager = await hre.ethers.getContractFactory("SimplePoolManager");
    console.log("✅ Contract factory created successfully");
    
    const simplePool = await SimplePoolManager.deploy();
    console.log("✅ Deployment transaction sent");
    
    await simplePool.waitForDeployment();
    console.log("✅ Deployment confirmed");
    
    const address = await simplePool.getAddress();
    console.log("✅ SimplePoolManager deployed at:", address);
    
  } catch (error) {
    console.log("❌ SimplePoolManager deployment failed:");
    console.log("Error:", error.message);
    console.log("Error code:", error.code);
  }

  // Test 3: Deploy BasicPool (with OpenZeppelin dependencies)
  console.log("\n=== Test 3: BasicPool (With OpenZeppelin) ===");
  try {
    const BasicPool = await hre.ethers.getContractFactory("BasicPool");
    console.log("✅ Contract factory created successfully");
    
    const basicPool = await BasicPool.deploy();
    console.log("✅ Deployment transaction sent");
    
    await basicPool.waitForDeployment();
    console.log("✅ Deployment confirmed");
    
    const address = await basicPool.getAddress();
    console.log("✅ BasicPool deployed at:", address);
    
  } catch (error) {
    console.log("❌ BasicPool deployment failed:");
    console.log("Error:", error.message);
    console.log("Error code:", error.code);
  }

  console.log("\n=== Debug Test Complete ===");
  console.log("This test helps identify which contract types are supported by the Revive pallet.");
}

main().catch((err) => {
  console.error("Debug test failed:", err);
  process.exitCode = 1;
});
