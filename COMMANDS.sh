#!/bin/bash

# ================================================================
# QORA NFT Platform - Команды для быстрой настройки
# ================================================================
# Используйте эти команды для настройки проекта
# Копируйте и выполняйте в терминале

# ================================================================
# 1. УСТАНОВКА ЗАВИСИМОСТЕЙ
# ================================================================

# Установить pnpm (если еще не установлен)
npm install -g pnpm

# Установить зависимости проекта
pnpm install

# ================================================================
# 2. НАСТРОЙКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ
# ================================================================

# Скопировать шаблон .env
cp .env.example .env.local

# Открыть файл для редактирования (выберите один)
nano .env.local
# или
code .env.local
# или
vim .env.local

# Вставьте ваши Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# ================================================================
# 3. ЗАПУСК ПРОЕКТА
# ================================================================

# Режим разработки (с hot reload)
pnpm dev

# Откройте в браузере:
# http://localhost:3000

# Сборка для продакшена
pnpm build

# Запуск продакшен версии
pnpm start

# ================================================================
# 4. ПРОВЕРКА РАБОТЫ
# ================================================================

# Проверить что .env.local существует
cat .env.local

# Проверить установленные зависимости
pnpm list --depth=0

# Проверить версию Node.js (должна быть 18+)
node --version

# ================================================================
# 5. TROUBLESHOOTING
# ================================================================

# Очистить node_modules и переустановить
rm -rf node_modules
rm -rf .next
pnpm install

# Очистить кеш Next.js
rm -rf .next

# Проверить логи dev сервера
pnpm dev 2>&1 | tee dev.log

# ================================================================
# 6. GIT КОМАНДЫ (для контроля версий)
# ================================================================

# Инициализировать git (если еще не сделано)
git init

# Добавить все файлы
git add .

# Сделать коммит
git commit -m "Database implementation with unique nicknames"

# Добавить remote (замените на ваш URL)
# git remote add origin https://github.com/your-username/qora-nft.git

# Отправить на GitHub
# git push -u origin main

# ================================================================
# 7. ПОЛЕЗНЫЕ КОМАНДЫ NPM/PNPM
# ================================================================

# Обновить все зависимости
pnpm update

# Проверить устаревшие пакеты
pnpm outdated

# Установить конкретный пакет
pnpm add package-name

# Удалить пакет
pnpm remove package-name

# Запустить линтер
pnpm lint

# Исправить lint ошибки автоматически
pnpm lint --fix

# ================================================================
# 8. DOCKER (опционально)
# ================================================================

# Создать Docker образ
# docker build -t qora-nft-platform .

# Запустить контейнер
# docker run -p 3000:3000 --env-file .env.local qora-nft-platform

# ================================================================
# 9. VERCEL DEPLOYMENT
# ================================================================

# Установить Vercel CLI
npm install -g vercel

# Войти в Vercel
vercel login

# Деплой проекта
vercel

# Деплой в продакшен
vercel --prod

# ================================================================
# 10. ТЕСТИРОВАНИЕ API
# ================================================================

# Проверить API проверки nickname
curl "http://localhost:3000/api/auth/check-nickname?nickname=test"

# Ожидаемый ответ:
# {"available":true,"message":"Nickname доступен"}

# ================================================================
# SUPABASE SQL МИГРАЦИИ (выполняйте в Supabase SQL Editor)
# ================================================================

# 1. Откройте Supabase Dashboard:
#    https://app.supabase.com/

# 2. Выберите ваш проект

# 3. Откройте SQL Editor

# 4. Выполните миграции в следующем порядке:
#    - scripts/008_create_profiles_with_unique_nicknames.sql
#    - scripts/005_create_admin_tables.sql (для админки)
#    - scripts/006_admin_functions.sql (для админки)
#    - scripts/007_test_data.sql (тестовые данные)

# 5. Проверьте что таблицы созданы:
#    Table Editor > profiles (должна быть видна)

# ================================================================
# SQL ЗАПРОСЫ ДЛЯ ПРОВЕРКИ (в Supabase SQL Editor)
# ================================================================

# Все профили
# SELECT * FROM profiles;

# Проверка nickname
# SELECT check_nickname_available('test');

# Статистика пользователя
# SELECT * FROM profile_stats;

# Все функции
# SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';

# ================================================================
# ПОЛЕЗНЫЕ АЛИАСЫ (добавьте в ~/.zshrc или ~/.bashrc)
# ================================================================

# alias qora-dev="cd /path/to/qora-nft && pnpm dev"
# alias qora-build="cd /path/to/qora-nft && pnpm build"
# alias qora-log="cd /path/to/qora-nft && tail -f dev.log"

# ================================================================
# ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ ДЛЯ РАЗНЫХ ОКРУЖЕНИЙ
# ================================================================

# Development (.env.local)
# NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=dev_key

# Production (.env.production)
# NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_key

# ================================================================
# МОНИТОРИНГ И ЛОГИ
# ================================================================

# Просмотр логов в реальном времени
# pnpm dev | tee -a dev.log

# Grep по ошибкам
# cat dev.log | grep -i error

# Суммарная статистика
# wc -l dev.log

# ================================================================
# БЭКАП БАЗЫ ДАННЫХ (через Supabase CLI)
# ================================================================

# Установить Supabase CLI
# npm install -g supabase

# Войти
# supabase login

# Создать бэкап
# supabase db dump > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановить из бэкапа
# supabase db push < backup.sql

# ================================================================
# КОНЕЦ ФАЙЛА
# ================================================================

echo "✅ Все команды загружены!"
echo "📚 См. документацию:"
echo "   - SUPABASE_SETUP.md"
echo "   - QUICK_DATABASE_SETUP.md"
echo "   - README.md"
