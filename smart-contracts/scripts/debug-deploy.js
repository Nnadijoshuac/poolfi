const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Debug deployment script starting...");
  
  try {
    console.log("1. Getting signers...");
    const [deployer] = await ethers.getSigners();
    console.log("✅ Deployer address:", deployer.address);
    
    console.log("2. Checking balance...");
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("✅ Balance:", ethers.formatEther(balance), "REEF");
    
    console.log("3. Checking network...");
    const network = await ethers.provider.getNetwork();
    console.log("✅ Network:", network.name, "Chain ID:", network.chainId.toString());
    
    console.log("4. Getting contract factory...");
    const MockREEF = await ethers.getContractFactory("MockREEF");
    console.log("✅ Contract factory obtained");
    
    console.log("5. Estimating gas...");
    const deployTx = await MockREEF.getDeployTransaction();
    const gasEstimate = await deployer.estimateGas(deployTx);
    console.log("✅ Gas estimate:", gasEstimate.toString());
    
    console.log("6. Deploying contract...");
    const mockREEF = await MockREEF.deploy({
      gasLimit: gasEstimate + 100000n, // Add buffer
    });
    console.log("✅ Contract deployment transaction sent");
    
    console.log("7. Waiting for deployment...");
    await mockREEF.waitForDeployment();
    const address = await mockREEF.getAddress();
    console.log("✅ Contract deployed to:", address);
    
    console.log("🎉 SUCCESS! Contract deployed successfully");
    
  } catch (error) {
    console.error("❌ Error occurred:", error.message);
    console.error("Error code:", error.code);
    console.error("Error details:", error);
  }
}

main()
  .then(() => {
    console.log("Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
