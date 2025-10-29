import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * NFT Metadata API for Ethereum
 * GET /api/nft/ethereum/[id]
 * 
 * Returns metadata in ERC-721 standard format
 */

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cardId = params.id;

        // Find card by ID in database
        const userCard = await prisma.userCard.findUnique({
            where: { id: cardId },
            include: { card: true }
        });

        if (!userCard) {
            return NextResponse.json(
                { error: 'Card not found' },
                { status: 404 }
            );
        }

        // ERC-721 compliant metadata
        const metadata = {
            name: `${userCard.card.name} #${userCard.id.slice(0, 8)}`,
            description: userCard.card.description || `Legendary Qora NFT Card. Rarity: ${userCard.card.rarity}`,
            image: userCard.card.imageUrl || `https://qora.app/craftedstone.png`,
            attributes: [
                {
                    trait_type: 'Card Name',
                    value: userCard.card.name,
                },
                {
                    trait_type: 'Rarity',
                    value: userCard.card.rarity,
                },
                {
                    trait_type: 'Crafted At',
                    value: userCard.assembledAt.toISOString(),
                    display_type: 'date',
                },
            ],
            external_url: `https://qora.app/card/${userCard.id}`,
        };

        return NextResponse.json(metadata);

    } catch (error: any) {
        console.error('❌ NFT Metadata error (Ethereum):', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
