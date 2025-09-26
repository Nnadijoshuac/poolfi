const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Testing network connectivity...");
  
  try {
    console.log("1. Getting provider...");
    const provider = ethers.provider;
    console.log("✅ Provider obtained");
    
    console.log("2. Getting network info...");
    const network = await provider.getNetwork();
    console.log("✅ Network:", network.name, "Chain ID:", network.chainId.toString());
    
    console.log("3. Getting block number...");
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Current block number:", blockNumber);
    
    console.log("4. Getting gas price...");
    const gasPrice = await provider.getGasPrice();
    console.log("✅ Gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
    
    console.log("5. Getting signers...");
    const signers = await ethers.getSigners();
    console.log("✅ Signers count:", signers.length);
    
    if (signers.length > 0) {
      const [deployer] = signers;
      console.log("✅ Deployer address:", deployer.address);
      
      console.log("6. Getting balance...");
      const balance = await provider.getBalance(deployer.address);
      console.log("✅ Balance:", ethers.formatEther(balance), "REEF");
    }
    
    console.log("🎉 Network test successful!");
    
  } catch (error) {
    console.error("❌ Network test failed:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
  }
}

main()
  .then(() => {
    console.log("Test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
