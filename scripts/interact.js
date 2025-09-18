const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS not set in .env");
  }

  console.log("🔗 Interacting with AstralCompatibility at:", contractAddress);

  const [signer] = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractAt("AstralCompatibility", contractAddress);

  // Check owner
  const owner = await contract.owner();
  console.log("📋 Contract owner:", owner);

  // Check total matches
  const totalMatches = await contract.totalMatches();
  console.log("📊 Total matches:", totalMatches.toString());

  // Check if user has profile
  const profile = await contract.userProfiles(signer.address);
  console.log("👤 Your profile exists:", profile.hasProfile);

  // Create profile if doesn't exist
  if (!profile.hasProfile) {
    console.log("\n🆕 Creating profile (Aries, Fire, Cardinal)...");
    const tx = await contract.createProfile(0, 0, 0);
    await tx.wait();
    console.log("✅ Profile created!");
  }

  // Check paused status
  const isPaused = await contract.isPaused();
  console.log("⏸️  Contract paused:", isPaused);

  // Check KMS generation
  const kmsGeneration = await contract.kmsGeneration();
  console.log("🔑 KMS generation:", kmsGeneration.toString());

  console.log("\n✅ Interaction complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
