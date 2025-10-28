import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { userCards, userProfiles } from '@/lib/spawn-storage';
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

        console.log('🎨 Ethereum Mint request:', { userId, cardId, walletAddress });

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
        const tokenURI = `https://qora.app/api/nft/ethereum/${cardId}`;

        // Create contract interface
        const contract = new ethers.Interface(QORA_NFT_ABI);

        // Encode mint function call
        const mintData = contract.encodeFunctionData('mintCard', [
            walletAddress,
            card.model,
            card.background,
            tokenURI,
        ]);

        // Estimate gas (this is approximate - user's wallet will recalculate)
        const gasLimit = GAS_CONFIG.ETHEREUM.GAS_LIMIT;

        // Prepare transaction for MetaMask/WalletConnect
        const transaction = {
            to: contractAddress,
            from: walletAddress,
            data: mintData,
            gasLimit: gasLimit.toString(),
            chainId: CONTRACTS.ETHEREUM.MAINNET.CHAIN_ID,
        };

        console.log('✅ Mint transaction prepared:', {
            contract: contractAddress,
            recipient: walletAddress,
            cardId,
            model: card.model,
            background: card.background,
        });

        // Return transaction data for wallet to sign
        return NextResponse.json({
            success: true,
            transaction,
            cardDetails: {
                id: card.id,
                cardId: card.cardId,
                model: card.model,
                background: card.background,
                tokenURI,
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

        console.log('✅ Confirming Ethereum mint:', { cardId, txHash, tokenId });

        const card = userCards.find(c => c.id === cardId);
        if (!card) {
            return NextResponse.json(
                { error: 'Card not found' },
                { status: 404 }
            );
        }

        // Update card as minted
        card.mintedOn = 'ethereum';
        card.txHash = txHash;
        if (tokenId) {
            card.tokenId = tokenId;
        }

        console.log('🎉 Card minted on Ethereum:', {
            cardId: card.id,
            txHash,
            tokenId: card.tokenId,
            explorer: `https://etherscan.io/tx/${txHash}`,
        });

        return NextResponse.json({
            success: true,
            card: {
                id: card.id,
                mintedOn: card.mintedOn,
                txHash: card.txHash,
                tokenId: card.tokenId,
                explorerUrl: `https://etherscan.io/tx/${txHash}`,
            },
            message: 'Card successfully minted on Ethereum blockchain!',
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
