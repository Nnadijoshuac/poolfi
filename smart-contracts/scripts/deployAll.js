const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // List of contracts to deploy
  const contracts = ["MockREEF", "BasicPool", "MinimalPool", "PoolManager", "SimplePoolManager"];
  const deployed = {};

  for (const name of contracts) {
    console.log(`\nDeploying ${name}...`);
    try {
      const Factory = await hre.ethers.getContractFactory(name);
      const contract = await Factory.deploy();
      await contract.waitForDeployment();
      const address = await contract.getAddress();
      deployed[name] = address;
      console.log(`${name} deployed at:`, address);
      
      // Verify deployment by calling a simple function
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
      deployed[name] = "FAILED";
    }
  }

  console.log("\n✅ Deployment Summary:");
  console.log("====================");
  for (const [name, address] of Object.entries(deployed)) {
    if (address === "FAILED") {
      console.log(`❌ ${name}: FAILED`);
    } else {
      console.log(`✅ ${name}: ${address}`);
    }
  }

  // Save deployment addresses to a file for easy reference
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: deployed
  };
  
  fs.writeFileSync(
    `deployments-${hre.network.name}-${Date.now()}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`\n📄 Deployment info saved to deployments-${hre.network.name}-${Date.now()}.json`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
