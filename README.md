# Qora - Geo-NFT Platform

Платформа для сбора геолокационных NFT-фрагментов в реальном мире.

## 🚀 Особенности

- 🗺️ **Спутниковая карта** - Реальная карта Leaflet с точками сбора фрагментов
- 📍 **Чекин система** - Радиус 5м, таймер удержания 3 секунды
- 🧩 **Система фрагментов** - Собирайте A/B/C фрагменты для создания полных карточек
- 🏪 **P2P Маркетплейс** - Торгуйте собранными карточками с другими пользователями
- 🎨 **5 коллекций** - Kalpak (Common), Museums (Uncommon), Ancienty (Rare), Ring (Epic), Bishkek (Legendary)
- 👤 **Регистрация и вход** - JWT аутентификация с уникальными никнеймами
- 🗄️ **Собственный Backend** - Next.js API + PostgreSQL + Prisma ORM
- �️ **Админ-панель** - Полнофункциональная панель управления для администраторов

## 🔥 Быстрый старт

```bash
# 1. Установите зависимости
pnpm install

# 2. Установите PostgreSQL (см. BACKEND_SETUP.md)
# Docker:
docker run --name qora-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=qora_nft \
  -p 5432:5432 \
  -d postgres:15

# 3. Настройте окружение
cp .env.example .env.local
# Отредактируйте .env.local с вашими credentials

# 4. Выполните миграции Prisma
npx prisma migrate dev --name init
npx prisma generate

# 5. Запустите проект
pnpm dev
```

Откройте http://localhost:3000

## 📚 Документация

### 🔥 Быстрый старт (Backend)
- 🚀 **[OWN_BACKEND_COMPLETE.md](OWN_BACKEND_COMPLETE.md)** - Что реализовано (НАЧНИТЕ ОТСЮДА!)
- ⚡ **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Полная инструкция по настройке
- 📝 **[prisma/schema.prisma](prisma/schema.prisma)** - Схема базы данных

### 📊 Архитектура и схемы
- 🗺️ **[DATABASE_SCHEMA_VISUAL.md](DATABASE_SCHEMA_VISUAL.md)** - Визуальная схема БД
- 🏗️ **[ARCHITECTURE.md](ARCHITECTURE.md)** - Архитектура системы
- 📖 **[BACKEND.md](BACKEND.md)** - Описание backend

### 🛠️ Админ-панель
- 🎮 **[ADMIN_PANEL.md](ADMIN_PANEL.md)** - Подробное руководство
- 🔌 **[API_EXAMPLES.md](API_EXAMPLES.md)** - Примеры использования API
- ⚡ **[QUICKSTART.md](QUICKSTART.md)** - Настройка админки за 20 минут
- ✅ **[CHECKLIST.md](CHECKLIST.md)** - Чеклист развертывания
- 📊 **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Сводка реализации

### 📝 SQL скрипты
- 📄 `scripts/008_create_profiles_with_unique_nicknames.sql` - Профили
- 📄 `scripts/005_create_admin_tables.sql` - Админские таблицы
- 📄 `scripts/006_admin_functions.sql` - Функции и триггеры
- 📄 `scripts/007_test_data.sql` - Тестовые данные
- 📄 `scripts/test_queries.sql` - SQL запросы для тестирования

## 🎮 Админ-панель

Мощная админ-панель для управления всем контентом платформы:

### Возможности
- **Dashboard** - Статистика в реальном времени
- **Collections** - Управление NFT коллекциями
- **Cards & Shards** - Создание карточек и осколков
- **Spawn Points** - Размещение точек на карте (ручное + CSV импорт)
- **Drops** - Расписания дропов
- **Marketplace** - Модерация и настройки
- **Users** - Управление пользователями
- **Web3** - Настройка смарт-контрактов
- **Audit Log** - Полное логирование действий

### Доступ
1. Выполните SQL миграции (005, 006, 008)
2. Назначьте себе роль Owner в таблице `admin_roles`
3. Откройте `/admin-panel`

## 🔒 Аутентификация

### Регистрация
- ✅ Уникальные никнеймы (Alikhan может быть только один!)
- ✅ Проверка доступности nickname в реальном времени
- ✅ Валидация формата (3-20 символов, только a-z, 0-9, _)
- ✅ **Email верификация** - Подтверждение email через письмо с токеном
- ✅ Автоматическое создание профиля через триггер

### Email Verification
- 📧 **Автоматическая отправка** письма при регистрации
- 🎨 **Красивый дизайн** письма в стиле Qora NFT
- ⏰ **24-часовой токен** для подтверждения
- 🔒 **Безопасность** - 32-байтовые токены через crypto
- 📬 **Resend интеграция** - Надёжная доставка писем

> 📖 Подробная инструкция по настройке: [EMAIL_SETUP.md](EMAIL_SETUP.md)

### Вход
- ✅ Вход по email или nickname
- ✅ Безопасное хранение паролей (Supabase Auth)
- ✅ JWT токены и сессии
- ✅ Row Level Security (RLS)

## 🗄️ База данных (Supabase)

