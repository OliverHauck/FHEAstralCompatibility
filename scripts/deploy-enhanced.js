const hre = require("hardhat");

/**
 * Deployment script for AstralCompatibilityEnhanced contract
 *
 * Features:
 * - Gateway callback mode
 * - Refund mechanism
 * - Timeout protection
 * - Enhanced security
 */

async function main() {
    console.log("\n=== Deploying AstralCompatibilityEnhanced ===\n");

    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Configuration
    const PAUSER_ADDRESSES = [
        deployer.address, // Deployer is first pauser
        // Add additional pauser addresses here if needed
        // "0x1234567890123456789012345678901234567890",
    ];

    const KMS_GENERATION = 1; // Current KMS generation number

    console.log("\nConfiguration:");
    console.log("- Pauser addresses:", PAUSER_ADDRESSES.length);
    PAUSER_ADDRESSES.forEach((addr, i) => {
        console.log(`  [${i}]: ${addr}`);
    });
    console.log("- KMS Generation:", KMS_GENERATION);

    // Deploy contract
    console.log("\nDeploying AstralCompatibilityEnhanced...");
    const AstralCompatibilityEnhanced = await hre.ethers.getContractFactory("AstralCompatibilityEnhanced");
    const contract = await AstralCompatibilityEnhanced.deploy(
        PAUSER_ADDRESSES,
        KMS_GENERATION
    );

    await contract.deployed();

    console.log("\n✅ Contract deployed successfully!");
    console.log("Contract address:", contract.address);

    // Display initial configuration
    console.log("\n=== Initial Configuration ===");
    const owner = await contract.owner();
    const totalMatches = await contract.totalMatches();
    const matchFee = await contract.matchFee();
    const requestTimeout = await contract.requestTimeout();
    const isPaused = await contract.isPaused();
    const kmsGeneration = await contract.kmsGeneration();

    console.log("Owner:", owner);
    console.log("Total Matches:", totalMatches.toString());
    console.log("Match Fee:", hre.ethers.utils.formatEther(matchFee), "ETH");
    console.log("Request Timeout:", requestTimeout.toString(), "seconds (", requestTimeout / 3600, "hours)");
    console.log("Is Paused:", isPaused);
    console.log("KMS Generation:", kmsGeneration.toString());

    // Get pauser count
    const pauserCount = await contract.getPauserCount();
    console.log("\n=== Pausers ===");
    console.log("Total Pausers:", pauserCount.toString());
    for (let i = 0; i < pauserCount; i++) {
        const pauser = await contract.getPauserAtIndex(i);
        const isPauserStatus = await contract.isPauser(pauser);
        console.log(`Pauser ${i}:`, pauser, "- Active:", isPauserStatus);
    }

    // Display contract stats
    const stats = await contract.getContractStats();
    console.log("\n=== Contract Statistics ===");
    console.log("Total Matches:", stats._totalMatches.toString());
    console.log("Total Refunds:", stats._totalRefunds.toString());
    console.log("Platform Fees:", hre.ethers.utils.formatEther(stats._platformFees), "ETH");
    console.log("Match Fee:", hre.ethers.utils.formatEther(stats._matchFee), "ETH");
    console.log("Request Timeout:", stats._requestTimeout.toString(), "seconds");
    console.log("Is Paused:", stats._isPaused);

    // Save deployment info
    const deploymentInfo = {
        network: hre.network.name,
        contractAddress: contract.address,
        deployer: deployer.address,
        deploymentTime: new Date().toISOString(),
        configuration: {
            pauserAddresses: PAUSER_ADDRESSES,
            kmsGeneration: KMS_GENERATION,
            matchFee: hre.ethers.utils.formatEther(matchFee),
            requestTimeout: requestTimeout.toString(),
        },
        transactionHash: contract.deployTransaction.hash,
        blockNumber: contract.deployTransaction.blockNumber,
    };

    console.log("\n=== Deployment Info ===");
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // Verification instructions
    console.log("\n=== Verification Instructions ===");
    console.log("To verify the contract on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contract.address} \\`);
    console.log(`  '${JSON.stringify(PAUSER_ADDRESSES)}' \\`);
    console.log(`  ${KMS_GENERATION}`);

    console.log("\n=== Frontend Configuration ===");
    console.log("Update your frontend config with:");
    console.log("CONTRACT_ADDRESS:", contract.address);
    console.log("NETWORK:", hre.network.name);
    console.log("CHAIN_ID:", (await hre.ethers.provider.getNetwork()).chainId);

    console.log("\n=== Next Steps ===");
    console.log("1. Verify contract on Etherscan (see instructions above)");
    console.log("2. Update frontend configuration");
    console.log("3. Test profile creation");
    console.log("4. Test compatibility matching");
    console.log("5. Test refund mechanism");
    console.log("6. Monitor Gateway callback functionality");

    console.log("\n✅ Deployment completed successfully!\n");
}

// Execute deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });
