# 🎯 Чеклист для запуска Admin Panel

## ✅ Пререквизиты

- [ ] Node.js 18+ установлен
- [ ] pnpm установлен (`npm i -g pnpm`)
- [ ] Проект Supabase создан
- [ ] Переменные окружения настроены

## 🗄️ База данных (5 минут)

### 1. Выполните миграции
В Supabase SQL Editor выполните по порядку:

- [ ] `scripts/005_create_admin_tables.sql`
- [ ] `scripts/006_admin_functions.sql`

### 2. Назначьте себе роль

```sql
-- Получите свой UUID
SELECT id, email FROM auth.users WHERE email = 'ваш@email.com';

-- Назначьте роль Owner
INSERT INTO admin_roles (user_id, role) 
VALUES ('ваш-uuid', 'owner');
```

### 3. Проверьте установку

```sql
-- Должно вернуть 4 записи
SELECT * FROM settings;

-- Должна быть ваша роль
SELECT * FROM admin_roles;
```

## 🚀 Запуск проекта (2 минуты)

```bash
# Установите зависимости
pnpm install

# Запустите dev сервер
pnpm dev
```

Откройте: http://localhost:3000/admin-panel

## 🧪 Тест функционала (10 минут)

### Создайте тестовые данные

- [ ] Создайте коллекцию "Test Collection"
- [ ] Создайте карточку "Test Card" (автоматически создастся 3 осколка)
- [ ] Добавьте URL изображений для осколков
- [ ] Добавьте 3 точки спавна (разные координаты)
- [ ] Проверьте дашборд (должна обновиться статистика)

### Протестируйте API

```bash
# Получить коллекции
curl http://localhost:3000/api/admin/collections

# Получить карточки
curl http://localhost:3000/api/admin/cards

# Получить точки спавна
curl http://localhost:3000/api/admin/spawn-points
```

## 📊 Проверка UI (5 минут)

Откройте каждую вкладку и убедитесь, что всё работает:

- [ ] Dashboard - видна статистика
- [ ] Collections - есть форма создания
- [ ] Cards - есть форма создания
- [ ] Shards - можно загрузить изображения
- [ ] Spawn Points - можно добавить точку
- [ ] Drops - можно создать дроп
- [ ] Marketplace - видны настройки
- [ ] Users - работает поиск
- [ ] Web3 - можно ввести конфиг
- [ ] Settings - можно изменить параметры
- [ ] Audit Log - видны логи действий

## 🔒 Проверка безопасности

### Тест прав доступа

1. Откройте в инкогнито: http://localhost:3000/admin-panel
   - [ ] Должен быть редирект на логин

2. Залогиньтесь НЕ админом
   - [ ] Должно быть "Unauthorized"

3. Попробуйте вызвать API без авторизации:
   ```bash
   curl http://localhost:3000/api/admin/collections
   # Должно вернуть {"error": "Unauthorized"}
   ```

### Тест RLS

```sql
-- От имени обычного пользователя (не админа)
-- Не должно работать:
INSERT INTO collections (name) VALUES ('Hack');
UPDATE spawn_points SET active = false WHERE id = 'any';
DELETE FROM cards WHERE id = 'any';
```

## 🎨 Кастомизация (опционально)

### Изменить дефолтные настройки

```sql
UPDATE settings SET value = '10' WHERE key = 'radius_m';
UPDATE settings SET value = '5' WHERE key = 'hold_seconds';
UPDATE settings SET value = '7.5' WHERE key = 'platform_fee_pct';
```

### Добавить второго админа (Manager)

```sql
INSERT INTO admin_roles (user_id, role) 
VALUES ('другой-uuid', 'manager');
```

## 📝 Логи и дебаг

### Просмотр логов Supabase

1. Откройте Supabase Dashboard
2. Logs → Database Logs
3. Фильтр по `audit_log`

### Просмотр логов приложения

```bash
# В терминале где запущен pnpm dev
# Все API запросы будут логироваться
```

### Проверка ошибок

```sql
-- Последние ошибки в логах
SELECT * FROM audit_log 
WHERE action LIKE '%error%' 
ORDER BY ts DESC 
LIMIT 10;
```

## 🐛 Troubleshooting

### Проблема: "Unauthorized"
**Решение:**
```sql
-- Проверьте роль
SELECT * FROM admin_roles WHERE user_id = 'ваш-uuid';
-- Если нет, добавьте
INSERT INTO admin_roles (user_id, role) VALUES ('ваш-uuid', 'owner');
```

### Проблема: Таблицы не созданы
**Решение:**
- Проверьте что выполнили обе миграции (005 и 006)
- Проверьте права на создание таблиц в Supabase

### Проблема: API возвращает 404
**Решение:**
- Убедитесь что dev сервер запущен
- Проверьте путь: `/api/admin/...`
- Проверьте логи в терминале

### Проблема: Настройки не сохраняются
**Решение:**
```sql
-- Проверьте таблицу settings
SELECT * FROM settings;
-- Если пуста, выполните заново scripts/005...sql
```

## 📊 Производительность

### Проверьте индексы

```sql
-- Должны быть созданы индексы
SELECT * FROM pg_indexes WHERE tablename IN (
  'spawn_points', 'user_shards', 'listings', 'audit_log'
);
```

### Оптимизация (если медленно)

```sql
-- Анализ таблиц
ANALYZE collections;
ANALYZE cards;
ANALYZE spawn_points;
ANALYZE listings;
```

## ✅ Финальный чеклист

После всех проверок должно быть:

- [ ] ✅ БД миграции выполнены
- [ ] ✅ Роль Owner назначена
- [ ] ✅ Проект запускается без ошибок
- [ ] ✅ Все 11 вкладок открываются
- [ ] ✅ API endpoints работают
- [ ] ✅ Можно создать коллекцию
- [ ] ✅ Можно создать карточку
- [ ] ✅ Можно добавить точку спавна
- [ ] ✅ Логи пишутся в audit_log
- [ ] ✅ Неавторизованные получают 401

## 🎉 Готово!

Если все чекбоксы отмечены - админ-панель полностью готова к работе!

**Следующие шаги:**
1. Создайте реальные коллекции
2. Загрузите реальные изображения
3. Разместите точки на карте
4. Настройте Web3 контракт
5. Пригласите других админов

**Время на полную проверку: ~25 минут**

---

**Need help?** Читайте [ADMIN_PANEL.md](ADMIN_PANEL.md) для подробностей
