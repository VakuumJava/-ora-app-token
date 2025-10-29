# ✅ Миграция на PostgreSQL завершена

## 🎯 Что исправлено

### 1. ❌ Проблема: Данные сбрасываются на Railway
**Решение:** Все данные теперь хранятся в PostgreSQL через Prisma
- ❌ Убрана file-persistence (файлы не работают на Railway)
- ❌ Убраны in-memory массивы (tempSpawnPoints, userInventory, userCards)
- ✅ Все операции теперь через базу данных

### 2. ❌ Проблема: Статистика показывает неверные цифры
**Решение:** Статистика теперь берётся из реальных данных БД
- ✅ `/api/user/stats` использует `getUserStats()` из db-storage
- ✅ Реальный подсчёт через Prisma:
  - `totalShards`: `UserShard.count({ where: { userId, used: false } })`
  - `totalCards`: `UserCard.count({ where: { userId, minted: false } })`

### 3. ❌ Проблема: Нужен реальный минт, не mock
**Решение:** Mock mint удалён, работает только TON blockchain
- ❌ Удалён `/api/mint/mock`
- ✅ Реальный TON минт через `/api/mint/ton` с TonConnect
- ✅ Генерация транзакций для TON blockchain

### 4. ❌ Проблема: Карты не удаляются после минта
**Решение:** Карты автоматически удаляются из БД
- ✅ Функция `deleteCardAfterMint(cardId, tokenId, txHash)` в db-storage
- ✅ Вызывается в PUT `/api/mint/ton` после подтверждения транзакции
- ✅ `prisma.userCard.delete()` - карта полностью удаляется

### 5. ✅ Авто-логин уже работает
- ✅ `getUserSession()` в `/lib/user-session.ts`
- ✅ Сохранение в localStorage
- ✅ Автоматическая проверка при загрузке страницы

---

## 📦 Созданные файлы

### `/lib/db-storage.ts` (331 строк)
Полная замена file-persistence. Все операции через Prisma:

```typescript
// Основные функции:
export async function getActiveSpawnPoints()
export async function createSpawnPoint(shardId, latitude, longitude, radius?, expiresAt?)
export async function collectShard(userId, shardId)
export async function getUserInventory(userId)
export async function craftCard(userId, shardIds)
export async function deleteCardAfterMint(userCardId, tokenId, txHash)
export async function getOrCreateUser(nickname)
export async function getUserStats(userId)
export async function transferCard(userCardId, fromUserId, toNickname)
```

---

## 🔄 Переписанные API

### 1. `/app/api/checkin/route.ts`
- ✅ Использует `collectShard()` из db-storage
- ✅ Валидация расстояния
- ✅ Проверка дубликатов в БД

### 2. `/app/api/inventory/route.ts`
- ✅ Использует `getUserInventory()` из db-storage
- ✅ Возвращает только неиспользованные осколки
- ✅ Возвращает только незаминченные карты

### 3. `/app/api/craft/route.ts`
- ✅ Использует `craftCard()` из db-storage
- ✅ Валидация 3 осколков (A+B+C)
- ✅ Транзакция: создание карты + пометка осколков
- ✅ Обновление счётчиков (totalCards, mintedCount)

### 4. `/app/api/user/stats/route.ts`
- ✅ Использует `getUserStats()` из db-storage
- ✅ Реальные цифры из БД
- ✅ Исправлена статистика

### 5. `/app/api/transfer/route.ts`
- ✅ Использует `transferCard()` из db-storage
- ✅ Проверка владельца
- ✅ Создание получателя если не существует

### 6. `/app/api/spawn-points/route.ts`
- ✅ Использует `getActiveSpawnPoints()` из db-storage
- ✅ Фильтр по активным и не истёкшим
- ✅ Включает связанные данные (shard, card)

### 7. `/app/api/mint/ton/route.ts`
- ✅ POST: генерация TON транзакции
- ✅ Валидация карты в БД
- ✅ Проверка владельца через Prisma
- ✅ PUT: подтверждение минта
- ✅ Удаление карты через `deleteCardAfterMint()`

