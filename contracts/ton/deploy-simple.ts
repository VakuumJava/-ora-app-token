import { TonClient, WalletContractV4, Address, internal } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Скрипт деплоя TON NFT Collection для Qora
 * 
 * ВАЖНО: Этот скрипт показывает адрес кошелька и баланс.
 * Для реального деплоя NFT коллекции рекомендуется использовать:
 * 1. Getgems.io - создание через UI
 * 2. TON Blueprint - профессиональный инструмент
 */

async function main() {
    console.log('🚀 TON Wallet Helper для деплоя NFT Collection\n');

    // 1. Проверка мнемоника
    const mnemonic = process.env.MNEMONIC;
    if (!mnemonic) {
        console.error('❌ Ошибка: Не указан MNEMONIC в .env файле');
        console.log('\n📝 Файл .env должен содержать:');
        console.log('MNEMONIC="ваши 24 слова от TON кошелька"');
        process.exit(1);
    }

    // 2. Подключение к TON Mainnet
    console.log('🔌 Подключение к TON Mainnet...');
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: process.env.TON_API_KEY || '',
    });

    // 3. Создание кошелька из мнемоника
    console.log('🔑 Загрузка кошелька из мнемоника...');
    const keyPair = await mnemonicToPrivateKey(mnemonic.split(' '));
    const wallet = WalletContractV4.create({
        workchain: 0,
        publicKey: keyPair.publicKey,
    });

    const walletAddress = wallet.address.toString();
    console.log('✅ Адрес кошелька:', walletAddress);

    // 4. Проверка баланса
    console.log('💰 Проверка баланса...');
    const balance = await client.getBalance(wallet.address);
    const tonBalance = Number(balance) / 1e9;
    console.log('💰 Баланс:', tonBalance.toFixed(4), 'TON');

    if (tonBalance < 0.1) {
        console.log('\n⚠️  Недостаточно TON для деплоя');
        console.log('📍 Пополните кошелёк минимум на 0.5 TON');
        console.log('🔗 Адрес для пополнения:', walletAddress);
        console.log('\n💡 Способы пополнения:');
        console.log('   • Отправить TON с другого кошелька');
        console.log('   • Использовать биржу (Binance, OKX и т.д.)');
        console.log('   • Купить через @wallet в Telegram');
        process.exit(1);
    }

    console.log('\n✅ Кошелёк готов к деплою!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n📚 Рекомендованные способы деплоя NFT коллекции:\n');
    
    console.log('1️⃣  Getgems.io (САМЫЙ ПРОСТОЙ - рекомендую):');
    console.log('   ✓ Откройте: https://getgems.io/create');
    console.log('   ✓ Подключите кошелёк с адресом:', walletAddress.slice(0, 10) + '...');
    console.log('   ✓ Создайте коллекцию через UI');
    console.log('   ✓ Заполните metadata:');
    console.log('     - Название: "Qora Collection"');
    console.log('     - Описание: "Qora NFT Cards"');
    console.log('     - Изображение коллекции');
    console.log('   ✓ Скопируйте адрес коллекции (EQC...)');
    
    console.log('\n2️⃣  TON Blueprint (для разработчиков):');
    console.log('   $ npm create ton@latest');
    console.log('   $ cd qora-nft');
    console.log('   $ npx blueprint create NftCollection');
    console.log('   $ npx blueprint run');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎯 После деплоя коллекции:');
    console.log('\n1. Скопируйте адрес коллекции (начинается с EQC...)');
    console.log('2. Добавьте в Railway Variables:');
    console.log('   NEXT_PUBLIC_TON_COLLECTION_ADDRESS=EQC...');
    console.log('3. Redeploy на Railway');
    console.log('4. Минт готов! 🎉');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
    .then(() => {
        console.log('\n✨ Готово!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Ошибка:', error.message);
        process.exit(1);
    });
