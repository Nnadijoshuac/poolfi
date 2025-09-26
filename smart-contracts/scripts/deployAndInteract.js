const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying and interacting with contracts using account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  const contracts = ["MockREEF", "BasicPool", "MinimalPool", "PoolManager", "SimplePoolManager"];
  const deployed = {};

  // Deploy all contracts
  for (const name of contracts) {
    console.log(`\n=== Deploying ${name} ===`);
    try {
      const Factory = await hre.ethers.getContractFactory(name);
      const contract = await Factory.deploy();
      await contract.waitForDeployment();
      const address = await contract.getAddress();
      deployed[name] = { contract, address };
      console.log(`${name} deployed at:`, address);
      
      // Test basic functionality
      if (name === "MockREEF") {
        const totalSupply = await contract.totalSupply();
        console.log(`  - Total supply: ${hre.ethers.formatEther(totalSupply)} mREEF`);
        
        // Test faucet
        console.log("  - Testing faucet...");
        const faucetTx = await contract.getTestTokens();
        await faucetTx.wait();
        const newBalance = await contract.balanceOf(deployer.address);
        console.log(`  - New balance: ${hre.ethers.formatEther(newBalance)} mREEF`);
        
      } else if (name === "BasicPool") {
        const poolCount = await contract.poolCount();
        console.log(`  - Pool count: ${poolCount}`);
        
        // Test creating a pool
        console.log("  - Testing pool creation...");
        const createTx = await contract.createPool(
          "Test Pool",
          "A test pool for demonstration",
          hre.ethers.parseEther("10"), // 10 ETH target
          hre.ethers.parseEther("1"),  // 1 ETH contribution
          5, // max 5 members
          7 * 24 * 60 * 60 // 7 days deadline
        );
        await createTx.wait();
        const newPoolCount = await contract.poolCount();
        console.log(`  - New pool count: ${newPoolCount}`);
        
      } else if (name === "MinimalPool") {
        const poolCount = await contract.poolCount();
        console.log(`  - Pool count: ${poolCount}`);
        
      } else if (name === "PoolManager") {
        const poolCount = await contract.poolCount();
        console.log(`  - Pool count: ${poolCount}`);
        const platformFee = await contract.platformFee();
        console.log(`  - Platform fee: ${platformFee} basis points`);
        
      } else if (name === "SimplePoolManager") {
        const poolCount = await contract.poolCount();
        console.log(`  - Pool count: ${poolCount}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to deploy ${name}:`, error.message);
      deployed[name] = { contract: null, address: "FAILED" };
    }
  }

  console.log("\n✅ Deployment and Interaction Summary:");
  console.log("=====================================");
  for (const [name, info] of Object.entries(deployed)) {
    if (info.address === "FAILED") {
      console.log(`❌ ${name}: FAILED`);
    } else {
      console.log(`✅ ${name}: ${info.address}`);
    }
  }

  // Save deployment addresses
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: Object.fromEntries(
      Object.entries(deployed).map(([name, info]) => [name, info.address])
    )
  };
  
  const filename = `deployments-${hre.network.name}-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n📄 Deployment info saved to ${filename}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
