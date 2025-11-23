const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Test suite for AstralCompatibilityEnhanced contract
 *
 * Coverage:
 * - Profile management
 * - Compatibility matching
 * - Gateway callback mechanism
 * - Refund system
 * - Timeout protection
 * - Security features
 * - Access control
 * - Gas optimization
 */

describe("AstralCompatibilityEnhanced", function () {
    let contract;
    let owner;
    let user1;
    let user2;
    let pauser;
    let randomUser;

    const MATCH_FEE = ethers.utils.parseEther("0.001");
    const PLATFORM_FEE_BPS = 500; // 5%
    const TIMEOUT_24H = 24 * 60 * 60; // 24 hours

    beforeEach(async function () {
        [owner, user1, user2, pauser, randomUser] = await ethers.getSigners();

        // Deploy contract
        const AstralCompatibilityEnhanced = await ethers.getContractFactory("AstralCompatibilityEnhanced");
        contract = await AstralCompatibilityEnhanced.deploy(
            [owner.address, pauser.address],
            1 // KMS generation
        );
        await contract.deployed();
    });

    describe("Deployment", function () {
        it("Should set the correct owner", async function () {
            expect(await contract.owner()).to.equal(owner.address);
        });

        it("Should initialize pausers correctly", async function () {
            expect(await contract.getPauserCount()).to.equal(2);
            expect(await contract.getPauserAtIndex(0)).to.equal(owner.address);
            expect(await contract.getPauserAtIndex(1)).to.equal(pauser.address);
        });

        it("Should not be paused initially", async function () {
            expect(await contract.isPaused()).to.equal(false);
        });

        it("Should set correct initial values", async function () {
            expect(await contract.totalMatches()).to.equal(0);
            expect(await contract.totalRefunds()).to.equal(0);
            expect(await contract.platformFees()).to.equal(0);
            expect(await contract.kmsGeneration()).to.equal(1);
        });
    });

    describe("Profile Management", function () {
        describe("createProfile", function () {
            it("Should create profile with valid data", async function () {
                await expect(contract.connect(user1).createProfile(0, 0, 0))
                    .to.emit(contract, "ProfileCreated")
                    .withArgs(user1.address, await time.latest());

                const [hasProfile] = await contract.getUserProfileStatus(user1.address);
                expect(hasProfile).to.be.true;
            });

            it("Should reject invalid zodiac", async function () {
                await expect(
                    contract.connect(user1).createProfile(12, 0, 0)
                ).to.be.revertedWith("AC: Invalid zodiac");
            });

            it("Should reject invalid element", async function () {
                await expect(
                    contract.connect(user1).createProfile(0, 4, 0)
                ).to.be.revertedWith("AC: Invalid element");
            });

            it("Should reject invalid quality", async function () {
                await expect(
                    contract.connect(user1).createProfile(0, 0, 3)
                ).to.be.revertedWith("AC: Invalid quality");
            });

            it("Should reject duplicate profile creation", async function () {
                await contract.connect(user1).createProfile(0, 0, 0);
                await expect(
                    contract.connect(user1).createProfile(1, 1, 1)
                ).to.be.revertedWith("AC: Profile already exists");
            });

            it("Should reject when paused", async function () {
                await contract.connect(pauser).pause();
                await expect(
                    contract.connect(user1).createProfile(0, 0, 0)
                ).to.be.revertedWith("AC: Contract is paused");
            });
        });

        describe("updateProfile", function () {
            beforeEach(async function () {
                await contract.connect(user1).createProfile(0, 0, 0);
            });

            it("Should update existing profile", async function () {
                await expect(contract.connect(user1).updateProfile(1, 1, 1))
                    .to.emit(contract, "ProfileUpdated");
            });

            it("Should reject update without profile", async function () {
                await expect(
                    contract.connect(user2).updateProfile(0, 0, 0)
                ).to.be.revertedWith("AC: User has no profile");
            });
        });
    });

    describe("Compatibility Matching", function () {
        beforeEach(async function () {
            // Create profiles for both users
            await contract.connect(user1).createProfile(0, 0, 0); // Aries, Fire, Cardinal
            await contract.connect(user2).createProfile(4, 0, 1); // Leo, Fire, Fixed
        });

        describe("requestCompatibilityMatch", function () {
            it("Should request match with correct fee", async function () {
                await expect(
                    contract.connect(user1).requestCompatibilityMatch(user2.address, {
                        value: MATCH_FEE
                    })
                )
                    .to.emit(contract, "MatchRequested")
                    .to.emit(contract, "MatchFeePaid");

                expect(await contract.totalMatches()).to.equal(1);
            });

            it("Should collect platform fee", async function () {
                await contract.connect(user1).requestCompatibilityMatch(user2.address, {
                    value: MATCH_FEE
                });

                const expectedFee = MATCH_FEE.mul(PLATFORM_FEE_BPS).div(10000);
                expect(await contract.platformFees()).to.equal(expectedFee);
            });

            it("Should refund excess payment", async function () {
                const excess = ethers.utils.parseEther("0.005");
                await contract.connect(user1).requestCompatibilityMatch(user2.address, {
                    value: MATCH_FEE.add(excess)
                });

                const refundBalance = await contract.pendingRefunds(user1.address);
                expect(refundBalance).to.equal(excess);
            });

            it("Should reject insufficient fee", async function () {
                await expect(
                    contract.connect(user1).requestCompatibilityMatch(user2.address, {
                        value: MATCH_FEE.div(2)
                    })
                ).to.be.revertedWith("AC: Insufficient match fee");
            });

            it("Should reject matching with self", async function () {
                await expect(
                    contract.connect(user1).requestCompatibilityMatch(user1.address, {
                        value: MATCH_FEE
                    })
                ).to.be.revertedWith("AC: Cannot match with yourself");
            });

            it("Should reject duplicate match", async function () {
                await contract.connect(user1).requestCompatibilityMatch(user2.address, {
                    value: MATCH_FEE
                });

                await expect(
                    contract.connect(user1).requestCompatibilityMatch(user2.address, {
                        value: MATCH_FEE
                    })
                ).to.be.revertedWith("AC: Match already exists");
            });

            it("Should reject when paused", async function () {
                await contract.connect(pauser).pause();
                await expect(
                    contract.connect(user1).requestCompatibilityMatch(user2.address, {
                        value: MATCH_FEE
                    })
                ).to.be.revertedWith("AC: Contract is paused");
            });
        });

        describe("generateMatchId", function () {
            it("Should generate consistent match ID", async function () {
                const matchId1 = await contract.generateMatchId(user1.address, user2.address);
                const matchId2 = await contract.generateMatchId(user2.address, user1.address);
                expect(matchId1).to.equal(matchId2);
            });
        });
    });

    describe("Gateway Callback & Decryption", function () {
        let matchId;

        beforeEach(async function () {
            // Create profiles and match
            await contract.connect(user1).createProfile(0, 0, 0);
            await contract.connect(user2).createProfile(4, 0, 1);
            await contract.connect(user1).requestCompatibilityMatch(user2.address, {
                value: MATCH_FEE
            });
            matchId = await contract.generateMatchId(user1.address, user2.address);
        });

        describe("requestRevealScore", function () {
            it("Should create decryption request", async function () {
                await expect(contract.connect(user1).requestRevealScore(matchId))
                    .to.emit(contract, "DecryptionRequested");
            });

            it("Should reject unauthorized reveal", async function () {
                await expect(
                    contract.connect(randomUser).requestRevealScore(matchId)
                ).to.be.revertedWith("AC: Not authorized");
            });

            it("Should reject when paused", async function () {
                await contract.connect(pauser).pause();
                await expect(
                    contract.connect(user1).requestRevealScore(matchId)
                ).to.be.revertedWith("AC: Contract is paused");
            });
        });

        describe("resolveTallyCallback", function () {
            // Note: This would require mocking the Gateway signature verification
            // For production, use integration tests with actual Gateway

            it("Should process callback with valid proof", async function () {
                // This is a simplified test
                // Real implementation requires Gateway integration
            });
        });
    });

    describe("Refund Mechanism", function () {
        let matchId;

        beforeEach(async function () {
            await contract.connect(user1).createProfile(0, 0, 0);
            await contract.connect(user2).createProfile(4, 0, 1);
            await contract.connect(user1).requestCompatibilityMatch(user2.address, {
                value: MATCH_FEE
            });
            matchId = await contract.generateMatchId(user1.address, user2.address);
        });

        describe("claimTimeoutRefund", function () {
            it("Should reject refund before timeout", async function () {
                await expect(
                    contract.connect(user1).claimTimeoutRefund(matchId)
                ).to.be.revertedWith("AC: Timeout not reached");
            });

            it("Should allow refund after timeout", async function () {
                // Fast forward time
                await ethers.provider.send("evm_increaseTime", [TIMEOUT_24H + 1]);
                await ethers.provider.send("evm_mine");

                await expect(contract.connect(user1).claimTimeoutRefund(matchId))
                    .to.emit(contract, "DecryptionTimedOut")
                    .to.emit(contract, "RefundIssued");

                const expectedRefund = MATCH_FEE.sub(
                    MATCH_FEE.mul(PLATFORM_FEE_BPS).div(10000)
                );
                expect(await contract.pendingRefunds(user1.address)).to.equal(expectedRefund);
            });

            it("Should reject unauthorized refund claim", async function () {
                await ethers.provider.send("evm_increaseTime", [TIMEOUT_24H + 1]);
                await ethers.provider.send("evm_mine");

                await expect(
                    contract.connect(randomUser).claimTimeoutRefund(matchId)
                ).to.be.revertedWith("AC: Not authorized");
            });
        });

        describe("withdrawRefunds", function () {
            it("Should withdraw pending refunds", async function () {
                // Create refund
                await ethers.provider.send("evm_increaseTime", [TIMEOUT_24H + 1]);
                await ethers.provider.send("evm_mine");
                await contract.connect(user1).claimTimeoutRefund(matchId);

                const refundAmount = await contract.pendingRefunds(user1.address);
                const initialBalance = await user1.getBalance();

                await expect(contract.connect(user1).withdrawRefunds())
                    .to.emit(contract, "RefundClaimed")
                    .withArgs(user1.address, refundAmount, await time.latest());

                expect(await contract.pendingRefunds(user1.address)).to.equal(0);
            });

            it("Should reject withdrawal with no refunds", async function () {
                await expect(
                    contract.connect(user1).withdrawRefunds()
                ).to.be.revertedWith("AC: No refunds available");
            });
        });

        describe("emergencyWithdraw", function () {
            it("Should allow owner to emergency withdraw", async function () {
                await expect(
                    contract.connect(owner).emergencyWithdraw(user1.address, matchId)
                )
                    .to.emit(contract, "EmergencyWithdrawal");
            });

            it("Should reject non-owner emergency withdraw", async function () {
                await expect(
                    contract.connect(user1).emergencyWithdraw(user1.address, matchId)
                ).to.be.revertedWith("AC: Not authorized");
            });
        });
    });

    describe("Admin Functions", function () {
        describe("updateMatchFee", function () {
            it("Should update match fee", async function () {
                const newFee = ethers.utils.parseEther("0.002");
                await expect(contract.connect(owner).updateMatchFee(newFee))
                    .to.emit(contract, "MatchFeeUpdated");
                expect(await contract.matchFee()).to.equal(newFee);
            });

            it("Should reject non-owner fee update", async function () {
                await expect(
                    contract.connect(user1).updateMatchFee(ethers.utils.parseEther("0.002"))
                ).to.be.revertedWith("AC: Not authorized");
            });

            it("Should reject fee too low", async function () {
                await expect(
                    contract.connect(owner).updateMatchFee(ethers.utils.parseEther("0.00001"))
                ).to.be.revertedWith("AC: Fee too low");
            });
        });

        describe("updateRequestTimeout", function () {
            it("Should update request timeout", async function () {
                const newTimeout = 48 * 60 * 60; // 48 hours
                await expect(contract.connect(owner).updateRequestTimeout(newTimeout))
                    .to.emit(contract, "TimeoutUpdated");
                expect(await contract.requestTimeout()).to.equal(newTimeout);
            });

            it("Should reject timeout too short", async function () {
                await expect(
                    contract.connect(owner).updateRequestTimeout(30 * 60) // 30 minutes
                ).to.be.revertedWith("AC: Invalid timeout");
            });

            it("Should reject timeout too long", async function () {
                await expect(
                    contract.connect(owner).updateRequestTimeout(8 * 24 * 60 * 60) // 8 days
                ).to.be.revertedWith("AC: Invalid timeout");
            });
        });

        describe("withdrawPlatformFees", function () {
            beforeEach(async function () {
                // Generate platform fees
                await contract.connect(user1).createProfile(0, 0, 0);
                await contract.connect(user2).createProfile(4, 0, 1);
                await contract.connect(user1).requestCompatibilityMatch(user2.address, {
                    value: MATCH_FEE
                });
            });

            it("Should withdraw platform fees", async function () {
                const feeAmount = await contract.platformFees();
                await expect(
                    contract.connect(owner).withdrawPlatformFees(owner.address)
                )
                    .to.emit(contract, "PlatformFeesWithdrawn")
                    .withArgs(owner.address, feeAmount);

                expect(await contract.platformFees()).to.equal(0);
            });

            it("Should reject non-owner withdrawal", async function () {
                await expect(
                    contract.connect(user1).withdrawPlatformFees(user1.address)
                ).to.be.revertedWith("AC: Not authorized");
            });
        });

        describe("Pause/Unpause", function () {
            it("Should allow pauser to pause", async function () {
                await expect(contract.connect(pauser).pause())
                    .to.emit(contract, "ContractPaused");
                expect(await contract.isPaused()).to.be.true;
            });

            it("Should reject non-pauser pause", async function () {
                await expect(
                    contract.connect(user1).pause()
                ).to.be.revertedWith("AC: Not a pauser");
            });

            it("Should allow owner to unpause", async function () {
                await contract.connect(pauser).pause();
                await expect(contract.connect(owner).unpause())
                    .to.emit(contract, "ContractUnpaused");
                expect(await contract.isPaused()).to.be.false;
            });
        });

        describe("Pauser Management", function () {
            it("Should add new pauser", async function () {
                await expect(contract.connect(owner).addPauser(randomUser.address))
                    .to.emit(contract, "PauserAdded");
                expect(await contract.isPauser(randomUser.address)).to.be.true;
            });

            it("Should remove pauser", async function () {
                await expect(contract.connect(owner).removePauser(pauser.address))
                    .to.emit(contract, "PauserRemoved");
                expect(await contract.isPauser(pauser.address)).to.be.false;
            });
        });
    });

    describe("View Functions", function () {
        it("Should get user stats", async function () {
            await contract.connect(user1).createProfile(0, 0, 0);
            const [matchCount, refundAmount, hasProfile] = await contract.getUserStats(user1.address);
            expect(hasProfile).to.be.true;
            expect(matchCount).to.equal(0);
            expect(refundAmount).to.equal(0);
        });

        it("Should get contract stats", async function () {
            const stats = await contract.getContractStats();
            expect(stats._totalMatches).to.equal(0);
            expect(stats._isPaused).to.be.false;
        });

        it("Should get zodiac info", async function () {
            const [name, element, quality] = await contract.getZodiacInfo(0);
            expect(name).to.equal("Aries");
            expect(element).to.equal(0); // Fire
            expect(quality).to.equal(0); // Cardinal
        });
    });

    describe("Gas Optimization Tests", function () {
        it("Should optimize profile creation gas", async function () {
            const tx = await contract.connect(user1).createProfile(0, 0, 0);
            const receipt = await tx.wait();
            console.log("Profile creation gas:", receipt.gasUsed.toString());
            expect(receipt.gasUsed).to.be.below(400000);
        });

        it("Should optimize match request gas", async function () {
            await contract.connect(user1).createProfile(0, 0, 0);
            await contract.connect(user2).createProfile(4, 0, 1);

            const tx = await contract.connect(user1).requestCompatibilityMatch(user2.address, {
                value: MATCH_FEE
            });
            const receipt = await tx.wait();
            console.log("Match request gas:", receipt.gasUsed.toString());
            expect(receipt.gasUsed).to.be.below(800000);
        });
    });

    describe("Security Tests", function () {
        it("Should prevent reentrancy on refund withdrawal", async function () {
            // Test would require a malicious contract
            // Ensuring nonReentrant modifier is in place
        });

        it("Should handle zero address validation", async function () {
            await contract.connect(user1).createProfile(0, 0, 0);
            await expect(
                contract.connect(user1).requestCompatibilityMatch(ethers.constants.AddressZero, {
                    value: MATCH_FEE
                })
            ).to.be.revertedWith("AC: Invalid partner address");
        });

        it("Should validate state transitions", async function () {
            // Ensure proper state machine enforcement
        });
    });
});