### Таблицы
- `profiles` - Профили пользователей с уникальными никнеймами
- `collections` - NFT коллекции
- `cards` - Карточки
- `shards` - Осколки (3 на карточку)
- `spawn_points` - Точки спавна на карте
- `drops` - Расписания дропов
- `user_shards` - Осколки пользователей
- `user_cards` - Карточки пользователей
- `listings` - Листинги маркетплейса
- `admin_roles` - Роли администраторов
- `settings` - Настройки системы
- `audit_log` - Логи действий

### Функции
- `check_nickname_available(nickname)` - Проверка доступности nickname
- `get_current_profile()` - Получение текущего профиля
- `update_profile_stats(user_id)` - Обновление счетчиков
- `can_assemble_card(user_id, card_id)` - Проверка сборки карточки
- `increment_minted_count(card_id)` - Инкремент минтов
- И другие...

## Коллекции

Платформа поддерживает различные сезонные коллекции NFT, посвященные городу Бишкек. Каждая карточка состоит из 3 фрагментов (A/B/C), расположенных в разных точках города.

## Технологический стек

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (Radix UI)
- **Maps:** Leaflet (OpenStreetMap + спутниковые снимки)
- **Geolocation:** HTML5 Geolocation API

### Backend
- **Database:** PostgreSQL (через Prisma ORM)
- **Auth:** JWT tokens (access + refresh)
- **API:** Next.js API Routes
- **Security:** bcrypt, HttpOnly cookies, UNIQUE constraints

## Переменные окружения

### Обязательные (Backend)
```bash
# PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/qora_nft"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# JWT Expiration (опционально)
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

### Опциональные (имеют значения по умолчанию)
```bash
NEXT_PUBLIC_CHECKIN_RADIUS_METERS=5
NEXT_PUBLIC_CHECKIN_HOLD_SECONDS=3
NEXT_PUBLIC_MAX_GPS_ACCURACY_METERS=15
NEXT_PUBLIC_MAX_SPEED_MPS=2.5
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

📖 **Подробности:** См. `.env.example` и `SUPABASE_SETUP.md`

## Установка и запуск

```bash
# Установка зависимостей
pnpm install

# Настройка Supabase
cp .env.example .env.local
# Заполните Supabase credentials

# Выполните SQL миграции в Supabase SQL Editor
# 1. scripts/008_create_profiles_with_unique_nicknames.sql
# 2. scripts/005_create_admin_tables.sql (для админки)
# 3. scripts/006_admin_functions.sql (для админки)
# 4. scripts/007_test_data.sql (тестовые данные)

# Запуск в режиме разработки
pnpm dev

# Сборка для продакшена
pnpm build

# Запуск продакшен версии
pnpm start
```

## Структура проекта

```
app/
├── page.tsx              # Главная страница
├── login/                # Авторизация
├── register/             # Регистрация (с проверкой nickname)
├── auth/
│   ├── callback/         # OAuth callback
│   └── check-email/      # Проверка email
├── map/                  # Карта с фрагментами
├── checkin/              # Система чекина
├── inventory/            # Инвентарь пользователя
├── collections/          # Браузер коллекций
├── marketplace/          # P2P маркетплейс
├── profile/              # Профиль пользователя
├── admin-panel/          # Админ-панель (новая!)
└── api/
    ├── admin/            # Admin API endpoints
    └── auth/
        └── check-nickname/  # Проверка nickname

lib/
├── auth.ts               # Auth сервис (Supabase)
├── types.ts              # TypeScript типы
├── env.ts                # Конфигурация переменных
├── check-in-config.ts    # Настройки чекина
├── geo-utils.ts          # Геолокационные утилиты
├── admin-types.ts        # Типы админки
├── admin-utils.ts        # Утилиты админки
└── supabase/
    ├── client.ts         # Supabase клиент (browser)
    ├── server.ts         # Supabase клиент (server)
    └── middleware.ts     # Middleware для auth

scripts/
├── 005_create_admin_tables.sql     # Админские таблицы
├── 006_admin_functions.sql         # Админские функции
├── 007_test_data.sql               # Тестовые данные
└── 008_create_profiles_with_unique_nicknames.sql  # Профили
```

## Требования для чекина (по ТЗ)

- **Радиус**: 5 метров от точки
- **Удержание**: 3 секунды
- **Точность GPS**: ≤15 метров
- **Максимальная скорость**: ≤2.5 м/с (9 км/ч)
- **Анти-телепорт**: Флаг при перемещении >100м мгновенно

## Система фрагментов

Каждая карточка состоит из 3 фрагментов:
- **Фрагмент A** (красный) - Первая часть
- **Фрагмент B** (зелёный) - Вторая часть
- **Фрагмент C** (синий) - Третья часть

При сборе всех трёх фрагментов одной карточки происходит автоматическая сборка в полную NFT-карточку.

## Редкость

- **Common** (Обычная) - Серый
- **Uncommon** (Необычная) - Зелёный
- **Rare** (Редкая) - Синий
- **Epic** (Эпическая) - Фиолетовый
- **Legendary** (Легендарная) - Оранжевый

## Лицензия

Proprietary - Все права защищены
