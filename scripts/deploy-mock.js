const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying AstralCompatibilityMock contract (for testing)...");
  console.log("Network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy mock contract
  const AstralCompatibilityMock = await hre.ethers.getContractFactory("AstralCompatibilityMock");
  const astralCompatibility = await AstralCompatibilityMock.deploy();
  await astralCompatibility.waitForDeployment();

  const contractAddress = await astralCompatibility.getAddress();
  console.log("✅ AstralCompatibilityMock deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contract: "AstralCompatibilityMock",
    address: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
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
