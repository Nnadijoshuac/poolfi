const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying to Reef Pelagia with account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // Check network
  const network = await deployer.provider.getNetwork();
  console.log("Network:", network);

  // Try deploying just MockREEF first with minimal settings
  console.log("\n=== Deploying MockREEF (Simple) ===");
  try {
    const MockREEF = await hre.ethers.getContractFactory("MockREEF");
    console.log("Contract factory created for MockREEF");
    
    // Deploy without any special options first
    console.log("Deploying MockREEF...");
    const mockREEF = await MockREEF.deploy();
    console.log("Deployment transaction sent");
    
    await mockREEF.waitForDeployment();
    console.log("Deployment confirmed");
    
    const address = await mockREEF.getAddress();
    console.log(`✅ MockREEF deployed at: ${address}`);
    
    // Test basic functionality
    const totalSupply = await mockREEF.totalSupply();
    console.log(`Total supply: ${hre.ethers.formatEther(totalSupply)} mREEF`);
    
    // Test faucet
    console.log("Testing faucet...");
    const faucetTx = await mockREEF.getTestTokens();
    await faucetTx.wait();
    const balance = await mockREEF.balanceOf(deployer.address);
    console.log(`New balance: ${hre.ethers.formatEther(balance)} mREEF`);
    
  } catch (error) {
    console.error("❌ MockREEF deployment failed:", error.message);
    console.error("Full error:", error);
  }
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exitCode = 1;
});
