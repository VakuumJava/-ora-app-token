#!/bin/bash

# Скрипт для очистки базы и пересоздания только 1 карточки + 3 осколков

echo "🗑️  Очистка старых данных..."

# Запускаем SQL скрипт
npx prisma db execute --file ./scripts/cleanup_old_data.sql

echo "✅ Старые данные удалены"

echo "🌱 Запуск seed для создания 1 карточки + 3 осколков..."

# Запускаем seed
npx tsx prisma/seed.ts

echo "✨ Готово! Теперь в базе только:"
echo "   - 1 карточка: Qora Card"
echo "   - 3 осколка: A, B, C"
