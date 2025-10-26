# 📝 Памятка по проекту QORA NFT Platform

## 🎯 Что реализовано

### ✅ База данных (Supabase PostgreSQL)
- Таблица `profiles` с **уникальными никнеймами** ⚡
- Автоматическое создание профиля через триггер
- Row Level Security (RLS)
- Функции валидации и проверки

### ✅ Аутентификация
- Регистрация с проверкой nickname в реальном времени
- Вход по email или nickname
- JWT токены и сессии
- Безопасное хранение паролей

### ✅ Админ-панель
- 11 экранов управления
- 20+ API endpoints
- CSV импорт точек
- Аудит логирование

---

## 🚀 Быстрый старт

```bash
# 1. Установить зависимости
pnpm install

# 2. Настроить Supabase
cp .env.example .env.local
# Добавьте ваши credentials

# 3. Выполнить SQL миграцию
# Supabase Dashboard → SQL Editor
# scripts/008_create_profiles_with_unique_nicknames.sql

# 4. Запустить проект
pnpm dev
```

---

## 📚 Документация (читайте по порядку)

### Для начинающих:
1. **QUICK_DATABASE_SETUP.md** - 5 минут
2. **SUPABASE_SETUP.md** - 10 минут (подробно)
3. **DATABASE_IMPLEMENTATION.md** - что реализовано

### Для понимания архитектуры:
4. **DATABASE_SCHEMA_VISUAL.md** - визуальная схема
5. **ARCHITECTURE.md** - детальная архитектура

### Для работы с админкой:
6. **ADMIN_PANEL.md** - руководство по админке
7. **API_EXAMPLES.md** - примеры API
8. **QUICKSTART.md** - быстрая настройка

---

## 🔑 Ключевые файлы

### SQL миграции:
```
scripts/
├── 008_create_profiles_with_unique_nicknames.sql  # Профили ⭐
├── 005_create_admin_tables.sql                     # Админка
├── 006_admin_functions.sql                         # Функции
├── 007_test_data.sql                               # Тестовые данные
└── test_queries.sql                                # Запросы для проверки
```

### Backend:
```
app/api/auth/
└── check-nickname/route.ts  # API проверки nickname

lib/
├── auth.ts                  # Auth сервис (Supabase)
├── admin-utils.ts           # Утилиты админки
└── supabase/                # Supabase клиенты
```

### Frontend:
```
app/
├── register/page.tsx        # Регистрация с проверкой nickname
├── login/page.tsx           # Вход
└── admin-panel/page.tsx     # Админ-панель
```

---

## 🔥 Главная фича: Уникальные никнеймы

### Как это работает:
1. Пользователь вводит nickname → проверка в реальном времени
2. API `/api/auth/check-nickname` → SQL функция
3. `check_nickname_available()` → проверка в БД (case-insensitive)
4. Результат → ✓ доступен или ✗ занят
5. При регистрации → триггер проверяет и создает профиль

### Гарантия:
- **Alikhan** может быть только один!
- `Alikhan`, `alikhan`, `ALIKHAN` - все считаются одинаковыми
- Валидация: 3-20 символов, только a-z, A-Z, 0-9, _

---

## 📊 Таблицы базы данных

### Основные:
- `profiles` - Профили с уникальными nickname
- `collections` - NFT коллекции
- `cards` - Карточки
- `shards` - Осколки (3 на карточку)
- `spawn_points` - Точки спавна
- `user_shards` - Осколки пользователей
- `user_cards` - Карточки пользователей
- `listings` - Маркетплейс

### Служебные:
- `admin_roles` - Роли админов
- `settings` - Настройки
- `audit_log` - Логи действий

---

## 🔧 Команды для работы

```bash
# Разработка
pnpm dev              # Запуск dev сервера
pnpm build            # Сборка для продакшена
pnpm start            # Запуск prod версии

# Проверка
pnpm lint             # Проверка кода
pnpm lint --fix       # Исправление ошибок

# Зависимости
pnpm install          # Установка
pnpm update           # Обновление
pnpm outdated         # Проверка устаревших
```

---

## 🐛 Частые проблемы

### "Supabase is not configured"
→ Проверьте `.env.local`, перезапустите `pnpm dev`

### "Table profiles does not exist"
→ Выполните миграцию 008 в Supabase SQL Editor

### "Nickname already taken" сразу
→ Проверьте что функция `check_nickname_available` создана

### Email не приходит
→ Отключите подтверждение email в Supabase (для dev)

---

## 🎓 SQL запросы для проверки

```sql
-- Все профили
SELECT * FROM profiles;

-- Проверка nickname
SELECT check_nickname_available('test');

-- Статистика
SELECT * FROM profile_stats;

-- Поиск дубликатов (должно быть 0)
SELECT LOWER(nickname), COUNT(*)
FROM profiles
GROUP BY LOWER(nickname)
HAVING COUNT(*) > 1;
```

---

## 🌐 API endpoints

```bash
# Проверка nickname
GET /api/auth/check-nickname?nickname=test

# Админка
GET /api/admin/dashboard
GET /api/admin/collections
POST /api/admin/collections
...
```

---

## 🔐 Безопасность

### RLS Политики:
- Профили: все читают, только владелец изменяет
- Осколки: только владелец видит свои
- Карточки: только владелец видит свои
- Листинги: все видят активные

### Валидация:
- Nickname: 3-20 символов, только a-z, 0-9, _
- Password: минимум 6 символов
- Email: валидный формат

---

## 📈 Производительность

- Индексы на nickname, email, user_id
- View для агрегированных данных
- Connection pooling (Supabase)
- Кеширование настроек

---

## 🚀 Следующие шаги

1. ✅ Настройте Supabase
2. ✅ Зарегистрируйте пользователей
3. ✅ Протестируйте уникальность nickname
4. 🔄 Настройте админ-панель (миграции 005, 006)
5. 🎨 Добавьте коллекции и карточки
6. 🗺️ Разместите точки на карте
7. 🎮 Протестируйте геолокацию

---

## 💡 Полезные ссылки

- [Supabase Dashboard](https://app.supabase.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## 📞 Поддержка

При проблемах:
1. Проверьте TROUBLESHOOTING секцию в документации
2. Используйте `scripts/test_queries.sql` для диагностики
3. Проверьте логи в Supabase Dashboard
4. Убедитесь что миграции выполнены

---

## 🎉 Готово!

Теперь у вас есть:
- ✅ Реальная база данных
- ✅ Аутентификация
- ✅ Уникальные никнеймы
- ✅ Админ-панель
- ✅ API
- ✅ Безопасность

**Приятной разработки! 🚀**

---

**Последнее обновление:** 25 октября 2025  
**Версия:** 1.0  
**Статус:** Production Ready ✅
