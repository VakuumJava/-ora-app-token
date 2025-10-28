import { NextResponse } from 'next/server';

/**
 * NFT Collection Metadata API
 * GET /api/collection-metadata
 * 
 * Returns collection-level metadata for both TON and Ethereum
 */

export async function GET() {
    try {
        const metadata = {
            name: 'Qora Genesis Cards',
            description: 'Legendary NFT cards crafted from ancient shards scattered across the world. Collect fragments in real-world locations, combine them to create unique cards, and mint them as NFTs on TON or Ethereum blockchain.',
            image: 'https://qora.app/craftedstone.png',
            external_link: 'https://qora.app',
            
            // Collection details
            seller_fee_basis_points: 500, // 5% royalty
            fee_recipient: process.env.ROYALTY_RECIPIENT || '',
            
            // Social links
            social: {
                website: 'https://qora.app',
                twitter: 'https://twitter.com/qora_app',
                discord: 'https://discord.gg/qora',
                telegram: 'https://t.me/qora_app',
            },
            
            // Collection stats
            stats: {
                max_supply: 2000,
                total_minted: 0, // Updated dynamically
                floor_price: {
                    ton: '10 TON',
                    eth: '0.01 ETH',
                },
            },
            
            // Game mechanics
            game: {
                type: 'Location-based AR NFT Collector',
                mechanics: [
                    'Explore real-world locations to find fragment spawn points',
                    'Collect fragments A, B, and C from different locations',
                    'Combine 3 fragments (A+B+C) to craft a unique NFT card',
                    'Each card has random Model and Background properties',
                    'Mint your crafted cards as NFTs on TON or Ethereum',
                    'Transfer cards to other players',
                    'Trade on marketplace',
                ],
                rarity: {
                    models: ['Hellfire', 'Frostbite', 'Shadow', 'Celestial', 'Inferno'],
                    backgrounds: ['Neon Blue', 'Dark Purple', 'Golden Sunset', 'Mystic Green', 'Blood Red'],
                    combinations: 25, // 5 models × 5 backgrounds
                },
            },
            
            // Contract info (updated after deployment)
            contracts: {
                ton: {
                    collection: process.env.NEXT_PUBLIC_TON_COLLECTION_ADDRESS || 'Not deployed',
                    network: 'mainnet',
                    explorer: 'https://tonscan.org',
                },
                ethereum: {
                    address: process.env.NEXT_PUBLIC_ETH_CONTRACT_ADDRESS || 'Not deployed',
                    network: 'mainnet',
                    explorer: 'https://etherscan.io',
                },
            },
        };

        return NextResponse.json(metadata);

    } catch (error: any) {
        console.error('❌ Collection metadata error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
