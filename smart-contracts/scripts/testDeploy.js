const hre = require("hardhat");

async function main() {
  console.log("Starting test deployment...");
  
  try {
    // Get signers
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    
    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");
    
    // Test network connection
    const network = await deployer.provider.getNetwork();
    console.log("Network:", network);
    
    // Try to deploy MockREEF first (simplest contract)
    console.log("\nDeploying MockREEF...");
    const MockREEF = await hre.ethers.getContractFactory("MockREEF");
    console.log("Contract factory created");
    
    const mockREEF = await MockREEF.deploy();
    console.log("Deployment transaction sent");
    
    await mockREEF.waitForDeployment();
    console.log("Deployment confirmed");
    
    const address = await mockREEF.getAddress();
    console.log("MockREEF deployed at:", address);
    
    // Test a simple function call
    const totalSupply = await mockREEF.totalSupply();
    console.log("Total supply:", hre.ethers.formatEther(totalSupply), "mREEF");
    
  } catch (error) {
    console.error("Deployment failed:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exitCode = 1;
});
