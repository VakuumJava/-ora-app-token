# Email Verification Setup

## Получение API ключа Resend

1. **Зарегистрируйтесь на Resend**: https://resend.com/signup
2. **Перейдите в раздел API Keys**: https://resend.com/api-keys
3. **Создайте новый API ключ**:
   - Нажмите "Create API Key"
   - Дайте ему имя (например, "Qora NFT Production")
   - Выберите права доступа: "Sending access"
   - Скопируйте ключ (он начинается с `re_`)

## Настройка домена (опционально)

По умолчанию Resend позволяет отправлять письма с `onboarding@resend.dev`, но для production рекомендуется настроить свой домен:

1. **Добавьте домен**: https://resend.com/domains
2. **Добавьте DNS записи** в настройках вашего домена (например, на Cloudflare или вашем регистраторе)
3. **Дождитесь верификации** (обычно 5-10 минут)
4. **Обновите `EMAIL_FROM`** в `.env`:
   ```
   EMAIL_FROM="Qora NFT <noreply@yourdomain.com>"
   ```

## Настройка переменных окружения

### Локальная разработка (.env)

```env
RESEND_API_KEY="re_ваш_api_ключ"
EMAIL_FROM="Qora NFT <onboarding@resend.dev>"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Production (Railway)

Добавьте переменные окружения в Railway:

```bash
railway variables set RESEND_API_KEY=re_ваш_api_ключ
railway variables set EMAIL_FROM="Qora NFT <noreply@yourdomain.com>"
railway variables set NEXT_PUBLIC_APP_URL="https://your-app.up.railway.app"
```

Или через Railway Dashboard:
1. Откройте ваш проект
2. Перейдите в "Variables"
3. Добавьте переменные:
   - `RESEND_API_KEY` = `re_ваш_api_ключ`
   - `EMAIL_FROM` = `Qora NFT <noreply@yourdomain.com>`
   - `NEXT_PUBLIC_APP_URL` = `https://your-app.up.railway.app`

## Проверка работы

1. **Запустите приложение**: `pnpm dev`
2. **Зарегистрируйте нового пользователя**
3. **Проверьте почту** - должно прийти письмо с подтверждением
4. **Нажмите на кнопку** "Подтвердить email" в письме
5. **Вас перенаправит** на страницу логина с сообщением об успешной верификации

## Лимиты Resend

### Free Plan
- 100 писем в день
- 1 домен
- Идеально для разработки и тестирования

### Paid Plans (от $20/месяц)
- 50,000 писем в месяц
- Неограниченное количество доменов
- Аналитика и логи

## Письмо для верификации

Шаблон письма находится в `lib/email.ts` и включает:
- 🌟 Брендированный дизайн в стиле Qora NFT
- 🎨 Градиенты и современный UI
- ✅ Большая кнопка подтверждения
- 🔗 Резервная ссылка, если кнопка не работает
- ⚠️ Предупреждение о сроке действия (24 часа)
- 📱 Адаптивный дизайн для мобильных устройств

Вы можете кастомизировать шаблон под свои нужды, изменив HTML в функции `sendVerificationEmail()`.

## Troubleshooting

### Письма не приходят

1. **Проверьте API ключ** - правильно ли он скопирован в `.env`
2. **Проверьте спам** - письма могут попадать в спам
3. **Проверьте логи** - в консоли должно быть `✅ Verification email sent to ...`
4. **Проверьте лимиты** - не превышен ли дневной лимит в 100 писем

### Ошибка "Invalid API Key"

- Убедитесь, что API ключ начинается с `re_`
- Проверьте, что нет лишних пробелов в `.env`
- Перезапустите сервер разработки после изменения `.env`

### Письма помечаются как спам

- Настройте собственный домен (вместо `onboarding@resend.dev`)
- Добавьте SPF, DKIM и DMARC записи через Resend
- Избегайте спам-триггеров в тексте письма

## Альтернативы Resend

Если хотите использовать другой сервис, отредактируйте `lib/email.ts`:

### SendGrid
```typescript
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
await sgMail.send({ from, to, subject, html })
```

### Nodemailer
```typescript
import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({ /* config */ })
await transporter.sendMail({ from, to, subject, html })
```

### AWS SES
```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
const client = new SESClient({ region: 'us-east-1' })
await client.send(new SendEmailCommand({ /* config */ }))
```
