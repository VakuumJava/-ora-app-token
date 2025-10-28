# Smart Contracts Deployment Guide

## Overview

Qora uses NFT smart contracts on two blockchains:
- **TON Blockchain**: TEP-62 standard (NFT Collection + NFT Item)
- **Ethereum**: ERC-721 standard (OpenZeppelin-based)

## Prerequisites

### For TON Deployment

1. **Install TON development tools**:
```bash
npm install @ton/core @ton/ton @ton/crypto
```

2. **Compile FunC contracts**:
   - Use [TON Blueprint](https://github.com/ton-org/blueprint) or [ton-compiler](https://github.com/ton-community/ton-compiler)
   - Compile `nft-collection.fc` and `nft-item.fc` to base64

3. **Prepare wallet**:
   - Create TON wallet with at least 0.5 TON
   - Get 24-word mnemonic phrase
   - Export to environment variable

### For Ethereum Deployment

1. **Install Hardhat and dependencies**:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-verify @openzeppelin/contracts
```

2. **Get Ethereum wallet**:
   - Export private key (NEVER commit this!)
   - Ensure wallet has 0.1+ ETH for deployment

3. **Get API keys**:
   - Etherscan API key for contract verification
   - Ethereum RPC URL (Infura, Alchemy, or public)

## Environment Variables

Create `.env.local` file:

```env
# TON Configuration
MNEMONIC="your 24 word mnemonic phrase here"
OWNER_ADDRESS="EQ..." # Your TON wallet address
TON_API_KEY="your_toncenter_api_key"
NFT_ITEM_CODE_BASE64="..." # Compiled nft-item.fc
COLLECTION_CODE_BASE64="..." # Compiled nft-collection.fc

# Ethereum Configuration
PRIVATE_KEY="0x..." # Your Ethereum private key (NO 0x prefix in some cases)
ETHEREUM_RPC_URL="https://eth.llamarpc.com"
ETHERSCAN_API_KEY="your_etherscan_api_key"

# Frontend (after deployment)
NEXT_PUBLIC_TON_COLLECTION_ADDRESS="EQ..."
NEXT_PUBLIC_ETH_CONTRACT_ADDRESS="0x..."
NEXT_PUBLIC_METADATA_BASE_URI="https://qora.app/api/nft/"
NEXT_PUBLIC_COLLECTION_URI="https://qora.app/api/collection-metadata"
```

## Deployment Steps

### 1. Compile TON Contracts

Using Blueprint:
```bash
npx blueprint build
```

Or using ton-compiler:
```bash
npx ton-compiler --input contracts/ton/nft-collection.fc --output build/collection.cell
npx ton-compiler --input contracts/ton/nft-item.fc --output build/item.cell
```

Convert to base64 and add to `.env.local`

### 2. Deploy TON Collection

```bash
cd contracts/ton
npx ts-node deploy.ts
```

**Important**: TON deployment requires:
- Sending TON to calculated contract address
- Contract auto-deploys on first transaction
- Save the collection address

### 3. Deploy Ethereum Contract

```bash
npx hardhat compile
npx hardhat run contracts/ethereum/deploy.ts --network mainnet
```

This will:
- Deploy QoraNFT contract
- Verify on Etherscan
- Save address to `deployed-addresses.json`

### 4. Update Configuration

Edit `/lib/contracts-config.ts`:
```typescript
COLLECTION_ADDRESS: 'EQ...' // From TON deployment
CONTRACT_ADDRESS: '0x...'   // From Ethereum deployment
```

Or set environment variables in `.env.local`

### 5. Test Deployment

#### TON:
```bash
# Check collection data
npx ts-node scripts/ton-test-collection.ts
```

#### Ethereum:
```bash
# Test mint function
npx hardhat run scripts/test-mint.ts --network mainnet
```

## Security Checklist

- [ ] Private keys stored securely (use hardware wallet in production)
- [ ] Environment variables never committed to git
- [ ] Contract ownership transferred after testing
- [ ] Max supply (2000) configured correctly
- [ ] Royalty parameters set properly (5%)
- [ ] Metadata URLs pointing to production server
- [ ] Contracts verified on explorers
- [ ] Test transactions completed successfully

## Cost Estimates

### TON
- Collection deployment: ~0.3 TON
- Per NFT mint: ~0.05 TON
- Transfer: ~0.02 TON

### Ethereum
- Contract deployment: ~0.05-0.1 ETH (varies with gas)
- Per NFT mint: ~0.01-0.03 ETH
- Transfer: ~0.005-0.015 ETH

## Contract Addresses

After deployment, addresses are saved in:
```
/contracts/deployed-addresses.json
```

Format:
```json
{
  "ton": {
    "collection": "EQ...",
    "deployedAt": "2024-01-01T00:00:00.000Z"
  },
  "ethereum": {
    "address": "0x...",
    "deployer": "0x...",
    "network": "ethereum-mainnet",
    "blockNumber": 12345678,
    "deployedAt": "2024-01-01T00:00:00.000Z",
    "maxSupply": "2000"
  }
}
```

## Verification

### TON
View on TonScan:
```
https://tonscan.org/address/EQ...
```

### Ethereum
View on Etherscan:
```
https://etherscan.io/address/0x...
```

## Troubleshooting

### TON Issues

**"Contract not deployed"**
- Send at least 0.3 TON to calculated address
- Wait for confirmation (may take 10-30 seconds)

**"Invalid op code"**
- Check that NFT Item code is compiled correctly
- Verify operation constants match

### Ethereum Issues

**"Insufficient funds"**
- Ensure wallet has enough ETH for gas + deployment
- Current gas prices can be checked at etherscan.io/gastracker

**"Nonce too low"**
- Previous transaction still pending
- Wait or increase gas price

**"Contract verification failed"**
- Wait longer before verification (1-2 minutes)
- Verify manually: `npx hardhat verify --network mainnet 0x...`

## Next Steps

After successful deployment:

1. **Update frontend**: Set contract addresses in config
2. **Create metadata API**: Implement `/api/nft/[id]` endpoint
3. **Test minting**: Use admin panel to mint test NFT
4. **Monitor gas prices**: Adjust fees based on network conditions
5. **Set up indexer**: Track minted NFTs and transfers

## Additional Resources

- [TON Documentation](https://docs.ton.org/)
- [TEP-62 NFT Standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)

## Support

For issues or questions:
- Check contract code in `/contracts/`
- Review deployment scripts
- Test on testnet first before mainnet
- Keep all private keys secure!
