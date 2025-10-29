# Frontend Mint Integration Guide

## Overview

This guide explains how to integrate NFT minting functionality into the CardDetailsModal component using TonConnect for TON and MetaMask/WalletConnect for Ethereum.

## Architecture

```
User clicks "Mint" → Select chain (TON/ETH) → Connect wallet → Prepare transaction → Sign → Confirm → Update card status
```

### Flow Diagram

```
┌─────────────┐
│ CardDetails │
│   Modal     │
└──────┬──────┘
       │
       ├─ TON Path ──────────────┐
       │                         │
       │  1. Check TonConnect    │
       │  2. POST /api/mint/ton  │
       │  3. Sign with wallet    │
       │  4. PUT /api/mint/ton   │
       │                         │
       └─ ETH Path ──────────────┤
          1. Check window.ethereum│
          2. POST /api/mint/eth   │
          3. Sign with MetaMask   │
          4. PUT /api/mint/eth    │
                                  │
                         ┌────────▼────────┐
                         │  Card Updated   │
                         │  (mintedOn set) │
                         └─────────────────┘
```

## Dependencies Installation

```bash
# TON blockchain
npm install @ton/core @ton/ton @ton/crypto @tonconnect/ui-react

# Ethereum blockchain
npm install ethers

# Hardhat for deployment
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-verify

# OpenZeppelin contracts
npm install @openzeppelin/contracts
```

## Step 1: Update TonConnect Provider

File: `/components/ton-connect-provider.tsx`

Add wallet connection state:

```typescript
import { TonConnectUIProvider, useTonConnectUI } from '@tonconnect/ui-react';

export function TonConnectProvider({ children }: { children: React.ReactNode }) {
    return (
        <TonConnectUIProvider manifestUrl="https://qora.app/tonconnect-manifest.json">
            {children}
        </TonConnectUIProvider>
    );
}

export function useTonWallet() {
    const [tonConnectUI] = useTonConnectUI();
    
    return {
        connected: tonConnectUI.connected,
        wallet: tonConnectUI.wallet,
        sendTransaction: tonConnectUI.sendTransaction,
        disconnect: tonConnectUI.disconnect,
    };
}
```

## Step 2: Update CardDetailsModal Component

File: `/components/card-details-modal.tsx`

### Add Imports

```typescript
import { useTonWallet } from './ton-connect-provider';
import { CONTRACTS } from '@/lib/contracts-config';
```

### Add Wallet State

```typescript
const { connected: tonConnected, sendTransaction: sendTonTransaction } = useTonWallet();
const [ethConnected, setEthConnected] = useState(false);
const [minting, setMinting] = useState(false);
const [mintSuccess, setMintSuccess] = useState(false);
```

### Update handleMint Function

```typescript
const handleMint = async (chain: 'ton' | 'ethereum') => {
    try {
        setMinting(true);
        setError('');
        
        if (chain === 'ton') {
            await mintOnTon();
        } else {
            await mintOnEthereum();
        }
        
        setMintSuccess(true);
        setTimeout(() => {
            onClose();
            // Reload inventory
            window.location.reload();
        }, 2000);
        
    } catch (error: any) {
        console.error('Mint error:', error);
        setError(error.message || 'Mint failed');
    } finally {
        setMinting(false);
    }
};
```

### Add TON Mint Function

```typescript
const mintOnTon = async () => {
    // 1. Check wallet connection
    if (!tonConnected) {
        throw new Error('Please connect TON wallet first');
    }
    
    // 2. Get user's TON address
    const wallet = useTonWallet().wallet;
    if (!wallet) {
        throw new Error('Wallet not available');
    }
    
    const walletAddress = wallet.account.address;
    
    // 3. Prepare mint transaction
    const response = await fetch('/api/mint/ton', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: 'demo-user', // Get from auth context
            cardId: card.id,
            walletAddress,
        }),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to prepare transaction');
    }
    
    const { transaction } = await response.json();
    
    // 4. Sign and send transaction using TonConnect
    const result = await sendTonTransaction(transaction);
    
    // 5. Confirm mint on backend
    const confirmResponse = await fetch('/api/mint/ton', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cardId: card.id,
            txHash: result.boc, // Transaction hash from TON
        }),
    });
    
    if (!confirmResponse.ok) {
        throw new Error('Failed to confirm mint');
    }
    
    console.log('✅ TON mint successful!', result);
};
```

### Add Ethereum Mint Function

