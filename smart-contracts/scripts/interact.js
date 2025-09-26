const hre = require("hardhat");

async function main() {
  // Contract addresses from local hardhat deployment
  const CONTRACT_ADDRESSES = {
    MockREEF: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    BasicPool: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    MinimalPool: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    PoolManager: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    SimplePoolManager: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  };

  const [signer] = await hre.ethers.getSigners();
  console.log("Interacting with contracts using signer:", signer.address);
  console.log("Signer balance:", hre.ethers.formatEther(await signer.provider.getBalance(signer.address)), "ETH");

  // Example 1: Interact with MockREEF contract
  if (CONTRACT_ADDRESSES.MockREEF !== "0x0000000000000000000000000000000000000000") {
    console.log("\n=== MockREEF Contract Interaction ===");
    try {
      const MockREEF = await hre.ethers.getContractFactory("MockREEF");
      const mockREEF = MockREEF.attach(CONTRACT_ADDRESSES.MockREEF);
      
      // Get total supply
      const totalSupply = await mockREEF.totalSupply();
      console.log("Total supply:", hre.ethers.formatEther(totalSupply), "mREEF");
      
      // Get balance of signer
      const balance = await mockREEF.balanceOf(signer.address);
      console.log("Signer balance:", hre.ethers.formatEther(balance), "mREEF");
      
      // Try to get test tokens from faucet
      console.log("Attempting to get test tokens from faucet...");
      const faucetTx = await mockREEF.getTestTokens();
      await faucetTx.wait();
      console.log("✅ Successfully got test tokens from faucet");
      
      // Check new balance
      const newBalance = await mockREEF.balanceOf(signer.address);
      console.log("New balance:", hre.ethers.formatEther(newBalance), "mREEF");
      
    } catch (error) {
      console.log("❌ MockREEF interaction failed:", error.message);
    }
  }

  // Example 2: Interact with BasicPool contract
  if (CONTRACT_ADDRESSES.BasicPool !== "0x0000000000000000000000000000000000000000") {
    console.log("\n=== BasicPool Contract Interaction ===");
    try {
      const BasicPool = await hre.ethers.getContractFactory("BasicPool");
      const basicPool = BasicPool.attach(CONTRACT_ADDRESSES.BasicPool);
      
      // Get pool count
      const poolCount = await basicPool.poolCount();
      console.log("Pool count:", poolCount.toString());
      
      // Create a new pool
      console.log("Creating a new pool...");
      const createPoolTx = await basicPool.createPool(
        "Test Pool",
        "A test pool for demonstration",
        hre.ethers.parseEther("10"), // 10 ETH target
        hre.ethers.parseEther("1"),  // 1 ETH contribution
        5, // max 5 members
        7 * 24 * 60 * 60 // 7 days deadline
      );
      await createPoolTx.wait();
      console.log("✅ Pool created successfully");
      
      // Get updated pool count
      const newPoolCount = await basicPool.poolCount();
      console.log("New pool count:", newPoolCount.toString());
      
    } catch (error) {
      console.log("❌ BasicPool interaction failed:", error.message);
    }
  }

  // Example 3: Interact with PoolManager contract
  if (CONTRACT_ADDRESSES.PoolManager !== "0x0000000000000000000000000000000000000000") {
    console.log("\n=== PoolManager Contract Interaction ===");
    try {
      const PoolManager = await hre.ethers.getContractFactory("PoolManager");
      const poolManager = PoolManager.attach(CONTRACT_ADDRESSES.PoolManager);
      
      // Get pool count
      const poolCount = await poolManager.poolCount();
      console.log("Pool count:", poolCount.toString());
      
      // Get platform fee
      const platformFee = await poolManager.platformFee();
      console.log("Platform fee:", platformFee.toString(), "basis points");
      
      // Get fee recipient
      const feeRecipient = await poolManager.feeRecipient();
      console.log("Fee recipient:", feeRecipient);
      
    } catch (error) {
      console.log("❌ PoolManager interaction failed:", error.message);
    }
  }

  // Example 4: Interact with SimplePoolManager contract
  if (CONTRACT_ADDRESSES.SimplePoolManager !== "0x0000000000000000000000000000000000000000") {
    console.log("\n=== SimplePoolManager Contract Interaction ===");
    try {
      const SimplePoolManager = await hre.ethers.getContractFactory("SimplePoolManager");
      const simplePoolManager = SimplePoolManager.attach(CONTRACT_ADDRESSES.SimplePoolManager);
      
      // Get pool count
      const poolCount = await simplePoolManager.poolCount();
      console.log("Pool count:", poolCount.toString());
      
    } catch (error) {
      console.log("❌ SimplePoolManager interaction failed:", error.message);
    }
  }

  // Example 5: Interact with MinimalPool contract
  if (CONTRACT_ADDRESSES.MinimalPool !== "0x0000000000000000000000000000000000000000") {
    console.log("\n=== MinimalPool Contract Interaction ===");
    try {
      const MinimalPool = await hre.ethers.getContractFactory("MinimalPool");
      const minimalPool = MinimalPool.attach(CONTRACT_ADDRESSES.MinimalPool);
      
      // Get pool count
      const poolCount = await minimalPool.poolCount();
      console.log("Pool count:", poolCount.toString());
      
    } catch (error) {
      console.log("❌ MinimalPool interaction failed:", error.message);
    }
  }

  console.log("\n✅ Contract interaction completed!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});