# 🚀 Настройка Supabase для QORA NFT Platform

## Быстрый старт

Этот гайд поможет вам настроить **реальную базу данных Supabase** с регистрацией, входом и уникальными никнеймами за **10 минут**.

---

## 📋 Требования

- ✅ Аккаунт на [Supabase](https://supabase.com) (бесплатно)
- ✅ Node.js 18+ установлен
- ✅ pnpm установлен (`npm install -g pnpm`)

---

## 1️⃣ Создание проекта в Supabase

### Шаг 1: Регистрация

1. Откройте https://app.supabase.com/
2. Нажмите **"New Project"**
3. Заполните форму:
   - **Name:** `qora-nft-platform` (или любое имя)
   - **Database Password:** Придумайте надежный пароль (сохраните его!)
   - **Region:** Выберите ближайший к вам регион (например, `Frankfurt (eu-central-1)`)
   - **Pricing Plan:** Free (бесплатно)
4. Нажмите **"Create new project"**
5. ⏳ Подождите 2-3 минуты пока проект создается

---

## 2️⃣ Получение API ключей

### Шаг 2: Копирование credentials

После создания проекта:

1. Перейдите в **Settings** (⚙️ в левом меню)
2. Выберите **API**
3. Скопируйте два значения:

```
Project URL: https://abcdefghijklmnop.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 3️⃣ Настройка локального проекта

### Шаг 3: Создание .env.local файла

В корне проекта выполните:

```bash
# Скопируйте шаблон
cp .env.example .env.local

# Откройте файл в редакторе
nano .env.local
# или
code .env.local
```

Вставьте ваши значения:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

💾 **Сохраните файл!**

---

## 4️⃣ Выполнение SQL миграций

### Шаг 4: Создание таблиц в базе данных

1. В Supabase Dashboard откройте **SQL Editor** (📝 в левом меню)
2. Нажмите **"New Query"**
3. Выполните миграции **по порядку**:

#### 4.1. Миграция 008: Profiles с уникальными никнеймами

Откройте файл `scripts/008_create_profiles_with_unique_nicknames.sql`

Скопируйте **ВСЁ** содержимое файла и вставьте в SQL Editor.

Нажмите **"Run"** ▶️

✅ **Ожидаемый результат:**
```
✅ Таблица profiles создана с UNIQUE constraint на nickname
✅ RLS политики настроены
✅ Триггер автоматического создания профиля активен
✅ Функции проверки nickname и получения профиля готовы
```

#### 4.2. Миграция 005: Admin таблицы (опционально)

Если планируете использовать админ-панель:

Откройте файл `scripts/005_create_admin_tables.sql`

Скопируйте содержимое и выполните в SQL Editor.

#### 4.3. Миграция 006: Admin функции (опционально)

Откройте файл `scripts/006_admin_functions.sql`

Скопируйте и выполните.

#### 4.4. Миграция 007: Тестовые данные (опционально)

Откройте файл `scripts/007_test_data.sql`

Скопируйте и выполните для добавления примеров коллекций и карточек.

---

## 5️⃣ Настройка Email Authentication

### Шаг 5: Конфигурация Email провайдера

По умолчанию Supabase использует встроенный email сервис (ограничен 3 письма/час в dev режиме).

#### Для тестирования (по умолчанию):

1. В Supabase Dashboard: **Authentication** > **Providers**
2. Убедитесь что **Email** включен ✅
3. **Email Confirm:** можно отключить для разработки:
   - **Settings** > **Authentication** > **Email Auth**
   - Отключите **"Enable email confirmations"**

#### Для продакшена (настройка SMTP):

1. **Authentication** > **Settings** > **SMTP Settings**
2. Подключите свой SMTP (Gmail, SendGrid, Mailgun, etc.)

---

## 6️⃣ Запуск проекта

### Шаг 6: Установка зависимостей и запуск

```bash
# Установите зависимости
pnpm install

# Запустите dev сервер
pnpm dev
```

Откройте http://localhost:3000

---

## 7️⃣ Тестирование регистрации

### Шаг 7: Создание первого пользователя

1. Откройте http://localhost:3000/register
2. Заполните форму:
   - **Nickname:** `Alikhan` (проверка уникальности в реальном времени!)
   - **Email:** `your@email.com`
   - **Password:** `123456` (минимум 6 символов)
3. Нажмите **"Зарегистрироваться"**

✅ **Успех!** Вы будете перенаправлены на `/auth/check-email`

---

## 8️⃣ Проверка в базе данных

### Шаг 8: Просмотр созданных пользователей

В Supabase Dashboard:

1. Откройте **Table Editor** (📊 в левом меню)
2. Выберите таблицу `profiles`
3. Вы увидите вашего пользователя с никнеймом!

Также проверьте:
- **Authentication** > **Users** - пользователь в auth.users
- Никнейм уникален благодаря constraint

---

## 🔥 Что теперь работает?

### ✅ Регистрация
- Проверка уникальности nickname **в реальном времени**
- Nickname НЕ МОЖЕТ повторяться (case-insensitive)
- Автоматическое создание профиля через триггер
- Валидация формата nickname (3-20 символов, только a-z, 0-9, _)

### ✅ Вход
- Вход по email + password
- Вход по nickname + password
- Реальная аутентификация через Supabase Auth
- Сессии и JWT токены

### ✅ Профили
- Таблица `profiles` связана с `auth.users`
- Дополнительные поля: avatar, bio, wallet_address, stats
- RLS политики для безопасности
- View `profile_stats` с агрегированными данными

---

## 🐛 Troubleshooting

### Проблема: "Supabase is not configured"

**Решение:** Проверьте `.env.local`:
```bash
cat .env.local
```
Убедитесь что значения правильные (не `your_...`).

Перезапустите сервер:
```bash
pnpm dev
```

---

### Проблема: "Nickname уже занят" сразу после ввода

**Решение:** Проверьте что миграция 008 выполнена:

```sql
-- В SQL Editor выполните:
SELECT * FROM profiles;
```

Если таблица не существует - выполните миграцию заново.

---

### Проблема: Email не приходит

**Решение для разработки:**

Отключите подтверждение email:
1. **Authentication** > **Settings** > **Email Auth**
2. Отключите **"Enable email confirmations"**
3. Пользователь будет создан сразу

**Решение для продакшена:**

Настройте SMTP в **Authentication** > **Settings** > **SMTP Settings**

---

### Проблема: RLS блокирует запросы

**Решение:** Проверьте политики:

```sql
-- В SQL Editor:
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

Должны быть политики для SELECT (все), INSERT/UPDATE (только свой профиль).

Если нет - выполните миграцию 008 заново.

---

## 📚 Полезные ресурсы

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

---

## 🚀 Следующие шаги

После настройки Supabase:

1. ✅ **Протестируйте регистрацию** - создайте несколько пользователей
2. ✅ **Попробуйте создать дубликат nickname** - должна быть ошибка
3. ✅ **Протестируйте вход** - войдите с nickname или email
4. 🔄 **Настройте админ-панель** - выполните миграции 005, 006, 007
5. 🎨 **Добавьте данные** - создайте коллекции, карточки, осколки
6. 🗺️ **Интегрируйте карту** - добавьте Mapbox для точек спавна

---

## 🎉 Готово!

Теперь у вас **реальная база данных** с:
- ✅ Регистрацией и входом
- ✅ Уникальными никнеймами (Alikhan может быть только один!)
- ✅ Безопасностью (RLS)
- ✅ Автоматическим созданием профилей
- ✅ Проверкой nickname в реальном времени

**Приятной разработки! 🚀**
