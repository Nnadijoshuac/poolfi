const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying to Reef Pelagia with account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // Check network
  const network = await deployer.provider.getNetwork();
  console.log("Network:", network);

  const contracts = ["MockREEF", "BasicPool", "MinimalPool", "PoolManager", "SimplePoolManager"];
  const deployed = {};

  for (const name of contracts) {
    console.log(`\n=== Deploying ${name} ===`);
    try {
      const Factory = await hre.ethers.getContractFactory(name);
      console.log(`Contract factory created for ${name}`);
      
      // Deploy with specific gas settings
      const deployOptions = {
        gasLimit: 8000000, // High gas limit
        gasPrice: hre.ethers.parseUnits("1", "gwei"), // 1 gwei
      };
      
      console.log(`Deploying ${name} with gas limit: ${deployOptions.gasLimit}`);
      const contract = await Factory.deploy(deployOptions);
      console.log(`Deployment transaction sent for ${name}`);
      
      await contract.waitForDeployment();
      console.log(`Deployment confirmed for ${name}`);
      
      const address = await contract.getAddress();
      deployed[name] = address;
      console.log(`${name} deployed at:`, address);
      
      // Test basic functionality
      try {
        if (name === "MockREEF") {
          const totalSupply = await contract.totalSupply();
          console.log(`  - Total supply: ${hre.ethers.formatEther(totalSupply)} mREEF`);
        } else if (name === "BasicPool" || name === "MinimalPool" || name === "PoolManager" || name === "SimplePoolManager") {
          const poolCount = await contract.poolCount();
          console.log(`  - Pool count: ${poolCount}`);
        }
      } catch (verifyError) {
        console.log(`  - Contract deployed but verification call failed: ${verifyError.message}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to deploy ${name}:`, error.message);
      if (error.message.includes("CodeRejected")) {
        console.log("  - This might be due to Reef network restrictions or contract size limits");
      }
      deployed[name] = "FAILED";
    }
  }

  console.log("\n✅ Reef Pelagia Deployment Summary:");
  console.log("==================================");
  for (const [name, address] of Object.entries(deployed)) {
    if (address === "FAILED") {
      console.log(`❌ ${name}: FAILED`);
    } else {
      console.log(`✅ ${name}: ${address}`);
    }
  }

  // Save deployment addresses
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: deployed
  };
  
  const filename = `deployments-reef-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n📄 Deployment info saved to ${filename}`);
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exitCode = 1;
});
