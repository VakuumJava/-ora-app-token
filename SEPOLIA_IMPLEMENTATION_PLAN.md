# 🚀 Ethereum Sepolia NFT Minting Implementation Plan

**Статус:** ✅ **Планирование завершено**  
**Дата:** 3 ноября 2025  

---

## 📋 Что нужно сделать для Sepolia NFT мinting

### Phase 1: Backend Setup (Готово к имплементации)

#### 1.1 Создать lib/ethereum-utils.ts
Утилиты для работы с Ethereum:
```typescript
- getEthereumConfig(network: 'mainnet' | 'sepolia')
- getProvider(network)
- isValidEthereumAddress()
- isCorrectNetwork()
- formatMintTransaction()
- estimateMintGas()
- buildMintTransaction()
- verifyMintTransaction()
- getExplorerUrl()
- getFaucetUrl()
```

#### 1.2 Обновить lib/contracts-config.ts
```typescript
ETHEREUM: {
  MAINNET: { ... },
  SEPOLIA: {
    CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_ETH_SEPOLIA_CONTRACT_ADDRESS,
    CHAIN_ID: 11155111,
    RPC_URL: 'https://sepolia.infura.io/v3/YOUR_KEY',
    EXPLORER: 'https://sepolia.etherscan.io',
    FAUCET: 'https://sepoliafaucet.com',
  }
}
```

#### 1.3 Создать app/api/mint/ethereum-sepolia/route.ts
Endpoints:
- **POST** - Prepare mint transaction
- **PUT** - Confirm mint after signing
- **GET** - Check mint status

---

### Phase 2: Frontend Components (Готово к имплементации)

#### 2.1 Создать components/sepolia-mint-button.tsx
```typescript
- SepoliaMintButton component
  * MetaMask connection
  * Network validation (auto-switch to Sepolia)
  * Transaction signing
  * Error handling
  * Status display

- SepoliaMintStatus component
  * Check mint status
  * Show transaction hash
  * Link to Etherscan
```

#### 2.2 Интегрировать в существующие страницы
- app/inventory/page.tsx - Add mint button
- app/marketplace/page.tsx - Add mint button
- app/profile/page.tsx - Show mint history

---

### Phase 3: Smart Contract (Уже существует)

Contract: contracts/ethereum/QoraNFT.sol
- ✅ ERC721 implementation
- ✅ Mint функция
- ✅ Batch mint
- ✅ Card properties tracking
- ✅ Owner tracking

---

### Phase 4: Configuration & Deployment

#### 4.1 Environment Variables
```env
# RPC Providers (choose one)
ETH_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
ETH_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ETH_SEPOLIA_RPC_URL=https://sepolia.drpc.org

# Contract (after deployment)
NEXT_PUBLIC_ETH_SEPOLIA_CONTRACT_ADDRESS=0x...

# For etherscan verification
ETHERSCAN_API_KEY=...
ETH_PRIVATE_KEY=... (only for deployment)
```

#### 4.2 Deploy Contract to Sepolia

**Option 1: Using Hardhat**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
npm install @openzeppelin/contracts
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

**Option 2: Using Remix IDE**
1. Go to https://remix.ethereum.org
2. Import QoraNFT.sol
3. Compile & Deploy
4. Copy contract address

**Option 3: Using Ethers.js (Direct)**
```javascript
const contractFactory = new ethers.ContractFactory(ABI, BYTECODE, signer);
const contract = await contractFactory.deploy();
await contract.waitForDeployment();
console.log('Deployed:', await contract.getAddress());
```

#### 4.3 Get Sepolia ETH from Faucet
- https://sepoliafaucet.com (recommended)
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucets.chain.link/

---

## 🔧 Implementation Checklist

### Backend
- [ ] Create lib/ethereum-utils.ts (8 functions)
- [ ] Update lib/contracts-config.ts (add SEPOLIA config)
- [ ] Create app/api/mint/ethereum-sepolia/route.ts
  - [ ] POST handler (prepare transaction)
  - [ ] PUT handler (confirm transaction)
  - [ ] GET handler (check status)
- [ ] Add input validation using lib/validation.ts
- [ ] Add logging using lib/logger.ts

### Frontend
- [ ] Create components/sepolia-mint-button.tsx
- [ ] Add SepoliaMintButton component
- [ ] Add SepoliaMintStatus component
- [ ] Integrate into inventory page
- [ ] Integrate into marketplace page
- [ ] Test with MetaMask

