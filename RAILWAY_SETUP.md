# Railway Deployment Setup

## 🚀 Настройка переменных окружения для Railway

### Через Railway CLI

```bash
# 1. Войдите в Railway
railway login

# 2. Подключитесь к проекту
railway link

# 3. Добавьте переменные окружения
railway variables set RESEND_API_KEY="re_2iSZ6gm4_JgP2f36tN9NzNiFSzJSUDSQA"
railway variables set EMAIL_FROM="Qora NFT <onboarding@resend.dev>"
railway variables set NEXT_PUBLIC_APP_URL="https://ora-app-token-production.up.railway.app"

# 4. Задеплойте
railway up
```

### Через Railway Dashboard (Web UI)

1. Откройте **[Railway Dashboard](https://railway.app/dashboard)**
2. Выберите проект **`ora-app-token-production`**
3. Перейдите в **Variables** (вкладка слева)
4. Добавьте следующие переменные:

```env
RESEND_API_KEY=re_2iSZ6gm4_JgP2f36tN9NzNiFSzJSUDSQA
EMAIL_FROM=Qora NFT <onboarding@resend.dev>
NEXT_PUBLIC_APP_URL=https://ora-app-token-production.up.railway.app
```

5. Нажмите **Save** - Railway автоматически передеплоит приложение

---

## ✅ Проверка работы

После деплоя:

1. Откройте `https://ora-app-token-production.up.railway.app/register`
2. Зарегистрируйте нового пользователя с **реальным email**
3. Проверьте почту - должно прийти письмо от `onboarding@resend.dev`
4. Нажмите кнопку **"✅ Подтвердить email"** в письме
5. Вас перенаправит на `/login` с зелёным сообщением

---

## 📧 Тестовый email для проверки

Тестовый получатель: **zilolatashievaz@gmail.com**

Можете зарегистрироваться с этим email, чтобы проверить доставку писем.

---

## 🔍 Отладка

### Проверка логов Railway

```bash
railway logs
```

Ищите строки:
- `✅ Verification email sent to user@example.com` - письмо отправлено
- `❌ Failed to send verification email` - ошибка отправки

### Проверка переменных

```bash
railway variables
```

Убедитесь, что все три переменные установлены правильно.

---

## 🎯 Важные URL

- **Production**: https://ora-app-token-production.up.railway.app
- **Railway Dashboard**: https://railway.app/project/your-project-id
- **Resend Dashboard**: https://resend.com/emails (для просмотра отправленных писем)

---

## 🔒 Безопасность

⚠️ **ВАЖНО**: API ключ Resend уже закоммичен в репозиторий через этот чат. Рекомендации:

1. **Для production** - создайте новый API ключ в Resend Dashboard
2. **Удалите старый ключ** из Resend (если он был опубликован)
3. **Используйте Railway Secrets** для хранения чувствительных данных
4. **Добавьте `.env` в `.gitignore`** (если еще не добавлено)

### Создание нового API ключа

1. Откройте https://resend.com/api-keys
2. Нажмите **"Create API Key"**
3. Дайте имя: `Qora NFT Production`
4. Выберите **"Sending access"**
5. Скопируйте новый ключ
6. Обновите в Railway: `railway variables set RESEND_API_KEY="re_новый_ключ"`

---

## 📊 Лимиты Resend (Free Plan)

- ✅ 100 писем в день
- ✅ 1 домен
- ✅ Достаточно для MVP и тестирования

Если нужно больше - перейдите на платный план ($20/месяц = 50,000 писем).
