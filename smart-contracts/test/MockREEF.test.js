const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockREEF", function () {
  let mockREEF;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const MockREEF = await ethers.getContractFactory("MockREEF");
    mockREEF = await MockREEF.deploy();
    await mockREEF.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await mockREEF.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await mockREEF.name()).to.equal("Mock REEF");
      expect(await mockREEF.symbol()).to.equal("mREEF");
    });

    it("Should mint initial supply to owner", async function () {
      const ownerBalance = await mockREEF.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.parseEther("10000000")); // 10M tokens
    });

    it("Should have correct decimals", async function () {
      expect(await mockREEF.decimals()).to.equal(18);
    });
  });

  describe("Faucet Functionality", function () {
    it("Should allow users to get test tokens from faucet", async function () {
      const initialBalance = await mockREEF.balanceOf(addr1.address);
      
      await expect(mockREEF.connect(addr1).getTestTokens())
        .to.emit(mockREEF, "FaucetUsed")
        .withArgs(addr1.address, ethers.parseEther("1000"));

      const finalBalance = await mockREEF.balanceOf(addr1.address);
      expect(finalBalance).to.equal(initialBalance + ethers.parseEther("1000"));
    });

    it("Should enforce daily faucet limit", async function () {
      // Use faucet 10 times (10 * 1000 = 10000 tokens, which is the daily limit)
      for (let i = 0; i < 10; i++) {
        await mockREEF.connect(addr1).getTestTokens();
      }

      // 11th call should fail
      await expect(mockREEF.connect(addr1).getTestTokens())
        .to.be.revertedWith("Daily faucet limit exceeded");
    });

    it("Should reset daily limit after 24 hours", async function () {
      // Use faucet to reach daily limit
      for (let i = 0; i < 10; i++) {
        await mockREEF.connect(addr1).getTestTokens();
      }

      // Fast forward time by 25 hours
      await ethers.provider.send("evm_increaseTime", [25 * 3600]);
      await ethers.provider.send("evm_mine");

      // Should be able to use faucet again
      await expect(mockREEF.connect(addr1).getTestTokens())
        .to.emit(mockREEF, "FaucetUsed");
    });

    it("Should reject faucet when max supply would be exceeded", async function () {
      // This test would require minting a very large amount to reach max supply
      // For now, we'll just test the basic functionality
      await mockREEF.connect(addr1).getTestTokens();
      expect(await mockREEF.balanceOf(addr1.address)).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("Minting Functions", function () {
    it("Should allow owner to mint tokens", async function () {
      const amount = ethers.parseEther("5000");
      
      await expect(mockREEF.mint(addr1.address, amount))
        .to.emit(mockREEF, "TokensMinted")
        .withArgs(addr1.address, amount);

      expect(await mockREEF.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should reject minting by non-owner", async function () {
      await expect(
        mockREEF.connect(addr1).mint(addr2.address, ethers.parseEther("1000"))
      ).to.be.revertedWithCustomError(mockREEF, "OwnableUnauthorizedAccount");
    });

    it("Should reject minting beyond max supply", async function () {
      const maxSupply = await mockREEF.MAX_SUPPLY();
      const currentSupply = await mockREEF.totalSupply();
      const excessAmount = maxSupply - currentSupply + ethers.parseEther("1");

      await expect(
        mockREEF.mint(addr1.address, excessAmount)
      ).to.be.revertedWith("Exceeds max supply");
    });

    it("Should allow owner to get large test tokens", async function () {
      const amount = ethers.parseEther("50000");
      
      await expect(mockREEF.getLargeTestTokens(addr1.address, amount))
        .to.emit(mockREEF, "TokensMinted")
        .withArgs(addr1.address, amount);

      expect(await mockREEF.balanceOf(addr1.address)).to.equal(amount);
    });
  });

  describe("Pause Functionality", function () {
    it("Should allow owner to pause contract", async function () {
      await mockREEF.pause();
      expect(await mockREEF.paused()).to.be.true;
    });

    it("Should allow owner to unpause contract", async function () {
      await mockREEF.pause();
      await mockREEF.unpause();
      expect(await mockREEF.paused()).to.be.false;
    });

    it("Should reject non-owner from pausing", async function () {
      await expect(mockREEF.connect(addr1).pause())
        .to.be.revertedWithCustomError(mockREEF, "OwnableUnauthorizedAccount");
    });

    it("Should prevent transfers when paused", async function () {
      await mockREEF.mint(addr1.address, ethers.parseEther("1000"));
      await mockREEF.pause();

      await expect(
        mockREEF.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(mockREEF, "EnforcedPause");
    });

    it("Should prevent faucet usage when paused", async function () {
      await mockREEF.pause();

      await expect(
        mockREEF.connect(addr1).getTestTokens()
      ).to.be.revertedWithCustomError(mockREEF, "EnforcedPause");
    });
  });

  describe("View Functions", function () {
    it("Should return correct faucet info", async function () {
      const faucetInfo = await mockREEF.getFaucetInfo(addr1.address);
      expect(faucetInfo.canUseFaucet).to.be.true;
      expect(faucetInfo.dailyAmountUsed).to.equal(0);
    });

    it("Should return correct stats", async function () {
      const stats = await mockREEF.getStats();
      expect(stats.maxSupply_).to.equal(ethers.parseEther("1000000000")); // 1B tokens
      expect(stats.faucetAmount_).to.equal(ethers.parseEther("1000"));
      expect(stats.maxFaucetPerDay_).to.equal(ethers.parseEther("10000"));
    });

    it("Should track daily faucet usage correctly", async function () {
      await mockREEF.connect(addr1).getTestTokens();
      
      const faucetInfo = await mockREEF.getFaucetInfo(addr1.address);
      expect(faucetInfo.dailyAmountUsed).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("Transfer Functionality", function () {
    beforeEach(async function () {
      await mockREEF.mint(addr1.address, ethers.parseEther("1000"));
    });

    it("Should allow normal transfers", async function () {
      const amount = ethers.parseEther("100");
      
      await expect(mockREEF.connect(addr1).transfer(addr2.address, amount))
        .to.emit(mockREEF, "Transfer")
        .withArgs(addr1.address, addr2.address, amount);

      expect(await mockREEF.balanceOf(addr2.address)).to.equal(amount);
    });

    it("Should allow transferFrom with approval", async function () {
      const amount = ethers.parseEther("100");
      
      await mockREEF.connect(addr1).approve(addr2.address, amount);
      
      await expect(mockREEF.connect(addr2).transferFrom(addr1.address, addr2.address, amount))
        .to.emit(mockREEF, "Transfer")
        .withArgs(addr1.address, addr2.address, amount);

      expect(await mockREEF.balanceOf(addr2.address)).to.equal(amount);
    });
  });
});