### Smart Contract
- [ ] Compile QoraNFT.sol
- [ ] Deploy to Sepolia
- [ ] Verify on Etherscan
- [ ] Save contract address

### Configuration
- [ ] Add RPC provider key to .env.local
- [ ] Add contract address to .env.local
- [ ] Test API endpoints
- [ ] Test frontend integration

### Testing
- [ ] Test MetaMask connection
- [ ] Test network switching
- [ ] Test transaction signing
- [ ] Test mint confirmation
- [ ] Check Etherscan
- [ ] Verify NFT ownership

---

## 📊 API Endpoints

### POST /api/mint/ethereum-sepolia
Prepare mint transaction

**Request:**
```json
{
  "userId": "uuid",
  "cardId": "uuid",
  "walletAddress": "0x...",
  "nonce": 0
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "to": "0x...",
    "from": "0x...",
    "data": "0x...",
    "chainId": 11155111,
    "nonce": 0,
    "maxFeePerGas": "...",
    "maxPriorityFeePerGas": "...",
    "gas": "300000"
  },
  "network": "sepolia",
  "chainId": 11155111,
  "cardDetails": {...},
  "faucetUrl": "https://sepoliafaucet.com"
}
```

### PUT /api/mint/ethereum-sepolia
Confirm mint transaction

**Request:**
```json
{
  "cardId": "uuid",
  "txHash": "0x...",
  "tokenId": "optional"
}
```

**Response:**
```json
{
  "success": true,
  "message": "🎉 NFT успешно заминчена!",
  "transactionId": "0x...",
  "tokenId": "123",
  "explorerUrl": "https://sepolia.etherscan.io/tx/0x..."
}
```

### GET /api/mint/ethereum-sepolia?cardId=uuid
Check mint status

**Response:**
```json
{
  "success": true,
  "card": {
    "id": "uuid",
    "name": "Qora Card",
    "rarity": "Rare",
    "minted": true,
    "mintedAt": "2025-11-03T...",
    "tokenId": "123",
    "transactionHash": "0x..."
  },
  "network": "sepolia",
  "chainId": 11155111
}
```

---

## 🔗 References

| Component | Link |
|-----------|------|
| Sepolia Faucet | https://sepoliafaucet.com |
| Sepolia Explorer | https://sepolia.etherscan.io |
| Hardhat Docs | https://hardhat.org/docs |
| Remix IDE | https://remix.ethereum.org |
| OpenZeppelin ERC721 | https://docs.openzeppelin.com/contracts/4.x/erc721 |
| Ethers.js Docs | https://docs.ethers.org |

---

## 💡 Implementation Steps

### Step 1: Prepare Backend (30 min)
1. Add Sepolia config to contracts-config.ts
2. Create ethereum-utils.ts with 8 helper functions
3. Create /api/mint/ethereum-sepolia/route.ts

### Step 2: Create Frontend Component (20 min)
1. Create sepolia-mint-button.tsx
2. Add MetaMask integration
3. Handle network switching
4. Add error handling

### Step 3: Deploy Contract (15 min)
1. Get Sepolia ETH from faucet
2. Compile QoraNFT.sol
3. Deploy to Sepolia
4. Save contract address

### Step 4: Configuration (10 min)
1. Add RPC URL to .env.local
2. Add contract address to .env.local
3. Update lib/contracts-config.ts

### Step 5: Testing (20 min)
1. Test API endpoints with curl
2. Test frontend with MetaMask
3. Test transaction signing
4. Verify on Etherscan

---

## 🎯 Expected Outcomes

After implementation:

✅ Users can mint NFTs on Ethereum Sepolia testnet  
✅ Full transaction signing via MetaMask  
✅ Automatic network switching  
✅ Transaction verification on blockchain  
✅ NFT visible on Etherscan  
✅ Card removed from inventory after mint  

---

## 📝 Notes

- **Sepolia is testnet only** - Use for testing before mainnet
- **Free Sepolia ETH** - Request from faucets (0.5 ETH per request)
- **Gas fees** - Very cheap on testnet (~0.001 ETH per transaction)
- **Block time** - 12-15 seconds (vs 15 seconds on mainnet)
- **Chain ID** - 11155111 (always validate in code)

---

**Ready to implement when disk space is freed up!**

