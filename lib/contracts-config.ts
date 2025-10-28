/**
 * Smart Contract Configuration
 * 
 * After deployment, update the addresses here:
 * - TON Collection Address from contracts/ton/deploy.ts
 * - Ethereum Contract Address from contracts/ethereum/deploy.ts
 */

export const CONTRACTS = {
    TON: {
        MAINNET: {
            // Update after deployment
            COLLECTION_ADDRESS: process.env.NEXT_PUBLIC_TON_COLLECTION_ADDRESS || '',
            NETWORK: 'mainnet',
            EXPLORER: 'https://tonscan.org',
        },
    },
    ETHEREUM: {
        MAINNET: {
            // Update after deployment
            CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_ETH_CONTRACT_ADDRESS || '',
            CHAIN_ID: 1,
            NETWORK: 'mainnet',
            EXPLORER: 'https://etherscan.io',
            RPC_URL: 'https://eth.llamarpc.com',
        },
    },
} as const;

// QoraNFT ABI (минимальный для mint функции)
export const QORA_NFT_ABI = [
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'string', name: 'model', type: 'string' },
            { internalType: 'string', name: 'background', type: 'string' },
            { internalType: 'string', name: 'tokenURI', type: 'string' },
        ],
        name: 'mintCard',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalMinted',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'MAX_SUPPLY',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'getCardProperties',
        outputs: [
            { internalType: 'string', name: 'model', type: 'string' },
            { internalType: 'string', name: 'background', type: 'string' },
            { internalType: 'uint256', name: 'mintedAt', type: 'uint256' },
            { internalType: 'address', name: 'originalMinter', type: 'address' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'getTokensByOwner',
        outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'string', name: 'model', type: 'string' },
            { indexed: false, internalType: 'string', name: 'background', type: 'string' },
        ],
        name: 'CardMinted',
        type: 'event',
    },
] as const;

// TON Operations
export const TON_OPERATIONS = {
    MINT: 1,
    BATCH_MINT: 2,
    CHANGE_OWNER: 3,
    TRANSFER: 0x5fcc3d14,
} as const;

// Gas and fee configurations
export const GAS_CONFIG = {
    TON: {
        MINT_FEE: '0.3', // TON
        TRANSFER_FEE: '0.05', // TON
    },
    ETHEREUM: {
        GAS_LIMIT: 200000,
        MAX_PRIORITY_FEE: '2', // gwei
        MAX_FEE: '50', // gwei
    },
} as const;

// NFT Metadata configuration
export const METADATA_CONFIG = {
    BASE_URI: process.env.NEXT_PUBLIC_METADATA_BASE_URI || 'https://qora.app/api/nft/',
    COLLECTION_URI: process.env.NEXT_PUBLIC_COLLECTION_URI || 'https://qora.app/api/collection-metadata',
    IPFS_GATEWAY: 'https://ipfs.io/ipfs/',
} as const;

// Validation
export function validateContracts() {
    const errors: string[] = [];

    if (!CONTRACTS.TON.MAINNET.COLLECTION_ADDRESS) {
        errors.push('TON Collection Address not configured');
    }

    if (!CONTRACTS.ETHEREUM.MAINNET.CONTRACT_ADDRESS) {
        errors.push('Ethereum Contract Address not configured');
    }

    if (errors.length > 0) {
        console.warn('⚠️  Contract configuration warnings:', errors);
    }

    return errors.length === 0;
}
