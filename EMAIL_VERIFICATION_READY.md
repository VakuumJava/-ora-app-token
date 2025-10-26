# ✅ Email Verification - Готово к использованию!

## 🎯 Что настроено

### 1. Backend (100% готов)
- ✅ Prisma схема обновлена (emailVerified, verificationToken, verificationTokenExpiry)
- ✅ Email утилиты в `lib/email.ts` (генерация токенов, отправка)
- ✅ API endpoint `/api/auth/verify-email` для подтверждения
- ✅ Регистрация отправляет письмо с токеном
- ✅ Логин показывает статус верификации

### 2. Email (Resend интегрирован)
- ✅ API ключ: `re_2iSZ6gm4_JgP2f36tN9NzNiFSzJSUDSQA`
- ✅ Отправитель: `Qora NFT <onboarding@resend.dev>`
- ✅ Красивый HTML шаблон в стиле Qora NFT
- ✅ 24-часовой токен верификации

### 3. Переменные окружения
```env
RESEND_API_KEY="re_2iSZ6gm4_JgP2f36tN9NzNiFSzJSUDSQA"
EMAIL_FROM="Qora NFT <onboarding@resend.dev>"
NEXT_PUBLIC_APP_URL="https://ora-app-token-production.up.railway.app"
```

---

## 🚀 Деплой на Railway

### Вариант 1: Railway Dashboard (рекомендуется)

1. Откройте **[Railway Dashboard](https://railway.app/dashboard)**
2. Выберите проект **`ora-app-token-production`**
3. Перейдите в **Variables**
4. Добавьте 3 переменные (см. выше)
5. Railway автоматически передеплоит

### Вариант 2: Railway CLI

```bash
# Подключитесь к проекту
railway link

# Добавьте переменные
railway variables set RESEND_API_KEY="re_2iSZ6gm4_JgP2f36tN9NzNiFSzJSUDSQA"
railway variables set EMAIL_FROM="Qora NFT <onboarding@resend.dev>"
railway variables set NEXT_PUBLIC_APP_URL="https://ora-app-token-production.up.railway.app"

# Задеплойте
railway up
```

### Вариант 3: Автоматический скрипт

```bash
./scripts/setup-railway-env.sh
```

---

## ✅ Проверка работы

После деплоя:

1. **Откройте**: https://ora-app-token-production.up.railway.app/register
2. **Зарегистрируйтесь** с реальным email
3. **Проверьте почту** (включая спам)
4. **Нажмите** кнопку "✅ Подтвердить email"
5. **Увидите** зелёное сообщение на странице логина

---

## 📧 Тестовый email

**zilolatashievaz@gmail.com** - можете использовать для теста

---

## 🔍 Отладка

### Проверка логов
```bash
railway logs
```

Ищите:
- `✅ Verification email sent to ...` - успех
- `❌ Failed to send verification email` - ошибка

### Проверка в Resend Dashboard
https://resend.com/emails - все отправленные письма

### Типичные проблемы

❌ **Письма не приходят**
- Проверьте спам/промоакции
- Убедитесь, что API ключ правильно вставлен
- Проверьте лимит (100 писем/день на Free плане)

❌ **Invalid API Key**
- Перезапустите сервер после изменения `.env`
- Убедитесь, что нет пробелов в ключе

❌ **Ссылка не работает**
- Проверьте, что `NEXT_PUBLIC_APP_URL` правильный
- Токен действителен только 24 часа

---

## 📊 Структура письма

```
┌─────────────────────────────────┐
│   🌟 Qora NFT (градиентный лого)│
├─────────────────────────────────┤
│                                 │
│   Подтвердите ваш email         │
│                                 │
│   Спасибо за регистрацию...     │
│                                 │
│   ┌──────────────────────┐      │
│   │ ✅ Подтвердить email │      │
│   └──────────────────────┘      │
│                                 │
│   Ссылка (если кнопка не работает)│
│                                 │
│   ⚠️ Действительна 24 часа      │
├─────────────────────────────────┤
│   © 2025 Qora NFT               │
└─────────────────────────────────┘
```

---

## 📁 Файлы

- `lib/email.ts` - email утилиты
- `app/api/auth/verify-email/route.ts` - endpoint верификации
- `app/api/auth/register/route.ts` - отправка при регистрации
- `app/login/page.tsx` - отображение статуса
- `prisma/schema.prisma` - схема БД

---

## 🎯 Следующие шаги (опционально)

1. **Кастомный домен** - настройте в Resend для `noreply@yourdomain.com`
2. **Принудительная верификация** - добавьте проверку в `/api/auth/login`
3. **Повторная отправка** - endpoint для resend письма
4. **Уведомления** - email при важных событиях (чекин, покупка и т.д.)

---

## 🔒 Безопасность

⚠️ API ключ уже в репозитории. Для production:

1. Создайте новый API ключ в Resend
2. Удалите старый ключ
3. Обновите в Railway через Variables

---

## 🎉 Готово!

Система верификации email полностью готова к использованию. После добавления переменных в Railway всё будет работать автоматически!
