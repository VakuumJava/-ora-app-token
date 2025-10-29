-- Скрипт для очистки старых данных и оставления только 1 карточки + 3 осколков
-- Запустить на Railway через Prisma Studio или psql

BEGIN;

-- 1. Удаляем все собранные осколки пользователями
DELETE FROM "UserShard";

-- 2. Удаляем все созданные карточки пользователями
DELETE FROM "UserCard";

-- 3. Удаляем все spawn points
DELETE FROM "SpawnPoint";

-- 4. Удаляем все осколки
DELETE FROM "Shard";

-- 5. Удаляем все карточки
DELETE FROM "Card";

-- 6. Удаляем коллекции
DELETE FROM "Collection";

COMMIT;

-- После этого запустить seed:
-- npx tsx prisma/seed.ts
