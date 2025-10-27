# Railway Environment Variables Setup

## Проблема
Email верификация не работала из-за неправильного формирования URL редиректа (`localhost:8080` вместо реального домена).

## Решение
Добавлены исправления для правильного формирования URL и логирование для отладки.

## Необходимые действия в Railway

### 1. Установите переменную окружения APP_URL

В настройках вашего Railway проекта (`-ora-app-token`):

1. Перейдите в **Settings** → **Variables**
2. Добавьте новую переменную:
   - **Name:** `APP_URL`
   - **Value:** `https://qora.store`

3. Также убедитесь что `NEXT_PUBLIC_APP_URL` установлена правильно:
   - **Name:** `NEXT_PUBLIC_APP_URL`
   - **Value:** `https://qora.store`

### 2. Проверьте другие важные переменные

Убедитесь, что следующие переменные установлены:

```bash
DATABASE_URL="postgresql://..."          # URL к вашей PostgreSQL БД
JWT_SECRET="..."                         # Секретный ключ для JWT
JWT_REFRESH_SECRET="..."                 # Секретный ключ для refresh токенов
RESEND_API_KEY="re_..."                  # API ключ от Resend для отправки email
EMAIL_FROM="Qora NFT <onboarding@resend.dev>"  # Email отправителя
```

### 3. Redeploy

После добавления переменных:
1. Railway автоматически запустит новый деплой
2. Или нажмите **Deploy** → **Redeploy** вручную

### 4. Проверка работы

После деплоя:

1. **Зарегистрируйте нового пользователя** на https://qora.store/register
2. **Проверьте email** - должно прийти письмо с подтверждением
3. **Кликните на ссылку** в письме
4. **Проверьте логи** в Railway Dashboard → **Deployments** → **View Logs**

Вы должны увидеть логи:
```
🔍 Email verification attempt: { token: '...', url: '...' }
✅ User found: { userId: '...', email: '...' }
🔗 Redirect URL info: { baseUrl: 'https://qora.store', ... }
✅ Email verified successfully for user: ...
```

### 5. Если возникают проблемы

Проверьте логи Railway на наличие:
- ❌ ошибок подключения к БД
- ❌ ошибок отправки email через Resend
- ❌ неправильных URL редиректов

## Что было исправлено

### 1. `/app/api/auth/verify-email/route.ts`
- Добавлена функция `getRedirectUrl()` для правильного формирования URL
- Используются заголовки `host` и `x-forwarded-proto` для определения протокола
- Добавлено детальное логирование каждого шага верификации
- Улучшена обработка ошибок

### 2. `/lib/email.ts`
- Добавлено логирование генерации URL верификации
- Теперь сначала проверяется `APP_URL`, затем `NEXT_PUBLIC_APP_URL`

### 3. Environment files
- Обновлены `.env`, `.env.local`, `.env.example`
- Добавлена переменная `APP_URL` для явного указания базового URL приложения

## Тестирование локально

Для тестирования на локальной машине:

```bash
# В .env.local установите:
APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY="your_actual_resend_key"

# Запустите dev сервер:
pnpm dev

# Зарегистрируйте тестового пользователя
# Проверьте консоль на наличие логов верификации
```

## Дополнительная информация

- Email верификация использует токен с истечением 24 часа
- После верификации пользователь редиректится на `/?email_verified=true`
- При ошибках пользователь редиректится на `/login?error=...`
- Все ошибки логируются в консоль для отладки
