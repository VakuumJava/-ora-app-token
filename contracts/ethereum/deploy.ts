import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Ethereum NFT Contract Deployment Script
 * Network: Ethereum Mainnet
 * 
 * Prerequisites:
 * 1. Set PRIVATE_KEY and ETHERSCAN_API_KEY in .env
 * 2. Ensure wallet has sufficient ETH for deployment (~0.05-0.1 ETH)
 * 3. Run: npx hardhat run contracts/ethereum/deploy.ts --network mainnet
 */

async function main() {
    console.log('🚀 Starting Qora NFT Deployment to Ethereum MAINNET...\n');

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);
    
    console.log('📍 Deploying from:', deployer.address);
    console.log('💰 Account balance:', ethers.formatEther(balance), 'ETH\n');

    if (balance < ethers.parseEther('0.05')) {
        throw new Error('❌ Insufficient balance for deployment. Need at least 0.05 ETH');
    }

    // Deploy QoraNFT contract
    console.log('📦 Deploying QoraNFT contract...');
    
    const QoraNFT = await ethers.getContractFactory('QoraNFT');
    const qoraNFT = await QoraNFT.deploy();
    
    await qoraNFT.waitForDeployment();
    const contractAddress = await qoraNFT.getAddress();

    console.log('✅ QoraNFT deployed to:', contractAddress);

    // Verify deployment
    console.log('\n🔍 Verifying deployment...');
    const maxSupply = await qoraNFT.MAX_SUPPLY();
    const owner = await qoraNFT.owner();
    const name = await qoraNFT.name();
    const symbol = await qoraNFT.symbol();

    console.log('📊 Contract Info:');
    console.log('   Name:', name);
    console.log('   Symbol:', symbol);
    console.log('   Max Supply:', maxSupply.toString());
    console.log('   Owner:', owner);
    console.log('   Total Minted:', (await qoraNFT.totalMinted()).toString());

    // Save deployment info
    saveDeploymentInfo({
        address: contractAddress,
        deployer: deployer.address,
        network: 'ethereum-mainnet',
        blockNumber: await ethers.provider.getBlockNumber(),
        timestamp: new Date().toISOString(),
        maxSupply: maxSupply.toString(),
    });

    console.log('\n✅ Deployment info saved to /contracts/deployed-addresses.json');

    // Verify on Etherscan
    if (process.env.ETHERSCAN_API_KEY) {
        console.log('\n⏳ Waiting 1 minute before Etherscan verification...');
        await new Promise(resolve => setTimeout(resolve, 60000));

        console.log('🔎 Verifying contract on Etherscan...');
        try {
            await run('verify:verify', {
                address: contractAddress,
                constructorArguments: [],
            });
            console.log('✅ Contract verified on Etherscan');
        } catch (error: any) {
            if (error.message.includes('Already Verified')) {
                console.log('✅ Contract already verified on Etherscan');
            } else {
                console.error('⚠️  Etherscan verification failed:', error.message);
                console.log('You can verify manually later with:');
                console.log(`npx hardhat verify --network mainnet ${contractAddress}`);
            }
        }
    }

    console.log('\n🎉 Deployment complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Update /lib/contracts-config.ts with the contract address');
    console.log('2. Upload metadata to IPFS or your server');
    console.log('3. Test minting on mainnet with small amount first');
    console.log('4. Configure backend API to use this contract');
}

function saveDeploymentInfo(info: any) {
    const deploymentPath = path.join(__dirname, '../deployed-addresses.json');
    let deployments: any = {};

    if (fs.existsSync(deploymentPath)) {
        deployments = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'));
    }

    if (!deployments.ethereum) {
        deployments.ethereum = {};
    }

    deployments.ethereum = {
        ...deployments.ethereum,
        ...info,
    };

    fs.writeFileSync(deploymentPath, JSON.stringify(deployments, null, 2));
}

// Handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    });
