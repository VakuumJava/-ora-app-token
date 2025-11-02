import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { prisma } from '@/lib/db';
import { deleteCardAfterMint } from '@/lib/db-storage';
import { CONTRACTS, QORA_NFT_ABI, GAS_CONFIG } from '@/lib/contracts-config';

/**
 * Ethereum NFT Minting API
 * 
 * This endpoint generates mint transaction data that the frontend
 * will sign using MetaMask/WalletConnect and send to Ethereum.
 * 
 * POST /api/mint/ethereum
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

        // Find the card in database
        const userCard = await prisma.userCard.findFirst({
            where: {
                id: cardId,
                userId: userId,
                minted: false
            },
            include: { card: true }
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
                { error: 'Card already minted' },
                { status: 400 }
            );
        }

        // Validate Ethereum address
        if (!ethers.isAddress(walletAddress)) {
            return NextResponse.json(
                { error: 'Invalid Ethereum wallet address' },
                { status: 400 }
            );
        }

        // Check contract configuration
        const contractAddress = CONTRACTS.ETHEREUM.MAINNET.CONTRACT_ADDRESS;
        if (!contractAddress) {
            return NextResponse.json(
                { error: 'Ethereum contract not configured' },
                { status: 500 }
            );
        }

        // Generate metadata URI
        const metadataUri = `https://qora.app/api/nft/ethereum/${cardId}`;

        // Create contract instance for encoding
        const iface = new ethers.Interface(QORA_NFT_ABI);
        const data = iface.encodeFunctionData('mintCard', [
            walletAddress,
            userCard.card.name,
            userCard.card.rarity,
            metadataUri
        ]);

        // Prepare transaction object
        const transaction = {
            to: contractAddress,
            from: walletAddress,
            data: data,
            value: ethers.parseEther('0.01').toString(), // 0.01 ETH mint fee
        };

        
            contract: contractAddress,
            recipient: walletAddress,
            cardId,
            cardName: userCard.card.name,
            rarity: userCard.card.rarity,
        });

        // Return transaction data for MetaMask/WalletConnect to sign
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
            message: 'Transaction prepared. Please sign with your wallet.',
        });

    } catch (error: any) {
        console.error('❌ Ethereum mint error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * Confirm mint after transaction is sent
 * PUT /api/mint/ethereum
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

        
        
            cardId,
            txHash,
            explorer: `https://etherscan.io/tx/${txHash}`,
        });

        return NextResponse.json({
            success: true,
            message: '🎉 NFT успешно заминчен! Карта отправлена на ваш кошелек.',
            transactionId: txHash,
            explorerUrl: `https://etherscan.io/tx/${txHash}`,
        });

    } catch (error: any) {
        console.error('❌ Ethereum mint confirmation error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * Get minted card details from blockchain
 * GET /api/mint/ethereum?tokenId=123
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tokenId = searchParams.get('tokenId');

        if (!tokenId) {
            return NextResponse.json(
                { error: 'tokenId parameter required' },
                { status: 400 }
            );
        }

        const contractAddress = CONTRACTS.ETHEREUM.MAINNET.CONTRACT_ADDRESS;
        if (!contractAddress) {
            return NextResponse.json(
                { error: 'Contract not configured' },
                { status: 500 }
            );
        }

        // Create provider and contract instance
        const provider = new ethers.JsonRpcProvider(
            CONTRACTS.ETHEREUM.MAINNET.RPC_URL
        );
        const contract = new ethers.Contract(
            contractAddress,
            QORA_NFT_ABI,
            provider
        );

        // Get card properties from blockchain
        const [model, background, mintedAt, originalMinter] = 
            await contract.getCardProperties(tokenId);

        return NextResponse.json({
            tokenId,
            model,
            background,
            mintedAt: Number(mintedAt),
            originalMinter,
            contractAddress,
        });

    } catch (error: any) {
        console.error('❌ Get card details error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch card details', details: error.message },
            { status: 500 }
        );
    }
}
