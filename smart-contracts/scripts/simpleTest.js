const hre = require("hardhat");

async function main() {
  console.log("Testing contract interaction...");
  
  try {
    const [signer] = await hre.ethers.getSigners();
    console.log("Signer:", signer.address);
    
    // Deploy MockREEF
    console.log("\nDeploying MockREEF...");
    const MockREEF = await hre.ethers.getContractFactory("MockREEF");
    const mockREEF = await MockREEF.deploy();
    await mockREEF.waitForDeployment();
    const address = await mockREEF.getAddress();
    console.log("MockREEF deployed at:", address);
    
    // Test direct function call
    console.log("\nTesting direct function call...");
    const totalSupply = await mockREEF.totalSupply();
    console.log("Total supply:", hre.ethers.formatEther(totalSupply), "mREEF");
    
    // Test balance
    const balance = await mockREEF.balanceOf(signer.address);
    console.log("Signer balance:", hre.ethers.formatEther(balance), "mREEF");
    
    // Test faucet
    console.log("\nTesting faucet...");
    const faucetTx = await mockREEF.getTestTokens();
    await faucetTx.wait();
    console.log("Faucet transaction successful");
    
    const newBalance = await mockREEF.balanceOf(signer.address);
    console.log("New balance:", hre.ethers.formatEther(newBalance), "mREEF");
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exitCode = 1;
});
