const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Testing minimal deployment to Reef Pelagia...");
  
  try {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    
    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "REEF");

    // Check network
    const network = await ethers.provider.getNetwork();
    console.log("🌐 Network:", network.name, "Chain ID:", network.chainId.toString());

    // Deploy MockREEF token only
    console.log("\n🪙 Deploying MockREEF token...");
    const MockREEF = await ethers.getContractFactory("MockREEF");
    
    // Deploy with minimal gas settings
    const mockREEF = await MockREEF.deploy({
      gasLimit: 5000000,
      gasPrice: ethers.parseUnits("1", "gwei")
    });
    
    console.log("⏳ Waiting for deployment...");
    await mockREEF.waitForDeployment();
    const mockREEFAddress = await mockREEF.getAddress();
    
    console.log("✅ MockREEF deployed to:", mockREEFAddress);

    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    const tokenName = await mockREEF.name();
    const tokenSymbol = await mockREEF.symbol();
    const totalSupply = await mockREEF.totalSupply();
    
    console.log("🪙 Token name:", tokenName);
    console.log("🪙 Token symbol:", tokenSymbol);
    console.log("🪙 Total supply:", ethers.formatEther(totalSupply), "tokens");

    console.log("\n🎉 MINIMAL DEPLOYMENT SUCCESSFUL!");
    console.log("=" * 50);
    console.log("📋 Contract Address:");
    console.log("MockREEF Token:", mockREEFAddress);
    console.log("Network:", network.name);
    console.log("Chain ID:", network.chainId.toString());
    console.log("=" * 50);

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    console.error("Full error:", error);
    
    if (error.message.includes("CodeRejected")) {
      console.log("\n💡 The contract bytecode might be too large for this network");
      console.log("   Try deploying a simpler contract or check network limits");
    } else if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Solution: Get REEF tokens from faucet");
    } else if (error.message.includes("timeout")) {
      console.log("\n💡 Solution: Try again in a few minutes");
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
