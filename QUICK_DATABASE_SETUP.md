# 🎯 Шпаргалка по настройке базы данных

## ⚡ Суперкраткая инструкция (5 минут)

### 1. Создайте Supabase проект
```
https://app.supabase.com/ → New Project
```

### 2. Скопируйте credentials
```
Settings → API → Project URL и anon public key
```

### 3. Создайте .env.local
```bash
cp .env.example .env.local
# Вставьте ваши значения
```

### 4. Выполните SQL миграцию
```
Supabase Dashboard → SQL Editor → New Query
Скопируйте scripts/008_create_profiles_with_unique_nicknames.sql
→ Run
```

### 5. Отключите подтверждение email (для разработки)
```
Authentication → Settings → Email Auth
→ Отключите "Enable email confirmations"
```

### 6. Запустите проект
```bash
pnpm install
pnpm dev
```

### 7. Тест
```
http://localhost:3000/register
Зарегистрируйтесь с nickname "Alikhan"
```

---

## 🔥 Ключевые фичи

### ✅ Уникальные никнеймы
- `Alikhan` может быть только один!
- Case-insensitive проверка
- Проверка в реальном времени при вводе
- Автоматическая валидация формата

### ✅ Автоматизация
- Профиль создается автоматически через триггер
- Не нужно вручную создавать записи
- Транзакционная безопасность

### ✅ Безопасность
- Row Level Security (RLS)
- JWT токены
- HTTPS соединения
- Хеширование паролей

---

## 📊 Проверка работы

### В Supabase Dashboard:

**1. Проверьте таблицу profiles:**
```
Table Editor → profiles → должна быть создана
```

**2. Проверьте функции:**
```
Database → Functions → check_nickname_available должна быть
```

**3. Проверьте триггеры:**
```
Database → Triggers → on_auth_user_created должен быть на auth.users
```

**4. Проверьте RLS политики:**
```
Authentication → Policies → profiles должно быть 3 политики
```

### В вашем проекте:

**1. Проверьте регистрацию:**
```bash
# Откройте http://localhost:3000/register
# Введите nickname "TestUser123"
# Должна показаться галочка "✓ Nickname доступен"
```

**2. Попробуйте дубликат:**
```bash
# Попробуйте зарегистрироваться с тем же nickname
# Должна быть ошибка "Nickname уже занят"
```

**3. Проверьте вход:**
```bash
# http://localhost:3000/login
# Войдите с nickname или email
```

---

## 🐛 Частые проблемы

### "Supabase is not configured"
```bash
# Проверьте .env.local
cat .env.local
# Перезапустите сервер
pnpm dev
```

### "Table profiles does not exist"
```bash
# Выполните миграцию 008 в SQL Editor
# Supabase Dashboard → SQL Editor
```

### "Nickname already taken" сразу
```bash
# Проверьте что функция создана:
# SELECT check_nickname_available('test');
```

### Email не приходит
```bash
# Для разработки отключите подтверждение:
# Authentication → Settings → Email Auth
# → Disable "Enable email confirmations"
```

---

## 🚀 Следующие шаги

После настройки базы данных:

1. ✅ Зарегистрируйте пользователей
2. ✅ Настройте админ-панель (миграции 005, 006)
3. ✅ Добавьте тестовые данные (миграция 007)
4. 🎨 Создайте коллекции и карточки
5. 🗺️ Добавьте точки спавна на карте
6. 📊 Настройте дропы
7. 🎮 Протестируйте чекины

---

## 📚 Полная документация

- **SUPABASE_SETUP.md** - Подробная инструкция с картинками
- **ADMIN_PANEL.md** - Документация админ-панели
- **API_EXAMPLES.md** - Примеры API запросов
- **ARCHITECTURE.md** - Архитектура системы

---

## 💡 Полезные команды

### SQL запросы для проверки

```sql
-- Все профили
SELECT * FROM profiles;

-- Проверка nickname
SELECT check_nickname_available('test');

-- Статистика пользователя
SELECT * FROM profile_stats WHERE id = 'user-uuid';

-- Все функции
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public';

-- Все триггеры
SELECT * FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- RLS политики
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### API запросы для проверки

```bash
# Проверка nickname
curl "http://localhost:3000/api/auth/check-nickname?nickname=test"

# Ожидается:
# {"available":true,"message":"Nickname доступен"}
```

---

**Готово! База данных настроена и работает! 🎉**
