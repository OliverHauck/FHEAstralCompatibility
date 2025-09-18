const hre = require("hardhat");

async function main() {
  console.log("🎭 Running compatibility simulation...\n");

  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS not set in .env");
  }

  const [user1, user2, user3] = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractAt("AstralCompatibility", contractAddress);

  // Create profiles
  console.log("👤 Creating user profiles...");

  const tx1 = await contract.connect(user1).createProfile(0, 0, 0); // Aries
  await tx1.wait();
  console.log("  ✅ User1 (Aries) profile created");

  const tx2 = await contract.connect(user2).createProfile(4, 0, 1); // Leo
  await tx2.wait();
  console.log("  ✅ User2 (Leo) profile created");

  const tx3 = await contract.connect(user3).createProfile(8, 0, 2); // Sagittarius
  await tx3.wait();
  console.log("  ✅ User3 (Sagittarius) profile created");

  // Request matches
  console.log("\n💕 Requesting compatibility matches...");

  const match1 = await contract.connect(user1).requestCompatibilityMatch(user2.address);
  await match1.wait();
  console.log("  ✅ Match requested: User1 ↔ User2");

  const match2 = await contract.connect(user1).requestCompatibilityMatch(user3.address);
  await match2.wait();
  console.log("  ✅ Match requested: User1 ↔ User3");

  const match3 = await contract.connect(user2).requestCompatibilityMatch(user3.address);
  await match3.wait();
  console.log("  ✅ Match requested: User2 ↔ User3");

  // Check stats
  const totalMatches = await contract.totalMatches();
  console.log("\n📊 Total matches:", totalMatches.toString());

  const user1MatchCount = await contract.userMatchCount(user1.address);
  console.log("📊 User1 match count:", user1MatchCount.toString());

  console.log("\n✅ Simulation complete!");
  console.log("🔓 Use reveal functions to decrypt compatibility scores");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
