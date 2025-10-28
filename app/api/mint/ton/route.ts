import { NextResponse } from 'next/server';
import { Address, beginCell, toNano } from '@ton/core';
import { userCards, userProfiles } from '@/lib/spawn-storage';
import { CONTRACTS, TON_OPERATIONS, GAS_CONFIG } from '@/lib/contracts-config';

/**
 * TON NFT Minting API
 * 
 * This endpoint generates mint transaction data that the frontend
 * will sign using TonConnect and send to the TON blockchain.
 * 
 * POST /api/mint/ton
 * Body: { userId: string, cardId: string, walletAddress: string }
 */

export async function POST(request: Request) {
    try {
        const { userId, cardId, walletAddress } = await request.json();

        console.log('🎨 TON Mint request:', { userId, cardId, walletAddress });

        // Validation
        if (!userId || !cardId || !walletAddress) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Find user profile
        const userProfile = userProfiles.find(p => p.id === userId);
        if (!userProfile) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Find the card
        const card = userCards.find(c => c.id === cardId && c.userId === userId);
        if (!card) {
            return NextResponse.json(
                { error: 'Card not found or not owned by user' },
                { status: 404 }
            );
        }

        // Check if already minted
        if (card.mintedOn) {
            return NextResponse.json(
                { 
                    error: 'Card already minted',
                    chain: card.mintedOn,
                    txHash: card.txHash 
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
        const metadataUri = `https://qora.app/api/nft/ton/${cardId}`;

        // Build mint message body
        // TEP-62: op::mint (1), query_id, item_index, amount, nft_content
        const mintBody = beginCell()
            .storeUint(TON_OPERATIONS.MINT, 32) // op
            .storeUint(Date.now(), 64) // query_id
            .storeUint(0, 64) // item_index (will be auto-assigned by collection)
            .storeCoins(toNano('0.05')) // amount for NFT item
            .storeRef(
                beginCell()
                    .storeAddress(tonAddress) // owner_address
                    .storeRef(
                        beginCell()
                            .storeBuffer(Buffer.from(metadataUri))
                            .endCell()
                    )
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

        console.log('✅ Mint transaction prepared:', {
            collection: collectionAddress,
            recipient: walletAddress,
            cardId,
            model: card.model,
            background: card.background,
        });

        // Return transaction data for TonConnect to sign
        return NextResponse.json({
            success: true,
            transaction,
            cardDetails: {
                id: card.id,
                cardId: card.cardId,
                model: card.model,
                background: card.background,
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
 * Body: { cardId: string, txHash: string }
 */
export async function PUT(request: Request) {
    try {
        const { cardId, txHash } = await request.json();

        console.log('✅ Confirming TON mint:', { cardId, txHash });

        const card = userCards.find(c => c.id === cardId);
        if (!card) {
            return NextResponse.json(
                { error: 'Card not found' },
                { status: 404 }
            );
        }

        // Update card as minted
        card.mintedOn = 'ton';
        card.txHash = txHash;

        console.log('🎉 Card minted on TON:', {
            cardId: card.id,
            txHash,
            explorer: `https://tonscan.org/tx/${txHash}`,
        });

        return NextResponse.json({
            success: true,
            card: {
                id: card.id,
                mintedOn: card.mintedOn,
                txHash: card.txHash,
                explorerUrl: `https://tonscan.org/tx/${txHash}`,
            },
            message: 'Card successfully minted on TON blockchain!',
        });

    } catch (error: any) {
        console.error('❌ TON mint confirmation error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
