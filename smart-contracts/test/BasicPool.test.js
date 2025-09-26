const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BasicPool", function () {
  let basicPool;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    const BasicPool = await ethers.getContractFactory("BasicPool");
    basicPool = await BasicPool.deploy();
    await basicPool.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await basicPool.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero pool count", async function () {
      expect(await basicPool.poolCount()).to.equal(0);
    });
  });

  describe("Pool Creation", function () {
    it("Should create a pool successfully", async function () {
      const poolName = "Test Pool";
      const poolDescription = "A test pool for testing";
      const targetAmount = ethers.parseEther("10");
      const contributionAmount = ethers.parseEther("1");
      const maxMembers = 5;
      const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

      const tx = await basicPool.createPool(
        poolName,
        poolDescription,
        targetAmount,
        contributionAmount,
        maxMembers,
        deadline
      );

      await expect(tx)
        .to.emit(basicPool, "PoolCreated")
        .withArgs(0, owner.address, poolName, targetAmount, contributionAmount, maxMembers, deadline);

      expect(await basicPool.poolCount()).to.equal(1);
    });

    it("Should reject empty pool name", async function () {
      await expect(
        basicPool.createPool(
          "",
          "Description",
          ethers.parseEther("10"),
          ethers.parseEther("1"),
          5,
          Math.floor(Date.now() / 1000) + 86400
        )
      ).to.be.revertedWith("Pool name cannot be empty");
    });

    it("Should reject zero target amount", async function () {
      await expect(
        basicPool.createPool(
          "Test Pool",
          "Description",
          0,
          ethers.parseEther("1"),
          5,
          Math.floor(Date.now() / 1000) + 86400
        )
      ).to.be.revertedWith("Target amount must be greater than 0");
    });
  });

  describe("Pool Joining", function () {
    let poolId;

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      const tx = await basicPool.createPool(
        "Test Pool",
        "A test pool",
        ethers.parseEther("10"),
        ethers.parseEther("1"),
        3,
        deadline
      );
      poolId = 0;
    });

    it("Should allow users to join pool", async function () {
      await expect(basicPool.connect(addr1).joinPool(poolId))
        .to.emit(basicPool, "MemberJoined")
        .withArgs(poolId, addr1.address);

      expect(await basicPool.isPoolMember(poolId, addr1.address)).to.be.true;
    });

    it("Should reject joining non-existent pool", async function () {
      await expect(basicPool.connect(addr1).joinPool(999))
        .to.be.revertedWith("Pool does not exist");
    });

    it("Should reject joining when already a member", async function () {
      await basicPool.connect(addr1).joinPool(poolId);
      await expect(basicPool.connect(addr1).joinPool(poolId))
        .to.be.revertedWith("Already a member");
    });

    it("Should reject joining when pool is full", async function () {
      // Fill the pool (max 3 members, creator is already 1)
      await basicPool.connect(addr1).joinPool(poolId);
      await basicPool.connect(addr2).joinPool(poolId);
      
      await expect(basicPool.connect(addr3).joinPool(poolId))
        .to.be.revertedWith("Pool is full");
    });
  });

  describe("Contributions", function () {
    let poolId;

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await basicPool.createPool(
        "Test Pool",
        "A test pool",
        ethers.parseEther("10"),
        ethers.parseEther("1"),
        5,
        deadline
      );
      poolId = 0;
      await basicPool.connect(addr1).joinPool(poolId);
    });

    it("Should allow members to contribute", async function () {
      const contributionAmount = ethers.parseEther("1");
      
      await expect(basicPool.connect(addr1).contribute(poolId, { value: contributionAmount }))
        .to.emit(basicPool, "ContributionMade")
        .withArgs(poolId, addr1.address, contributionAmount);

      expect(await basicPool.getUserContribution(poolId, addr1.address)).to.equal(contributionAmount);
    });

    it("Should reject contribution from non-member", async function () {
      await expect(
        basicPool.connect(addr2).contribute(poolId, { value: ethers.parseEther("1") })
      ).to.be.revertedWith("Not a pool member");
    });

    it("Should reject incorrect contribution amount", async function () {
      await expect(
        basicPool.connect(addr1).contribute(poolId, { value: ethers.parseEther("2") })
      ).to.be.revertedWith("Incorrect contribution amount");
    });

    it("Should complete pool when target is reached", async function () {
      const contributionAmount = ethers.parseEther("1");
      
      // Add more members to reach target
      await basicPool.connect(addr2).joinPool(poolId);
      await basicPool.connect(addr3).joinPool(poolId);
      
      // Make contributions to reach target
      for (let i = 0; i < 10; i++) {
        await basicPool.connect(addr1).contribute(poolId, { value: contributionAmount });
      }

      const poolInfo = await basicPool.getPoolInfo(poolId);
      expect(poolInfo.completed).to.be.true;
      expect(poolInfo.active).to.be.false;
    });
  });

  describe("Fund Withdrawal", function () {
    let poolId;

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 2; // 48 hours from now
      await basicPool.createPool(
        "Test Pool",
        "A test pool",
        ethers.parseEther("10"),
        ethers.parseEther("1"),
        5,
        deadline
      );
      poolId = 0;
      await basicPool.connect(addr1).joinPool(poolId);
      
      // Complete the pool
      for (let i = 0; i < 10; i++) {
        await basicPool.connect(addr1).contribute(poolId, { value: ethers.parseEther("1") });
      }
    });

    it("Should allow members to withdraw their contributions", async function () {
      const initialBalance = await ethers.provider.getBalance(addr1.address);
      
      await expect(basicPool.connect(addr1).withdrawFunds(poolId))
        .to.emit(basicPool, "FundsWithdrawn")
        .withArgs(poolId, addr1.address, ethers.parseEther("10"));

      const finalBalance = await ethers.provider.getBalance(addr1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should reject withdrawal from non-completed pool", async function () {
      // Create a new pool that's not completed
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await basicPool.createPool(
        "Incomplete Pool",
        "A test pool",
        ethers.parseEther("10"),
        ethers.parseEther("1"),
        5,
        deadline
      );
      const incompletePoolId = 1;
      await basicPool.connect(addr1).joinPool(incompletePoolId);
      
      await expect(
        basicPool.connect(addr1).withdrawFunds(incompletePoolId)
      ).to.be.revertedWith("Pool is not completed");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to emergency withdraw", async function () {
      // First, send some ETH to the contract
      await owner.sendTransaction({
        to: await basicPool.getAddress(),
        value: ethers.parseEther("1")
      });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await basicPool.emergencyWithdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);
      
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should reject non-owner from emergency withdraw", async function () {
      await expect(basicPool.connect(addr1).emergencyWithdraw())
        .to.be.revertedWithCustomError(basicPool, "OwnableUnauthorizedAccount");
    });
  });

  describe("View Functions", function () {
    let poolId;

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      await basicPool.createPool(
        "Test Pool",
        "A test pool",
        ethers.parseEther("10"),
        ethers.parseEther("1"),
        5,
        deadline
      );
      poolId = 0;
    });

    it("Should return correct pool information", async function () {
      const poolInfo = await basicPool.getPoolInfo(poolId);
      expect(poolInfo.name).to.equal("Test Pool");
      expect(poolInfo.creator).to.equal(owner.address);
      expect(poolInfo.targetAmount).to.equal(ethers.parseEther("10"));
    });

    it("Should return correct pool members", async function () {
      await basicPool.connect(addr1).joinPool(poolId);
      const members = await basicPool.getPoolMembers(poolId);
      expect(members).to.include(owner.address);
      expect(members).to.include(addr1.address);
    });

    it("Should return correct total balance", async function () {
      // Send some ETH to contract
      await owner.sendTransaction({
        to: await basicPool.getAddress(),
        value: ethers.parseEther("5")
      });

      expect(await basicPool.getTotalBalance()).to.equal(ethers.parseEther("5"));
    });
  });
});