```typescript
const mintOnEthereum = async () => {
    // 1. Check MetaMask
    if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask');
    }
    
    // 2. Request account access
    const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
    });
    
    const walletAddress = accounts[0];
    
    // 3. Prepare mint transaction
    const response = await fetch('/api/mint/ethereum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: 'demo-user', // Get from auth context
            cardId: card.id,
            walletAddress,
        }),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to prepare transaction');
    }
    
    const { transaction } = await response.json();
    
    // 4. Sign and send transaction using MetaMask
    const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transaction],
    });
    
    // 5. Wait for confirmation (optional but recommended)
    let confirmed = false;
    for (let i = 0; i < 60; i++) { // Wait up to 60 seconds
        const receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash],
        });
        
        if (receipt && receipt.status === '0x1') {
            confirmed = true;
            break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (!confirmed) {
        throw new Error('Transaction timeout - check Etherscan for status');
    }
    
    // 6. Confirm mint on backend
    const confirmResponse = await fetch('/api/mint/ethereum', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cardId: card.id,
            txHash,
        }),
    });
    
    if (!confirmResponse.ok) {
        throw new Error('Failed to confirm mint');
    }
    
    console.log('✅ Ethereum mint successful!', txHash);
};
```

### Update UI for Mint Button

```typescript
{showMintOptions && (
    <div className="space-y-2 mt-2">
        <button
            onClick={() => handleMint('ton')}
            disabled={minting || !tonConnected}
            className="w-full px-6 py-3 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {minting ? 'Minting...' : tonConnected ? 'Mint on TON' : 'Connect TON Wallet First'}
        </button>
        <button
            onClick={() => handleMint('ethereum')}
            disabled={minting}
            className="w-full px-6 py-3 bg-[#627eea] text-white rounded-lg hover:bg-[#5269d4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {minting ? 'Minting...' : 'Mint on Ethereum'}
        </button>
    </div>
)}

{mintSuccess && (
    <div className="mt-4 p-3 bg-green-500/10 text-green-500 rounded-lg text-center">
        ✅ NFT minted successfully!
    </div>
)}
```

## Step 3: Add TypeScript Definitions

File: `/types/window.d.ts` (create if doesn't exist)

```typescript
interface Window {
    ethereum?: {
        isMetaMask?: boolean;
        request: (args: { method: string; params?: any[] }) => Promise<any>;
        on: (event: string, callback: (...args: any[]) => void) => void;
        removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
}
```

## Step 4: Environment Configuration

Add to `.env.local`:

```env
# After deployment
NEXT_PUBLIC_TON_COLLECTION_ADDRESS=EQ...
NEXT_PUBLIC_ETH_CONTRACT_ADDRESS=0x...

# Metadata URLs
NEXT_PUBLIC_METADATA_BASE_URI=https://qora.app/api/nft/
NEXT_PUBLIC_COLLECTION_URI=https://qora.app/api/collection-metadata

# Royalties
ROYALTY_RECIPIENT=0x... # or EQ... for TON
```

## Step 5: Testing

### Test TON Mint (Testnet First)

1. Set TON testnet in TonConnect
2. Get test TON from faucet
3. Click "Mint" → "TON"
4. Sign transaction in wallet
5. Check TonScan for confirmation

### Test Ethereum Mint (Testnet First)

1. Switch MetaMask to Sepolia testnet
2. Get test ETH from faucet
3. Click "Mint" → "Ethereum"
4. Approve transaction in MetaMask
5. Check Etherscan for confirmation

## Security Checklist

- [ ] Validate wallet connection before mint
- [ ] Check card ownership (userId matches)
- [ ] Prevent double minting (check mintedOn field)
- [ ] Handle transaction failures gracefully
- [ ] Show clear error messages
- [ ] Add loading states during mint
- [ ] Implement transaction timeout
- [ ] Add gas estimation
- [ ] Log all transactions for debugging
- [ ] Use environment variables for addresses
- [ ] Never expose private keys in frontend

## Error Handling

Common errors and solutions:

| Error | Solution |
|-------|----------|
| "Wallet not connected" | Prompt user to connect wallet |
| "Insufficient balance" | Show required amount |
| "Transaction timeout" | Link to explorer for status |
| "Card already minted" | Show which chain it's on |
| "User rejected" | Allow retry |
| "Gas too low" | Increase gas limit |
| "Contract not deployed" | Check environment config |


After integration:

1. Test on testnets thoroughly
2. Deploy contracts to mainnet
3. Update environment variables
4. Test with real wallets (small amounts)
5. Monitor transaction success rate
6. Add analytics for mint tracking
7. Implement marketplace integration
8. Add floor price tracking
9. Create leaderboard for collectors



- [TonConnect Documentation](https://docs.ton.org/develop/dapps/ton-connect)
- [MetaMask Documentation](https://docs.metamask.io/)
- [ethers.js Documentation](https://docs.ethers.org/)
- [TON Smart Contracts](https://docs.ton.org/develop/smart-contracts/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
