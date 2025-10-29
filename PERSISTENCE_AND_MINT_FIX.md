# Решение проблем с персистентностью и минтом

## ✅ Что исправлено

### 1. Минт NFT теперь работает (mock версия)
**Проблема**: Минт выдавал сообщение "в разработке"  
**Решение**: 
- Создан `/api/mint/mock` - тестовый минт
- CardDetailsModal показывает статус TON кошелька
- После "минта" карта получает tokenId
- Показывается сообщение с tokenId

**Как работает**:
```typescript
// Клиент отправляет
POST /api/mint/mock
{
  cardId: "card-xxx",
  userId: "user_xxx",
  chain: "ton"
}

// Сервер возвращает
{
  success: true,
  tokenId: "ton-1730203425-abc123def",
  message: "🎉 NFT успешно заминчен на TON!"
}
```

⚠️ **Важно**: Это mock-минт (тестовый). Реальный blockchain минт требует интеграции с TON smart contracts.

### 2. Данные больше НЕ сбрасываются при перезапуске 🎉

**Проблема**: При каждом перезапуске сервера:
- ❌ Все осколки пропадали
- ❌ Все карты удалялись  
- ❌ Статистика обнулялась
- ❌ Пользователи терялись

**Причина**: Данные хранились в **оперативной памяти** (RAM), которая очищается при рестарте.

**Решение**: Создана система файловой персистентности

#### Как это работает:

1. **При старте сервера**:
   ```
   📁 Загрузка данных из data/app-data.json
   ✅ Данные загружены:
      - spawn points: 10
      - userInventory: 25
      - userCards: 5
      - userProfiles: 3
   ```

2. **При операциях** (checkin, craft):
   ```typescript
   // После сохранения осколка/карты
   saveAllData() // Немедленное сохранение в файл
   ```

3. **Автосохранение каждые 5 минут**:
   ```
   🔄 Автосохранение выполнено
   💾 Данные сохранены в файл
   ```

4. **Структура файла** `/data/app-data.json`:
   ```json
   {
     "spawnPoints": [...],
     "userInventory": [...],
     "userCards": [...],
     "userProfiles": [...],
     "lastSaved": "2025-10-29T10:30:00.000Z"
   }
   ```

## Изменённые файлы

### Новые файлы:
1. **`/lib/file-persistence.ts`** - Система сохранения в файл
   - `loadPersistedData()` - загрузка при старте
   - `savePersistedData()` - сохранение в файл
   - `startAutoSave()` - автосохранение каждые 5 минут

2. **`/app/api/mint/mock/route.ts`** - Mock API для тестового минта
   - Генерирует tokenId
   - Сохраняет в карту
   - Помечает как "minted"

### Обновлённые файлы:

1. **`/lib/spawn-storage.ts`**
   ```typescript
   // Раньше
   export const userInventory: CollectedShard[] = []
   
   // Сейчас
   const persistedData = loadPersistedData()
   export const userInventory: CollectedShard[] = []
   if (persistedData) {
     userInventory.push(...persistedData.userInventory)
   }
   
   // + Автосохранение каждые 5 минут
   startAutoSave(...)
   ```

2. **`/app/api/checkin/route.ts`**
   ```typescript
   userInventory.push(collectedShard)
   saveAllData() // ← Сохраняем после каждого чекина
   ```

3. **`/app/api/craft/route.ts`**
   ```typescript
   userCards.push(craftedCard)
   saveAllData() // ← Сохраняем после крафта
   ```

4. **`/app/inventory/page.tsx`**
   ```typescript
   // Теперь реально вызывает API минта
   const mintResponse = await fetch('/api/mint/mock', {
     method: 'POST',
     body: JSON.stringify({ cardId, userId, chain: 'ton' })
   })
   ```

5. **`.gitignore`**
   ```
   # Persisted data (local storage)
   /data
   /data/*.json
   ```

## Как проверить

### Тест 1: Персистентность данных

1. Соберите несколько осколков
2. Скрафтите карту
3. **Перезапустите сервер**: `pnpm dev` (Ctrl+C, потом снова `pnpm dev`)
4. Откройте `/inventory`
5. ✅ Все осколки и карты должны остаться на месте!

### Тест 2: Mock минт

1. Скрафтите карту
2. Откройте детали карты
3. Нажмите "Минт" → выберите TON
4. Должно показать: "✓ Кошелек подключен: 0:958b...ea5f"
5. Нажмите на кнопку TON
6. ✅ Должно появиться сообщение с tokenId
7. ⚠️ Увидите: "Это тестовый минт. Реальный blockchain минт будет добавлен позже."

### Тест 3: Автосохранение

1. Соберите осколок
2. Подождите 5 минут
3. В логах консоли должно быть: `🔄 Автосохранение выполнено`
4. Проверьте файл: `/data/app-data.json` - должен содержать ваши данные

## Ограничения текущего решения

### ⚠️ Файловая система НЕ подходит для продакшена

**Проблемы**:
1. Один файл для всех пользователей (не масштабируется)
2. Нет транзакций (при сбое можно потерять данные)
3. Не работает при horizontal scaling (несколько серверов)
4. Railway/Vercel могут очищать файлы при деплое

### ✅ Для продакшена нужно:

1. **PostgreSQL + Prisma** (рекомендуется)
   ```bash
   npm install @prisma/client
   prisma init
   prisma migrate dev
   ```

2. **Supabase** (быстрый старт)
   ```bash
   npm install @supabase/supabase-js
   ```

3. **MongoDB** (для NoSQL)
   ```bash
   npm install mongodb
   ```

## Следующие шаги

### Для реального blockchain минта:

1. **TON Integration**:
   ```typescript
   // В handleMint
   const tonConnectUI = useTonConnectUI()
   const transaction = {
     validUntil: Date.now() + 5 * 60 * 1000,
     messages: [{
       address: NFT_COLLECTION_ADDRESS,
       amount: toNano('0.05'),
       payload: ... // Mint message
     }]
   }
   await tonConnectUI.sendTransaction(transaction)
   ```

2. **Ethereum Integration**:
   ```typescript
   // Подключение MetaMask
   const provider = new ethers.BrowserProvider(window.ethereum)
   const signer = await provider.getSigner()
   const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)
   const tx = await contract.mintCard(cardId)
   await tx.wait()
   ```

### Для production базы данных:

1. Создайте Supabase проект
2. Обновите `prisma/schema.prisma`
3. Запустите миграции: `prisma migrate deploy`
4. Замените `userInventory/userCards` на Prisma queries

## Резюме

✅ **Минт теперь работает** (mock версия для тестирования)  
✅ **Данные сохраняются** между перезапусками (файловая система)  
✅ **Автосохранение** каждые 5 минут  
✅ **Немедленное сохранение** после важных операций  

⚠️ **Для продакшена**: заменить файловую систему на PostgreSQL/Supabase  
⚠️ **Реальный минт**: требует полной интеграции с TON/ETH smart contracts
