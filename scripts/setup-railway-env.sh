#!/bin/bash

# Скрипт для настройки переменных окружения на Railway

echo "🚀 Настройка переменных окружения для Railway..."

# Проверка, что Railway CLI установлен
if ! command -v railway &> /dev/null
then
    echo "❌ Railway CLI не установлен"
    echo "📦 Установите: npm i -g @railway/cli"
    echo "🔗 https://docs.railway.app/develop/cli"
    exit 1
fi

# Проверка, что проект подключен
if [ ! -f "railway.json" ] && [ ! -d ".railway" ]; then
    echo "❌ Проект не подключен к Railway"
    echo "🔗 Выполните: railway link"
    exit 1
fi

echo ""
echo "📧 Настройка Email (Resend)..."
railway variables set RESEND_API_KEY="re_2iSZ6gm4_JgP2f36tN9NzNiFSzJSUDSQA"
railway variables set EMAIL_FROM="Qora NFT <onboarding@resend.dev>"

echo ""
echo "🌐 Настройка App URL..."
railway variables set NEXT_PUBLIC_APP_URL="https://ora-app-token-production.up.railway.app"

echo ""
echo "✅ Переменные окружения настроены!"
echo ""
echo "📊 Текущие переменные:"
railway variables

echo ""
echo "🚀 Деплой на Railway..."
railway up

echo ""
echo "✅ Готово! Приложение задеплоено на Railway"
echo "🔗 https://ora-app-token-production.up.railway.app"
