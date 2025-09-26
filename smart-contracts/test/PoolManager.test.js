const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PoolManager", function () {
  let poolManager;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    const PoolManager = await ethers.getContractFactory("PoolManager");
    poolManager = await PoolManager.deploy();
    await poolManager.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await poolManager.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero pool count", async function () {
      expect(await poolManager.poolCount()).to.equal(0);
    });

    it("Should set default platform fee", async function () {
      expect(await poolManager.platformFee()).to.equal(100); // 1%
    });
  });

  describe("Pool Creation", function () {
    it("Should create a pool successfully", async function () {
      const poolName = "Test Pool";
      const poolDescription = "A test pool for testing";
      const targetAmount = ethers.parseEther("10");
      const contributionAmount = ethers.parseEther("1");
      const maxMembers = 5;
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 2; // 48 hours from now

      const tx = await poolManager.createPool(
        poolName,
        poolDescription,
        targetAmount,
        contributionAmount,
        maxMembers,
        deadline
      );

      await expect(tx)
        .to.emit(poolManager, "PoolCreated")
        .withArgs(0, owner.address, poolName, targetAmount, contributionAmount, maxMembers, deadline);

      expect(await poolManager.poolCount()).to.equal(1);
    });

    it("Should reject empty pool name", async function () {
      await expect(
        poolManager.createPool(
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
        poolManager.createPool(
          "Test Pool",
          "Description",
          0,
          ethers.parseEther("1"),
          5,
          Math.floor(Date.now() / 1000) + 86400
        )
      ).to.be.revertedWith("Target amount must be greater than 0");
    });

    it("Should reject past deadline", async function () {
      const pastDeadline = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      await expect(
        poolManager.createPool(
          "Test Pool",
          "Description",
          ethers.parseEther("10"),
          ethers.parseEther("1"),
          5,
          pastDeadline
        )
      ).to.be.revertedWith("Deadline must be in the future");
    });
  });

  describe("Pool Joining", function () {
    let poolId;

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 2; // 48 hours from now
      const tx = await poolManager.createPool(
        "Test Pool",
        "A test pool",
        ethers.parseEther("10"),
        ethers.parseEther("1"),
        3,
        deadline
      );
      const receipt = await tx.wait();
      poolId = 0;
    });

    it("Should allow users to join pool", async function () {
      await expect(poolManager.connect(addr1).joinPool(poolId))
        .to.emit(poolManager, "MemberJoined")
        .withArgs(poolId, addr1.address);

      expect(await poolManager.isPoolMember(poolId, addr1.address)).to.be.true;
    });

    it("Should reject joining non-existent pool", async function () {
      await expect(poolManager.connect(addr1).joinPool(999))
        .to.be.revertedWith("Pool does not exist");
    });

    it("Should reject joining when already a member", async function () {
      await poolManager.connect(addr1).joinPool(poolId);
      await expect(poolManager.connect(addr1).joinPool(poolId))
        .to.be.revertedWith("Already a member");
    });

    it("Should reject joining when pool is full", async function () {
      // Fill the pool (max 3 members, creator is already 1)
      await poolManager.connect(addr1).joinPool(poolId);
      await poolManager.connect(addr2).joinPool(poolId);
      
      await expect(poolManager.connect(addr3).joinPool(poolId))
        .to.be.revertedWith("Pool is full");
    });
  });

  describe("Contributions", function () {
    let poolId;

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 2; // 48 hours from now
      await poolManager.createPool(
        "Test Pool",
        "A test pool",
        ethers.parseEther("10"),
        ethers.parseEther("1"),
        5,
        deadline
      );
      poolId = 0;
      await poolManager.connect(addr1).joinPool(poolId);
    });

    it("Should allow members to contribute", async function () {
      const contributionAmount = ethers.parseEther("1");
      
      await expect(poolManager.connect(addr1).contribute(poolId, { value: contributionAmount }))
        .to.emit(poolManager, "ContributionMade")
        .withArgs(poolId, addr1.address, contributionAmount);

      expect(await poolManager.getUserContribution(poolId, addr1.address)).to.equal(contributionAmount);
    });

    it("Should reject contribution from non-member", async function () {
      await expect(
        poolManager.connect(addr2).contribute(poolId, { value: ethers.parseEther("1") })
      ).to.be.revertedWith("Not a pool member");
    });

    it("Should reject incorrect contribution amount", async function () {
      await expect(
        poolManager.connect(addr1).contribute(poolId, { value: ethers.parseEther("2") })
      ).to.be.revertedWith("Incorrect contribution amount");
    });

    it("Should complete pool when target is reached", async function () {
      const contributionAmount = ethers.parseEther("1");
      const targetAmount = ethers.parseEther("10");
      
      // Add more members to reach target
      await poolManager.connect(addr2).joinPool(poolId);
      await poolManager.connect(addr3).joinPool(poolId);
      
      // Make contributions to reach target
      for (let i = 0; i < 10; i++) {
        await poolManager.connect(addr1).contribute(poolId, { value: contributionAmount });
      }

      const poolInfo = await poolManager.getPoolInfo(poolId);
      expect(poolInfo.isCompleted).to.be.true;
      expect(poolInfo.isActive).to.be.false;
    });
  });

  describe("Fund Withdrawal", function () {
    let poolId;

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 2; // 48 hours from now
      await poolManager.createPool(
        "Test Pool",
        "A test pool",
        ethers.parseEther("10"),
        ethers.parseEther("1"),
        5,
        deadline
      );
      poolId = 0;
      await poolManager.connect(addr1).joinPool(poolId);
      
      // Complete the pool
      for (let i = 0; i < 10; i++) {
        await poolManager.connect(addr1).contribute(poolId, { value: ethers.parseEther("1") });
      }
    });

    it("Should allow members to withdraw their contributions", async function () {
      const initialBalance = await ethers.provider.getBalance(addr1.address);
      
      await expect(poolManager.connect(addr1).withdrawFunds(poolId))
        .to.emit(poolManager, "FundsWithdrawn")
        .withArgs(poolId, addr1.address, ethers.parseEther("10"));

      const finalBalance = await ethers.provider.getBalance(addr1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should reject withdrawal from non-completed pool", async function () {
      // Create a new pool that's not completed
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 2; // 48 hours from now
      await poolManager.createPool(
        "Incomplete Pool",
        "A test pool",
        ethers.parseEther("10"),
        ethers.parseEther("1"),
        5,
        deadline
      );
      const incompletePoolId = 1;
      await poolManager.connect(addr1).joinPool(incompletePoolId);
      
      await expect(
        poolManager.connect(addr1).withdrawFunds(incompletePoolId)
      ).to.be.revertedWith("Pool is not completed");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to pause contract", async function () {
      await poolManager.pause();
      expect(await poolManager.paused()).to.be.true;
    });

    it("Should allow owner to unpause contract", async function () {
      await poolManager.pause();
      await poolManager.unpause();
      expect(await poolManager.paused()).to.be.false;
    });

    it("Should reject non-owner from pausing", async function () {
      await expect(poolManager.connect(addr1).pause())
        .to.be.revertedWithCustomError(poolManager, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to set platform fee", async function () {
      await poolManager.setPlatformFee(200); // 2%
      expect(await poolManager.platformFee()).to.equal(200);
    });

    it("Should reject platform fee above maximum", async function () {
      await expect(poolManager.setPlatformFee(600)) // 6%
        .to.be.revertedWith("Fee too high");
    });
  });

  describe("View Functions", function () {
    let poolId;

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400 * 2; // 48 hours from now
      await poolManager.createPool(
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
      const poolInfo = await poolManager.getPoolInfo(poolId);
      expect(poolInfo.name).to.equal("Test Pool");
      expect(poolInfo.creator).to.equal(owner.address);
      expect(poolInfo.targetAmount).to.equal(ethers.parseEther("10"));
    });

    it("Should return correct pool members", async function () {
      await poolManager.connect(addr1).joinPool(poolId);
      const members = await poolManager.getPoolMembers(poolId);
      expect(members).to.include(owner.address);
      expect(members).to.include(addr1.address);
    });

    it("Should return correct user pools", async function () {
      const userPools = await poolManager.getUserPools(owner.address);
      expect(userPools).to.include(BigInt(poolId));
    });
  });
});
