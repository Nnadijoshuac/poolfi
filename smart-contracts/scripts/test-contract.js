const { ethers } = require("hardhat");

async function main() {
  // Replace with your actual contract address
  const CONTRACT_ADDRESS = "0x..."; // PUT YOUR CONTRACT ADDRESS HERE
  
  console.log("Testing SimplePoolManager contract...");
  console.log(`Contract Address: ${CONTRACT_ADDRESS}`);

  // Get the contract
  const SimplePoolManager = await ethers.getContractFactory("SimplePoolManager");
  const contract = SimplePoolManager.attach(CONTRACT_ADDRESS);

  try {
    // Test 1: Check pool count
    console.log("\n1. Checking pool count...");
    const poolCount = await contract.poolCount();
    console.log(`   Pool count: ${poolCount.toString()}`);

    // Test 2: Check if contract is deployed
    console.log("\n2. Checking contract deployment...");
    const code = await ethers.provider.getCode(CONTRACT_ADDRESS);
    if (code === "0x") {
      console.log("   ❌ Contract not found at this address");
      return;
    } else {
      console.log("   ✅ Contract is deployed");
    }

    // Test 3: Try to create a test pool
    console.log("\n3. Testing pool creation...");
    const targetAmount = ethers.parseEther("10"); // 10 REEF
    const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
    const maxMembers = 5;
    
    console.log("   Creating test pool...");
    const tx = await contract.createPool(
      "Test Pool",
      targetAmount,
      ethers.parseEther("1"), // 1 REEF contribution
      maxMembers,
      deadline
    );
    
    console.log(`   Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("   ✅ Pool created successfully!");

    // Test 4: Check pool count again
    const newPoolCount = await contract.poolCount();
    console.log(`   New pool count: ${newPoolCount.toString()}`);

  } catch (error) {
    console.error("❌ Error testing contract:", error.message);
    
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
