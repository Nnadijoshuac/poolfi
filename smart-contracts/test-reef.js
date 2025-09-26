// Simple test script for Reef team
const hre = require("hardhat");

async function main() {
  console.log("Testing Reef Pelagia deployment...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // Test 1: Minimal contract (no dependencies)
  console.log("\n1. Testing MinimalTest...");
  try {
    const MinimalTest = await hre.ethers.getContractFactory("MinimalTest");
    const contract = await MinimalTest.deploy();
    await contract.waitForDeployment();
    console.log("✅ MinimalTest deployed at:", await contract.getAddress());
  } catch (error) {
    console.log("❌ MinimalTest failed:", error.message);
  }

  // Test 2: MockREEF (with OpenZeppelin)
  console.log("\n2. Testing MockREEF...");
  try {
    const MockREEF = await hre.ethers.getContractFactory("MockREEF");
    const contract = await MockREEF.deploy();
    await contract.waitForDeployment();
    console.log("✅ MockREEF deployed at:", await contract.getAddress());
  } catch (error) {
    console.log("❌ MockREEF failed:", error.message);
  }
}

main().catch(console.error);