### 8. `/app/inventory/page.tsx`
- ✅ handleMint теперь вызывает `/api/mint/ton` (реальный)
- ✅ Убран вызов mock API

---

## 🗑️ Удалённые файлы

```bash
lib/file-persistence.ts      # ❌ Не работает на Railway
lib/spawn-storage.ts          # ❌ Заменён на db-storage.ts
app/api/mint/mock/route.ts    # ❌ Пользователь требует только реальный минт
```

---

## 🗄️ Архитектура базы данных

### Используемые таблицы:
```sql
User
  - id (uuid)
  - nickname (unique)
  - totalShards (int)
  - totalCards (int)

UserShard
  - id (uuid)
  - userId -> User
  - shardId -> Shard
  - collectedAt (timestamp)
  - used (boolean)

UserCard
  - id (uuid)
  - userId -> User
  - cardId -> Card
  - assembledAt (timestamp)
  - minted (boolean)
  - tokenId (string?)

SpawnPoint
  - id (uuid)
  - shardId -> Shard
  - latitude, longitude
  - radius
  - active (boolean)
  - expiresAt (timestamp?)
```

### Паттерн использования:
```typescript
// 1. Получить/создать пользователя
const user = await getOrCreateUser(nickname)

// 2. Собрать осколок
await collectShard(user.id, shardId)

// 3. Скрафтить карту
await craftCard(user.id, [shardId1, shardId2, shardId3])

// 4. Заминтить и удалить
await deleteCardAfterMint(userCardId, tokenId, txHash)
```

---

## 🚀 Тестирование

### Локально:
```bash
# 1. Убедитесь что БД запущена
DATABASE_URL="postgresql://..."

# 2. Применить миграции
npx prisma migrate deploy

# 3. Запустить dev
pnpm dev
```

### На Railway:
```bash
# 1. Добавить переменные окружения:
DATABASE_URL=postgresql://...

# 2. Deploy
railway up

# 3. Применить миграции (автоматически)
npx prisma migrate deploy
```

### Проверить работу:
1. ✅ Собрать осколки → проверить в БД
2. ✅ Скрафтить карту → проверить в БД
3. ✅ Посмотреть статистику → цифры правильные
4. ✅ Заминтить карту → карта удалена из БД
5. ✅ Перезапустить сервер → данные остались

---

## 📝 Важные моменты

### ✅ Что работает:
- Все данные в PostgreSQL (не сбрасываются)
- Статистика считается из БД (правильные цифры)
- Реальный TON минт (не mock)
- Карты удаляются после минта
- Авто-логин через localStorage

### ⚠️ Что нужно настроить на Railway:
```env
DATABASE_URL=postgresql://user:pass@host:port/db
NEXT_PUBLIC_TON_COLLECTION_ADDRESS=EQC...
```

### 🔧 Команды для БД:
```bash
# Создать миграцию
npx prisma migrate dev --name migration_name

# Применить миграции
npx prisma migrate deploy

# Сгенерировать Prisma Client
npx prisma generate

# Открыть Prisma Studio
npx prisma studio
```

---

## ✅ Все требования выполнены

1. ✅ "нужен реальный минт, никакого тестового" - mock удалён, работает TON
2. ✅ "статистика по осколкам неверная" - исправлена через getUserStats()
3. ✅ "все сбрасывается при обновлении на хосте" - данные в PostgreSQL
4. ✅ "пусть не выходит постоянно с аккаунта" - авто-логин работает
5. ✅ "после минта карта из профиля должна пропадать навсегда" - deleteCardAfterMint()
6. ✅ "СУПАБЕЙЗ ВООБЩЕ НЕ НУЖНА!" - используется только Prisma + PostgreSQL
7. ✅ "дай чистый код" - чистая архитектура, без ошибок компиляции

---

## 🎉 Готово к деплою!

Все API переписаны, mock удалён, данные в БД, ошибок нет. Можно деплоить на Railway! 🚀
