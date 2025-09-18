const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying AstralCompatibility contract...");
  console.log("Network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy contract
  const AstralCompatibility = await hre.ethers.getContractFactory("AstralCompatibility");
  const astralCompatibility = await AstralCompatibility.deploy();
  await astralCompatibility.waitForDeployment();

  const contractAddress = await astralCompatibility.getAddress();
  console.log("✅ AstralCompatibility deployed to:", contractAddress);

  // Initialize pausers if configured
  const numPausers = process.env.NUM_PAUSERS || 0;
  if (numPausers > 0) {
    console.log(`\n🔐 Adding ${numPausers} pausers...`);
    for (let i = 0; i < numPausers; i++) {
      const pauserAddress = process.env[`PAUSER_ADDRESS_${i}`];
      if (pauserAddress) {
        const tx = await astralCompatibility.addPauser(pauserAddress);
        await tx.wait();
        console.log(`  ✅ Added pauser ${i + 1}: ${pauserAddress}`);
      }
    }
  }

  // Update KMS generation if specified
  const kmsGeneration = process.env.KMS_GENERATION || 1;
  if (kmsGeneration > 1) {
    console.log(`\n🔑 Updating KMS generation to ${kmsGeneration}...`);
    const tx = await astralCompatibility.updateKmsGeneration(kmsGeneration);
    await tx.wait();
    console.log("  ✅ KMS generation updated");
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contract: "AstralCompatibility",
    address: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    numPausers: numPausers,
    kmsGeneration: kmsGeneration,
  };

  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n⏳ Waiting for block confirmations...");
  await astralCompatibility.deploymentTransaction().wait(5);

  console.log("\n✅ Deployment complete!");
  console.log("\n📝 Next steps:");
  console.log("1. Verify contract: npm run verify");
  console.log("2. Update frontend config with contract address");
  console.log("3. Test interactions: npm run interact");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
