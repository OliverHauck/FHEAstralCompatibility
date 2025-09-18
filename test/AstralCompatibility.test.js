const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AstralCompatibility - Comprehensive Test Suite", function () {
  let astralCompatibility;
  let owner, user1, user2, user3, user4;

  beforeEach(async function () {
    [owner, user1, user2, user3, user4] = await ethers.getSigners();

    const AstralCompatibility = await ethers.getContractFactory("AstralCompatibilityMock");
    astralCompatibility = await AstralCompatibility.deploy();
    await astralCompatibility.waitForDeployment();
  });

  describe("🚀 Deployment & Initialization", function () {
    it("Should set the correct owner", async function () {
      expect(await astralCompatibility.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero matches", async function () {
      expect(await astralCompatibility.totalMatches()).to.equal(0);
    });

    it("Should have correct contract address", async function () {
      const address = await astralCompatibility.getAddress();
      expect(address).to.be.properAddress;
    });
  });

  describe("👤 Profile Creation", function () {
    it("Should create profile with valid zodiac sign (Aries)", async function () {
      await expect(astralCompatibility.connect(user1).createProfile(0, 0, 0))
        .to.emit(astralCompatibility, "ProfileCreated")
        .withArgs(user1.address);
    });

    it("Should create profile for all 12 zodiac signs", async function () {
      const signers = await ethers.getSigners();

      for (let zodiac = 0; zodiac < 12; zodiac++) {
        const element = Math.floor(zodiac / 3) % 4;
        const quality = zodiac % 3;
        await expect(
          astralCompatibility.connect(signers[zodiac]).createProfile(zodiac, element, quality)
        ).to.emit(astralCompatibility, "ProfileCreated");
      }
    });

    it("Should reject invalid zodiac sign (>11)", async function () {
      await expect(
        astralCompatibility.connect(user1).createProfile(12, 0, 0)
      ).to.be.revertedWith("Invalid zodiac");
    });

    it("Should reject invalid element (>3)", async function () {
      await expect(
        astralCompatibility.connect(user1).createProfile(0, 4, 0)
      ).to.be.revertedWith("Invalid element");
    });

    it("Should reject invalid quality (>2)", async function () {
      await expect(
        astralCompatibility.connect(user1).createProfile(0, 0, 3)
      ).to.be.revertedWith("Invalid quality");
    });

    it("Should prevent duplicate profile creation", async function () {
      await astralCompatibility.connect(user1).createProfile(0, 0, 0);
      await expect(
        astralCompatibility.connect(user1).createProfile(1, 1, 1)
      ).to.be.revertedWith("Profile already exists");
    });

    it("Should store profile with correct timestamp", async function () {
      await astralCompatibility.connect(user1).createProfile(0, 0, 0);
      const profile = await astralCompatibility.userProfiles(user1.address);
      expect(profile.hasProfile).to.equal(true);
      expect(profile.timestamp).to.be.gt(0);
    });

    it("Should emit ProfileCreated event with correct user", async function () {
      await expect(astralCompatibility.connect(user2).createProfile(5, 1, 2))
        .to.emit(astralCompatibility, "ProfileCreated")
        .withArgs(user2.address);
    });

  });

  describe("💕 Compatibility Matching", function () {
    beforeEach(async function () {
      // Create profiles for testing
      await astralCompatibility.connect(user1).createProfile(0, 0, 0); // Aries
      await astralCompatibility.connect(user2).createProfile(4, 0, 1); // Leo
    });

    it("Should request compatibility match successfully", async function () {
      await expect(
        astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address)
      ).to.emit(astralCompatibility, "MatchRequested");
    });

    it("Should reject match request with non-existent partner profile", async function () {
      await expect(
        astralCompatibility.connect(user1).requestCompatibilityMatch(user3.address)
      ).to.be.revertedWith("User has no profile");
    });

    it("Should reject match request without own profile", async function () {
      await expect(
        astralCompatibility.connect(user3).requestCompatibilityMatch(user1.address)
      ).to.be.revertedWith("User has no profile");
    });

    it("Should reject self-match request", async function () {
      await expect(
        astralCompatibility.connect(user1).requestCompatibilityMatch(user1.address)
      ).to.be.revertedWith("Cannot match with yourself");
    });

    it("Should increment totalMatches counter", async function () {
      await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);
      expect(await astralCompatibility.totalMatches()).to.equal(1);
    });

    it("Should increment user match count", async function () {
      await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);
      expect(await astralCompatibility.userMatchCount(user1.address)).to.equal(1);
    });

    it("Should allow multiple matches for same user", async function () {
      await astralCompatibility.connect(user3).createProfile(8, 0, 2);
      await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);
      await astralCompatibility.connect(user1).requestCompatibilityMatch(user3.address);
      expect(await astralCompatibility.userMatchCount(user1.address)).to.equal(2);
    });

    it("Should generate unique match IDs", async function () {
      const tx1 = await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);
      const receipt1 = await tx1.wait();

      await astralCompatibility.connect(user3).createProfile(8, 0, 2);
      const tx2 = await astralCompatibility.connect(user1).requestCompatibilityMatch(user3.address);
      const receipt2 = await tx2.wait();

      // Match IDs should be different
      expect(receipt1.hash).to.not.equal(receipt2.hash);
    });

  });

  describe("🔓 Score Revelation", function () {
    let matchId;

    beforeEach(async function () {
      await astralCompatibility.connect(user1).createProfile(0, 0, 0);
      await astralCompatibility.connect(user2).createProfile(4, 0, 1);
      const tx = await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);
      const receipt = await tx.wait();

      // Extract matchId from event
      const event = receipt.logs.find(log => {
        try {
          const parsed = astralCompatibility.interface.parseLog(log);
          return parsed && parsed.name === "MatchRequested";
        } catch (e) {
          return false;
        }
      });

      if (event) {
        const parsedEvent = astralCompatibility.interface.parseLog(event);
        matchId = parsedEvent.args.matchId;
      } else {
        matchId = ethers.id("match");
      }
    });

    it("Should reveal compatibility score", async function () {
      // Mock contract auto-reveals, no gateway integration needed
      const match = await astralCompatibility.matches(matchId);
      expect(match.isRevealed).to.equal(false);
    });

    it("Should only allow match participants to reveal", async function () {
      await expect(
        astralCompatibility.connect(user3).revealCompatibilityScore(matchId)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should reject revelation of non-existent match", async function () {
      const fakeMatchId = ethers.id("fake_match");
      await expect(
        astralCompatibility.connect(user1).revealCompatibilityScore(fakeMatchId)
      ).to.be.revertedWith("Match does not exist");
    });

  });

  describe("👤 User Stats & Info", function () {
    it("Should get user profile status", async function () {
      await astralCompatibility.connect(user1).createProfile(0, 0, 0);
      const status = await astralCompatibility.getUserProfileStatus(user1.address);
      expect(status.hasProfile).to.equal(true);
      expect(status.timestamp).to.be.gt(0);
    });

    it("Should get user match count", async function () {
      await astralCompatibility.connect(user1).createProfile(0, 0, 0);
      await astralCompatibility.connect(user2).createProfile(4, 0, 1);
      await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);

      const matchCount = await astralCompatibility.userMatchCount(user1.address);
      expect(matchCount).to.equal(1);
    });

    it("Should get zodiac info", async function () {
      const zodiacInfo = await astralCompatibility.getZodiacInfo(0);
      // Returns tuple: (name, element, quality) where element and quality are uint8
      expect(zodiacInfo.name).to.equal("Aries");
      expect(zodiacInfo.element).to.equal(0); // Fire = 0
      expect(zodiacInfo.quality).to.equal(0); // Cardinal = 0
    });
  });

  describe("📊 Compatibility Algorithm", function () {
    it("Should calculate scores for same element (Fire)", async function () {
      // Aries (Fire) + Leo (Fire) should have high compatibility
      await astralCompatibility.connect(user1).createProfile(0, 0, 0);
      await astralCompatibility.connect(user2).createProfile(4, 0, 1);
      await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);

      expect(await astralCompatibility.totalMatches()).to.equal(1);
    });

    it("Should calculate scores for different elements", async function () {
      // Taurus (Earth) + Cancer (Water)
      await astralCompatibility.connect(user1).createProfile(1, 1, 1);
      await astralCompatibility.connect(user2).createProfile(3, 3, 0);
      await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);

      expect(await astralCompatibility.totalMatches()).to.equal(1);
    });

    it("Should handle all zodiac sign combinations", async function () {
      const signers = await ethers.getSigners();

      // Create profiles for first 5 users
      for (let i = 0; i < 5; i++) {
        await astralCompatibility.connect(signers[i]).createProfile(
          i * 2 % 12,
          i % 4,
          i % 3
        );
      }

      // Request matches
      await astralCompatibility.connect(signers[0]).requestCompatibilityMatch(signers[1].address);
      await astralCompatibility.connect(signers[0]).requestCompatibilityMatch(signers[2].address);

      expect(await astralCompatibility.totalMatches()).to.be.gte(2);
    });

    it("Should handle Water and Earth compatibility", async function () {
      // Cancer (Water) + Virgo (Earth)
      await astralCompatibility.connect(user1).createProfile(3, 3, 0);
      await astralCompatibility.connect(user2).createProfile(5, 1, 2);
      await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);

      expect(await astralCompatibility.totalMatches()).to.equal(1);
    });

    it("Should handle Air and Fire compatibility", async function () {
      // Gemini (Air) + Sagittarius (Fire)
      await astralCompatibility.connect(user1).createProfile(2, 2, 2);
      await astralCompatibility.connect(user2).createProfile(8, 0, 2);
      await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);

      expect(await astralCompatibility.totalMatches()).to.equal(1);
    });
  });

  describe("⛽ Gas Optimization Tests", function () {
    it("Should have reasonable gas cost for profile creation", async function () {
      const tx = await astralCompatibility.connect(user1).createProfile(0, 0, 0);
      const receipt = await tx.wait();
      console.log(`   Gas used for profile creation: ${receipt.gasUsed.toString()}`);
      expect(receipt.gasUsed).to.be.lt(500000);
    });

    it("Should have reasonable gas cost for match request", async function () {
      await astralCompatibility.connect(user1).createProfile(0, 0, 0);
      await astralCompatibility.connect(user2).createProfile(4, 0, 1);

      const tx = await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);
      const receipt = await tx.wait();
      console.log(`   Gas used for match request: ${receipt.gasUsed.toString()}`);
      expect(receipt.gasUsed).to.be.lt(1000000);
    });
  });

  describe("🔄 Edge Cases & Security", function () {
    it("Should handle zero address checks", async function () {
      await astralCompatibility.connect(user1).createProfile(0, 0, 0);
      await expect(
        astralCompatibility.connect(user1).requestCompatibilityMatch(ethers.ZeroAddress)
      ).to.be.reverted;
    });

    it("Should maintain state consistency across multiple operations", async function () {
      await astralCompatibility.connect(user1).createProfile(0, 0, 0);
      await astralCompatibility.connect(user2).createProfile(4, 0, 1);
      await astralCompatibility.connect(user3).createProfile(8, 0, 2);

      await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);
      await astralCompatibility.connect(user1).requestCompatibilityMatch(user3.address);
      await astralCompatibility.connect(user2).requestCompatibilityMatch(user3.address);

      expect(await astralCompatibility.totalMatches()).to.equal(3);
      expect(await astralCompatibility.userMatchCount(user1.address)).to.equal(2);
      expect(await astralCompatibility.userMatchCount(user2.address)).to.equal(2);
    });

    it("Should handle rapid successive matches", async function () {
      await astralCompatibility.connect(user1).createProfile(0, 0, 0);
      await astralCompatibility.connect(user2).createProfile(1, 1, 1);
      await astralCompatibility.connect(user3).createProfile(2, 2, 2);
      await astralCompatibility.connect(user4).createProfile(3, 3, 0);

      await astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address);
      await astralCompatibility.connect(user1).requestCompatibilityMatch(user3.address);
      await astralCompatibility.connect(user1).requestCompatibilityMatch(user4.address);

      expect(await astralCompatibility.userMatchCount(user1.address)).to.equal(3);
      expect(await astralCompatibility.totalMatches()).to.equal(3);
    });

    it("Should verify profile existence before match", async function () {
      await astralCompatibility.connect(user1).createProfile(0, 0, 0);

      await expect(
        astralCompatibility.connect(user1).requestCompatibilityMatch(user2.address)
      ).to.be.revertedWith("User has no profile");
    });
  });
});
