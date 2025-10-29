# 🔧 Инструкция по очистке старых данных на Railway

## Проблема
На скриншоте видно **множество карточек** (Каменная Пирамида, Золотой Дракон, Корона Судьбы), но должна быть только **1 карточка "Qora Card"** с **3 осколками**.

## Причина
Старые данные остались в базе после предыдущего seed с 5 карточками.

## Решение

### Вариант 1: Через API (Рекомендуется)

1. Откройте в браузере:
```
https://qora.store/api/admin/reset-database
```

2. Отправьте POST запрос (через Postman или curl):
```bash
curl -X POST https://qora.store/api/admin/reset-database
```

3. API автоматически:
   - Удалит все старые карточки и осколки
   - Создаст 1 карточку "Qora Card"
   - Создаст 3 осколка (A, B, C)

### Вариант 2: Через Railway CLI

1. Подключитесь к базе:
```bash
railway connect postgres
```

2. Выполните SQL скрипт:
```sql
-- Удаляем старые данные
DELETE FROM "UserShard";
DELETE FROM "UserCard";
DELETE FROM "SpawnPoint";
DELETE FROM "Shard";
DELETE FROM "Card";
DELETE FROM "Collection";
```

3. Перезапустите seed:
```bash
railway run npx tsx prisma/seed.ts
```

### Вариант 3: Через build script

Seed автоматически запускается при каждом деплое, но использует `upsert`, который обновляет существующие записи. Нужно сначала очистить базу вручную через Вариант 1 или 2.

## Результат

После очистки в базе будет:
- ✅ 1 коллекция: "Qora Collection"
- ✅ 1 карточка: "Qora Card" (rare)
- ✅ 3 осколка: Fragment A, B, C

## Исправлена ошибка "User not found"

**Причина:** `CardDetailsModal` отправлял `card.owner` (nickname) вместо `userId` (UUID).

**Решение:** Теперь берётся реальный `userId` из `localStorage` (qora_autologin_userId).

```typescript
// Было
userId: card.owner || 'demo_user'  // ❌ nickname

// Стало
const savedUserId = localStorage.getItem('qora_autologin_userId')
userId: savedUserId  // ✅ UUID
```

## Проверка

После очистки проверьте:

1. Админ панель `/admin/spawn-points` - должно быть 3 осколка
2. Инвентарь после сбора - показывает "Qora Card - Fragment A/B/C"
3. Минт работает без ошибки "User not found"
