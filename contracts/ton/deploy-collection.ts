import { Address, beginCell, Cell, toNano, internal } from '@ton/core';
import { TonClient, WalletContractV4 } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Deploy собственной NFT коллекции на TON Mainnet
 * Используем стандартный контракт nft-collection.fc
 */

// NFT Collection code (стандартный контракт)
const NFT_COLLECTION_CODE = Cell.fromBase64(
  'te6ccgECFAEAAh8ABCSK7VMg4wMgwP/jAiDA/uMC8gsTAgEUA77tRNDTAfpAMDHXC//jBvQE0wfUMAH7AOIBUAXXCACCEBjOp8hhAnQE8swBegEBegEBegEBegFTMBa88tGWAvpAIfAB+kDUMBAjXwNwIuIB+kAwQBOAVQHIywdQA88WzMv/ye1UBAQBBC0DCAQDET1dXx8ANAbEBXHBfLhlBBYQwLIyx8Syx/L/8ntVA0cAcAGOPQAU8AQTK4sY4okAcA8EBzwBYQs8WAc8WzMzJ7VQAm4BIfAx+QBzUxbLH1Iwyx8Syx/L/wEg+QBzgBYQzwtA+QBzbmJfA4ADgAbIyx8Syx/L/wEgfwAY+QAhghBfzD0UyACIBIEBASLAAo4fcMADjxRw+EIkyEAEgwf0BM8WWM8WygDJ7VT4D38HBgUEAl9bMDBTJfAE+gDTP/QE+QBDQAM/JDBSyMv/y/8AJaoCgBDPFgEgcFUgVSJfBAAf+kDTAAHyvtRwH2wAQyWAUQfXBfL0gQEA4wIgghBfzD0Uy5BfBEA4XwN/VgcIAARYIAE0ghBfzD0UUhC6mlhwWW1wcG1kQQb4F/gA4CMJAcqAILqOFTAgjhMhghAvyyaiuuMCIIIQD4p+pbqRW+AgghBfzD0UuuMCggCogQEAwAhfBg0KAAX8+AANgQEAwAiOGVMRpwKAF88WWM8WygDJAfkA+COBA+ioJroDAqAi8sFqgBJ/VhAACjAyA/gMAKzJQR/4F/gAXwPhBCCogQEAgQEAgvBQhEGBtv4g+gAw8sGXMDgQfYAWIHIULgFQuOAI4wwjoLneSswB+wAQIAEEjkUE/44VCaAAASoBASxfIKgBASUgbpIwbeAwXwoODQ0BHI6HU3WgAAEoXwqQDeAMA0ELAwKCogETzxYBzxbMygDJcPsCJyBwgBZwVABDU1YlggED9IQQrAUEVQIhA5FbbgRu8uBq+ADi4ukADAExMDOCEF/MxRK6jxQwaFtsIV8FgBUhgwf0Dm+hllgRb/ADDwDoMAFTF6dTI6EBpFMDqKYBqAK+sJRfA+AC+ADe+AAQJoAWJHMkgBYSoQQ1oPhBbyReKCiEERpw+EIkyEAEgwf0BM8WWM8WygDJ7VQQQAGAQeL4FHD4QgHbPHD4RFtwWYAT+ELbPDASyPQA9ADLB8oHygDJ7VQRAGrIyx8Uyx9SIMsfEss/WAP0APQAEss/FMs/UAL0APkCAc8Wyz8B+gL0AMsAgQEBzwCBAQHPAMsAWM8W'
);

