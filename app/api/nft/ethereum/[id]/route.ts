import { NextResponse } from 'next/server';
import { userCards } from '@/lib/spawn-storage';

/**
 * NFT Metadata API for Ethereum
 * GET /api/nft/ethereum/[id]
 * 
 * Returns metadata in ERC-721 standard format (OpenSea compatible)
 */

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cardId = params.id;

        // Find card by ID
        const card = userCards.find(c => c.id === cardId);

        if (!card) {
            return NextResponse.json(
                { error: 'Card not found' },
                { status: 404 }
            );
        }

        // ERC-721 compliant metadata (OpenSea standard)
        const metadata = {
            name: `Qora Card #${card.id}`,
            description: `Legendary Qora NFT Card crafted from ancient shards. Model: ${card.model}, Background: ${card.background}`,
            image: `https://qora.app/craftedstone.png`, // Card image URL
            external_url: `https://qora.app/card/${card.id}`,
            attributes: [
                {
                    trait_type: 'Model',
                    value: card.model,
                },
                {
                    trait_type: 'Background',
                    value: card.background,
                },
                {
                    trait_type: 'Rarity',
                    value: 'Legendary',
                },
                {
                    trait_type: 'Card Type',
                    value: 'Qora Genesis',
                },
                {
                    trait_type: 'Crafted At',
                    value: new Date(card.craftedAt).getTime(),
                    display_type: 'date',
                },
                {
                    trait_type: 'Max Supply',
                    value: 2000,
                    display_type: 'number',
                },
            ],
            // Additional OpenSea fields
            background_color: '1c1c1e', // Dark background like Telegram
            animation_url: null, // Could add animation later
        };

        return NextResponse.json(metadata);

    } catch (error: any) {
        console.error('❌ Metadata fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
