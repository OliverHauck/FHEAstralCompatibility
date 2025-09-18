const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS not set in .env");
  }

  console.log("🔍 Verifying contract at:", contractAddress);
  console.log("Network:", hre.network.name);

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });

    console.log("✅ Contract verified successfully!");
    console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}#code`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  Contract already verified");
    } else {
      throw error;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