// NFT Item code (стандартный контракт)
const NFT_ITEM_CODE = Cell.fromBase64(
  'te6ccgECDQEAAdAAART/APSkE/S88sgLAQIBYgMCAAmhH5/gBQICzgcEAgEgBgUAHQDyMs/WM8WAc8WzMmAQAib/APSkE/S88sgLBwIDzaQJCADdu9GCcFzsPV0srnsehOw51kqFG2aCcJ3WNS0rZHyzItOvLf3xYjmCcCBVwBuAZ2OUzlg6rkclssOCcBvUne+VRZbxx1PT3gVZwyaCcJ2XTlqzTstzOg6WbZRm6KSCcEDOdWnnFfnSULAdYW4mR7ICASALCgIBIAYMABUgghBfzD0UyMsHywfJ7VQANCCAIqjXBfLh2MsHyfhEgQEBRMjLH8s/ye1UAAAzIIAgRB+gQANB0AYF0xAVEW2A8ASBAQu4FqB88JQAWW0AZA=='
);

async function deployCollection() {
  console.log('🚀 Deploying NFT Collection to TON Mainnet\n');

  // 1. Initialize client
  const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TON_API_KEY || '',
  });

  // 2. Load wallet
  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic) {
    throw new Error('❌ MNEMONIC not found in .env');
  }

  const keyPair = await mnemonicToPrivateKey(mnemonic.split(' '));
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: keyPair.publicKey,
  });

  const contract = client.open(wallet);
  const balance = await contract.getBalance();
  const ownerAddress = wallet.address;

  console.log('💼 Owner wallet:', ownerAddress.toString());
  console.log('💰 Balance:', Number(balance) / 1e9, 'TON\n');

  if (Number(balance) < 0.5e9) {
    throw new Error('❌ Insufficient balance. Need at least 0.5 TON');
  }

  // 3. Collection metadata (off-chain)
  const collectionContentUrl = 'https://qora.store/api/nft/collection.json';
  const commonContentUrl = 'https://qora.store/api/nft/';

  // Build collection data
  const collectionContent = beginCell()
    .storeUint(0x01, 8) // off-chain content flag
    .storeStringTail(collectionContentUrl)
    .endCell();

  const commonContent = beginCell()
    .storeStringTail(commonContentUrl)
    .endCell();

  // Royalty params (5% to owner)
  const royaltyParams = beginCell()
    .storeUint(5, 16) // numerator (5%)
    .storeUint(100, 16) // denominator
    .storeAddress(ownerAddress) // royalty destination
    .endCell();

  // Build collection state init
  const collectionData = beginCell()
    .storeAddress(ownerAddress) // owner_address
    .storeUint(0, 64) // next_item_index
    .storeRef(collectionContent) // collection_content
    .storeRef(NFT_ITEM_CODE) // nft_item_code
    .storeRef(royaltyParams) // royalty_params
    .endCell();

  const stateInit = beginCell()
    .storeBit(0) // split_depth
    .storeBit(0) // special
    .storeBit(1) // code
    .storeRef(NFT_COLLECTION_CODE)
    .storeBit(1) // data
    .storeRef(collectionData)
    .storeBit(0) // library
    .endCell();

  // Calculate collection address
  const collectionAddress = new Address(0, stateInit.hash());

  console.log('📦 Collection address:', collectionAddress.toString());
  console.log('📦 Collection address (user-friendly):', collectionAddress.toString({ bounceable: false }));

  // 4. Send deployment transaction
  console.log('\n📤 Sending deployment transaction...');

  const seqno = await contract.getSeqno();

  await contract.sendTransfer({
    seqno,
    secretKey: keyPair.secretKey,
    messages: [
      internal({
        to: collectionAddress,
        value: toNano('0.05'), // Initial balance
        init: {
          code: NFT_COLLECTION_CODE,
          data: collectionData,
        },
        body: new Cell(), // Empty message for deployment
      }),
    ],
  });

  console.log('⏳ Waiting for deployment...');

  // Wait for transaction
  let currentSeqno = seqno;
  while (currentSeqno === seqno) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    currentSeqno = await contract.getSeqno();
  }

  console.log('✅ Collection deployed!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Add to Railway Variables:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Name:  NEXT_PUBLIC_TON_COLLECTION_ADDRESS');
  console.log('Value:', collectionAddress.toString());
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🔗 View on TONScan:');
  console.log(`https://tonscan.org/address/${collectionAddress.toString()}\n`);
}

deployCollection().catch(console.error);
