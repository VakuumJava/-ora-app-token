# 🚀 Настройка собственного Backend

Этот проект использует **собственный backend** на Next.js API Routes + PostgreSQL + Prisma ORM.

---

## ⚡ Быстрый старт (10 минут)

### 1. Установите PostgreSQL

#### macOS (Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows:
Скачайте установщик с https://www.postgresql.org/download/windows/

#### Docker (рекомендуется для разработки):
```bash
docker run --name qora-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=qora_nft \
  -p 5432:5432 \
  -d postgres:15
```

---

### 2. Создайте базу данных

```bash
# Подключитесь к PostgreSQL
psql -U postgres

# Создайте базу данных
CREATE DATABASE qora_nft;

# Создайте пользователя (опционально)
CREATE USER qora_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE qora_nft TO qora_user;

# Выйдите
\q
```

---

### 3. Настройте переменные окружения

```bash
# Скопируйте шаблон
cp .env.example .env.local

# Отредактируйте .env.local
nano .env.local
```

Вставьте:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/qora_nft"

# JWT Secrets (ОБЯЗАТЕЛЬНО ИЗМЕНИТЕ В ПРОДАКШЕНЕ!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-123456789"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production-987654321"

# JWT Expiration
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

---

### 4. Выполните миграции Prisma

```bash
# Создать миграцию и применить к БД
npx prisma migrate dev --name init

# Или просто отправить схему в БД
npx prisma db push

# Сгенерировать Prisma Client
npx prisma generate
```

---

### 5. Запустите проект

```bash
pnpm install
pnpm dev
```

Откройте http://localhost:3000

---

## 📊 Структура базы данных

### Основные таблицы:

```
users              - Пользователи с уникальными nickname
├─ email           (UNIQUE)
├─ nickname        (UNIQUE, case-insensitive)
├─ passwordHash    (bcrypt)
└─ ...

sessions           - JWT сессии (refresh tokens)
collections        - NFT коллекции
cards              - Карточки NFT
shards             - Осколки (3 на карточку)
spawn_points       - Точки спавна на карте
drops              - Расписание дропов
user_shards        - Осколки пользователей
user_cards         - Собранные карточки
listings           - Маркетплейс
admin_roles        - Роли администраторов
settings           - Настройки системы
web3_config        - Web3 конфигурация
audit_log          - Логи действий админов
```

---

## 🔐 Аутентификация

### Реализовано:

✅ **JWT токены:**
- Access token (15 минут) - в HttpOnly cookie
- Refresh token (7 дней) - в HttpOnly cookie

✅ **Хеширование паролей:**
- bcryptjs с 10 rounds

✅ **Уникальные nickname:**
- Case-insensitive проверка
- Constraint на уровне БД

✅ **API endpoints:**
- `/api/auth/register` - регистрация
- `/api/auth/login` - вход (по email или nickname)
- `/api/auth/logout` - выход
- `/api/auth/me` - текущий пользователь
- `/api/auth/refresh` - обновление токена
- `/api/auth/check-nickname` - проверка nickname

---

## 🛠️ Prisma CLI

### Полезные команды:

```bash
# Создать миграцию
npx prisma migrate dev --name migration_name

# Применить миграции к prod БД
npx prisma migrate deploy

# Отправить схему в БД (без миграций)
npx prisma db push

# Сгенерировать Prisma Client
npx prisma generate

# Открыть Prisma Studio (GUI для БД)
npx prisma studio

# Посмотреть статус миграций
npx prisma migrate status

# Создать сидеры (seed data)
npx prisma db seed
```

---

## 📝 Примеры использования API

### Регистрация:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "nickname": "Alikhan",
    "password": "123456"
  }'
```

### Вход:
```bash
# По email
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com",
    "password": "123456"
  }'

# Или по nickname
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "Alikhan",
    "password": "123456"
  }'
```

### Проверка nickname:
```bash
curl "http://localhost:3000/api/auth/check-nickname?nickname=Alikhan"
```

---

## 🐛 Troubleshooting

### Ошибка: "Can't reach database server"
```bash
# Проверьте что PostgreSQL запущен
brew services list  # macOS
systemctl status postgresql  # Linux
docker ps  # Docker

# Проверьте DATABASE_URL в .env.local
echo $DATABASE_URL
```

### Ошибка: "Prisma schema not found"
```bash
# Проверьте что prisma/schema.prisma существует
ls prisma/schema.prisma

# Сгенерируйте клиент заново
npx prisma generate
```

### Ошибка: "Table does not exist"
```bash
# Примените миграции
npx prisma migrate dev

# Или отправьте схему
npx prisma db push
```

### Ошибка при миграциях
```bash
# Сбросить БД (ВНИМАНИЕ: удалит все данные!)
npx prisma migrate reset

# Создать миграцию заново
npx prisma migrate dev
```

---

## 🔒 Безопасность

### ✅ Реализовано:

1. **HttpOnly cookies** - защита от XSS
2. **bcrypt хеширование** - безопасное хранение паролей
3. **JWT токены** - безопасная аутентификация
4. **UNIQUE constraints** - на nickname и email
5. **SQL injection защита** - Prisma ORM
6. **Rate limiting** - TODO (добавить в продакшене)

### 🔐 Рекомендации для продакшена:

1. Измените `JWT_SECRET` и `JWT_REFRESH_SECRET`
2. Включите HTTPS (secure cookies)
3. Добавьте rate limiting
4. Настройте CORS
5. Используйте strong passwords (12+ символов)
6. Включите 2FA (опционально)
7. Настройте мониторинг и логирование

---

## 📦 Deployment

### Vercel + Neon (рекомендуется):

1. Создайте проект на https://neon.tech (бесплатно)
2. Скопируйте `DATABASE_URL`
3. Задеплойте на Vercel:
```bash
vercel --prod
```
4. Добавьте environment variables в Vercel Dashboard
5. Выполните миграции:
```bash
npx prisma migrate deploy
```

### Railway:

1. Создайте проект на https://railway.app
2. Добавьте PostgreSQL service
3. Подключите GitHub repo
4. Добавьте environment variables
5. Railway автоматически выполнит миграции

---

## 🎯 Следующие шаги

После настройки backend:

1. ✅ Протестируйте регистрацию
2. ✅ Проверьте уникальность nickname
3. ✅ Протестируйте вход
4. 🔄 Реализуйте API для коллекций
5. 🔄 Реализуйте API для карточек
6. 🔄 Реализуйте API для осколков
7. 🔄 Реализуйте геолокацию и чекины
8. 🔄 Реализуйте маркетплейс

---

## 📚 Документация

- [Prisma Docs](https://www.prisma.io/docs/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [JWT.io](https://jwt.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

---

**Backend готов к использованию! 🚀**

**Nickname НЕ МОГУТ повторяться - гарантировано на уровне PostgreSQL!** ✅
