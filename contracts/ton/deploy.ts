import { Address, beginCell, Cell, contractAddress, StateInit, storeStateInit, toNano } from '@ton/core';
import { TonClient } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * TON NFT Collection Deployment Script
 * Network: TON Mainnet
 * 
 * Prerequisites:
 * 1. Set MNEMONIC environment variable (24-word seed phrase)
 * 2. Ensure wallet has at least 0.5 TON for deployment
 * 3. Compile .fc contracts to base64 (use ton-compiler or blueprint)
 */

interface CollectionData {
    ownerAddress: Address;
    nextItemIndex: number;
    collectionContent: string;
    commonContent: string;
    nftItemCode: Cell;
    royaltyParams: {
        numerator: number;
        denominator: number;
        destination: Address;
    };
}

// Mainnet configuration
const MAINNET_ENDPOINT = 'https://toncenter.com/api/v2/jsonRPC';
const MAINNET_API_KEY = process.env.TON_API_KEY || '';

async function main() {
    console.log('🚀 Starting TON NFT Collection Deployment to MAINNET...\n');

    // 1. Initialize TON Client
    const client = new TonClient({
        endpoint: MAINNET_ENDPOINT,
        apiKey: MAINNET_API_KEY,
    });

    // 2. Load wallet from mnemonic
    const mnemonic = process.env.MNEMONIC;
    if (!mnemonic) {
        throw new Error('❌ MNEMONIC environment variable not set');
    }

    const keyPair = await mnemonicToPrivateKey(mnemonic.split(' '));
    const ownerAddress = Address.parse(process.env.OWNER_ADDRESS || '');
    
    console.log('📍 Owner Address:', ownerAddress.toString());

    // 3. Load NFT Item code (you need to compile nft-item.fc first)
    // This is a placeholder - replace with actual compiled code
    const nftItemCodeBase64 = process.env.NFT_ITEM_CODE_BASE64;
    if (!nftItemCodeBase64) {
        throw new Error('❌ NFT_ITEM_CODE_BASE64 environment variable not set');
    }
    const nftItemCode = Cell.fromBase64(nftItemCodeBase64);

    // 4. Prepare collection data
    const collectionData: CollectionData = {
        ownerAddress,
        nextItemIndex: 0,
        collectionContent: 'https://qora.app/api/collection-metadata', // Update with your metadata URL
        commonContent: 'https://qora.app/api/nft/', // Base URL for individual NFTs
        nftItemCode,
        royaltyParams: {
            numerator: 5, // 5%
            denominator: 100,
            destination: ownerAddress,
        },
    };

    // 5. Build collection data cell
    const collectionDataCell = buildCollectionDataCell(collectionData);

    // 6. Load collection code (you need to compile nft-collection.fc first)
    const collectionCodeBase64 = process.env.COLLECTION_CODE_BASE64;
    if (!collectionCodeBase64) {
        throw new Error('❌ COLLECTION_CODE_BASE64 environment variable not set');
    }
    const collectionCode = Cell.fromBase64(collectionCodeBase64);

    // 7. Create state init
    const stateInit: StateInit = {
        code: collectionCode,
        data: collectionDataCell,
    };

    const stateInitCell = beginCell()
        .store(storeStateInit(stateInit))
        .endCell();

    // 8. Calculate contract address
    const collectionAddress = contractAddress(0, stateInit);
    console.log('📦 Collection Address:', collectionAddress.toString());

    // 9. Check if already deployed
    const { state } = await client.getContractState(collectionAddress);
    if (state === 'active') {
        console.log('✅ Contract already deployed at:', collectionAddress.toString());
        saveDeploymentInfo(collectionAddress.toString(), 'ton');
        return;
    }

    console.log('💰 Deploying contract...');
    
    // 10. Deploy message (you need to sign and send this)
    // This requires wallet implementation - use ton-core Wallet classes
    console.log('\n⚠️  Manual deployment required:');
    console.log('1. Send at least 0.3 TON to:', collectionAddress.toString());
    console.log('2. The contract will be deployed automatically on first transaction');
    console.log('\nState Init (base64):');
    console.log(stateInitCell.toBoc().toString('base64'));

    // Save deployment info
    saveDeploymentInfo(collectionAddress.toString(), 'ton');
    
    console.log('\n✅ Deployment info saved to /contracts/deployed-addresses.json');
}

function buildCollectionDataCell(data: CollectionData): Cell {
    const contentCell = beginCell()
        .storeBuffer(Buffer.from(data.collectionContent))
        .endCell();

    const commonContentCell = beginCell()
        .storeBuffer(Buffer.from(data.commonContent))
        .endCell();

    const royaltyCell = beginCell()
        .storeUint(data.royaltyParams.numerator, 16)
        .storeUint(data.royaltyParams.denominator, 16)
        .storeAddress(data.royaltyParams.destination)
        .endCell();

    return beginCell()
        .storeAddress(data.ownerAddress)
        .storeUint(data.nextItemIndex, 64)
        .storeRef(contentCell)
        .storeRef(data.nftItemCode)
        .storeRef(royaltyCell)
        .endCell();
}

function saveDeploymentInfo(address: string, network: string) {
    const deploymentPath = path.join(__dirname, '../deployed-addresses.json');
    let deployments: any = {};

    if (fs.existsSync(deploymentPath)) {
        deployments = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'));
    }

    if (!deployments[network]) {
        deployments[network] = {};
    }

    deployments[network].collection = address;
    deployments[network].deployedAt = new Date().toISOString();

    fs.writeFileSync(deploymentPath, JSON.stringify(deployments, null, 2));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    });
