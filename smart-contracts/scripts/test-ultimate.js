const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing PoolFi Ultimate Contract...");
  
  // Replace with your deployed contract address
  const CONTRACT_ADDRESS = "0x..."; // PUT YOUR CONTRACT ADDRESS HERE
  
  console.log(`Contract Address: ${CONTRACT_ADDRESS}`);

  // Get the contract
  const PoolFiUltimate = await ethers.getContractFactory("PoolFiUltimate");
  const contract = PoolFiUltimate.attach(CONTRACT_ADDRESS);

  try {
    // Test 1: Check contract deployment
    console.log("\n1. Checking contract deployment...");
    const code = await ethers.provider.getCode(CONTRACT_ADDRESS);
    if (code === "0x") {
      console.log("   ❌ Contract not found at this address");
      return;
    } else {
      console.log("   ✅ Contract is deployed");
    }

    // Test 2: Check pool count
    console.log("\n2. Checking pool count...");
    const poolCount = await contract.poolCount();
    console.log(`   Pool count: ${poolCount.toString()}`);

    // Test 3: Check contract balance
    console.log("\n3. Checking contract balance...");
    const balance = await contract.getContractBalance();
    console.log(`   Contract balance: ${ethers.formatEther(balance)} REEF`);

    // Test 4: Check stats
    console.log("\n4. Checking contract stats...");
    const stats = await contract.getPoolStats();
    console.log(`   Total pools: ${stats.totalPools.toString()}`);
    console.log(`   Active pools: ${stats.activePools.toString()}`);
    console.log(`   Completed pools: ${stats.completedPools.toString()}`);
    console.log(`   Total volume: ${ethers.formatEther(stats.totalVolume)} REEF`);

    // Test 5: Try to create a test pool
    console.log("\n5. Testing pool creation...");
    const targetAmount = ethers.parseEther("10"); // 10 REEF
    const contributionAmount = ethers.parseEther("1"); // 1 REEF
    const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
    
    console.log("   Creating test pool...");
    const tx = await contract.createPool(
      "Hackathon Test Pool",
      "Test pool for hackathon submission",
      targetAmount,
      contributionAmount,
      5, // max members
      deadline
    );
    
    console.log(`   Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("   ✅ Pool created successfully!");

    // Test 6: Check new pool count
    const newPoolCount = await contract.poolCount();
    console.log(`   New pool count: ${newPoolCount.toString()}`);

    // Test 7: Get pool info
    console.log("\n6. Testing pool info retrieval...");
    const poolInfo = await contract.getPoolInfo(1);
    console.log(`   Pool 1 name: ${poolInfo.name}`);
    console.log(`   Pool 1 target: ${ethers.formatEther(poolInfo.targetAmount)} REEF`);
    console.log(`   Pool 1 active: ${poolInfo.isActive}`);

    console.log("\n🎉 All tests passed! Contract is ready for hackathon! 🎉");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("   💡 You need more REEF tokens for gas");
    } else if (error.message.includes("execution reverted")) {
      console.log("   💡 Contract function failed - check the error details");
    } else if (error.message.includes("network")) {
      console.log("   💡 Network connection issue");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
