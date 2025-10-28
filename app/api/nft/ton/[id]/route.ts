import { NextResponse } from 'next/server';
import { userCards } from '@/lib/spawn-storage';

/**
 * NFT Metadata API for TON
 * GET /api/nft/ton/[id]
 * 
 * Returns metadata in TEP-64 format (TON NFT Metadata)
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

        // TEP-64 compliant metadata
        const metadata = {
            name: `Qora Card #${card.id}`,
            description: `Legendary Qora NFT Card crafted from ancient shards. Model: ${card.model}, Background: ${card.background}`,
            image: `https://qora.app/craftedstone.png`, // Card image URL
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
                    value: card.craftedAt.toISOString(),
                    display_type: 'date',
                },
            ],
            // TON-specific fields
            decimals: '0',
            amount: '1',
            // OpenSea compatibility
            external_url: `https://qora.app/card/${card.id}`,
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
