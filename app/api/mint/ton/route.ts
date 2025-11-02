import { NextResponse } from 'next/server';
import { Address, beginCell, toNano } from '@ton/core';
import { deleteCardAfterMint } from '@/lib/db-storage';
import { prisma } from '@/lib/db';

// TON Configuration
const TON_OPERATIONS = {
    MINT: 1,
};

const GAS_CONFIG = {
    TON: {
        MINT_FEE: '0.1', // 0.1 TON
    },
};

const CONTRACTS = {
    TON: {
        MAINNET: {
            COLLECTION_ADDRESS: process.env.NEXT_PUBLIC_TON_COLLECTION_ADDRESS || '',
        },
    },
};

/**
 * Prepare TON mint transaction
 * POST /api/mint/ton
 * Body: { userId: string, cardId: string, walletAddress: string }
 */
export async function POST(request: Request) {
    try {
        const { userId, cardId, walletAddress } = await request.json();

        

        // Validation
        if (!userId || !cardId || !walletAddress) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Find user in database
        const userProfile = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!userProfile) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Find the card in database (with card details)
        const userCard = await prisma.userCard.findFirst({
            where: {
                id: cardId,
                userId: userId,
                minted: false
            },
            include: {
                card: true
            }
        });

        if (!userCard) {
            return NextResponse.json(
                { error: 'Card not found or not owned by user' },
                { status: 404 }
            );
        }

        // Check if already minted
        if (userCard.minted) {
            return NextResponse.json(
                { 
                    error: 'Card already minted'
                },
                { status: 400 }
            );
        }

        // Validate TON address
        let tonAddress: Address;
        try {
            tonAddress = Address.parse(walletAddress);
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid TON wallet address' },
                { status: 400 }
            );
        }

        // Check contract configuration
        const collectionAddress = CONTRACTS.TON.MAINNET.COLLECTION_ADDRESS;
        if (!collectionAddress) {
            return NextResponse.json(
                { error: 'TON collection contract not configured' },
                { status: 500 }
            );
        }

        // Generate metadata URI
        const metadataUri = `https://qora.store/api/nft/ton/${cardId}`;

        // Build mint message body for standard NFT collection
        // TEP-62/TEP-64 format: op (1), query_id, item_index, amount, content_cell
        const nftContentCell = beginCell()
            .storeBuffer(Buffer.from(metadataUri))
            .endCell();

        const mintBody = beginCell()
            .storeUint(1, 32) // op::mint_nft = 1
            .storeUint(0, 64) // query_id
            .storeUint(0, 64) // item_index (auto-assigned by collection)
            .storeCoins(toNano('0.05')) // amount to forward to NFT item
            .storeRef(
                beginCell()
                    .storeAddress(tonAddress) // new_owner_address
                    .storeRef(nftContentCell) // nft_content
                    .endCell()
            )
            .endCell();

        // Prepare transaction for TonConnect
        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
            messages: [
                {
                    address: collectionAddress,
                    amount: toNano(GAS_CONFIG.TON.MINT_FEE).toString(),
                    payload: mintBody.toBoc().toString('base64'),
                }
            ]
        };

        // Return transaction data for TonConnect to sign
        return NextResponse.json({
            success: true,
            transaction,
            cardDetails: {
                id: userCard.id,
                cardId: userCard.cardId,
                name: userCard.card.name,
                rarity: userCard.card.rarity,
                metadataUri,
            },
            message: 'Transaction prepared. Please sign with TonConnect.',
        });

    } catch (error: any) {
        console.error('❌ TON mint error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * Confirm mint after transaction is sent
 * PUT /api/mint/ton
 * Body: { cardId: string, txHash: string, tokenId?: string }
 */
export async function PUT(request: Request) {
    try {
        const { cardId, txHash, tokenId } = await request.json();

        

        // Validate inputs
        if (!cardId || !txHash) {
            return NextResponse.json(
                { error: 'Missing cardId or txHash' },
                { status: 400 }
            );
        }

        // Check if card exists
        const card = await prisma.userCard.findUnique({
            where: { id: cardId }
        });

        if (!card) {
            return NextResponse.json(
                { error: 'Card not found' },
                { status: 404 }
            );
        }

        // Delete card from database (it's now in blockchain!)
        await deleteCardAfterMint(cardId, tokenId || null, txHash);

        return NextResponse.json({
            success: true,
            message: '🎉 NFT успешно заминчен! Карта отправлена на ваш кошелек.',
            transactionId: txHash,
            explorerUrl: `https://tonscan.org/tx/${txHash}`,
        });

    } catch (error: any) {
        console.error('❌ TON mint confirmation error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
