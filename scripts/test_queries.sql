-- =====================================================
-- SQL ЗАПРОСЫ ДЛЯ ТЕСТИРОВАНИЯ
-- =====================================================
-- Используйте эти запросы в Supabase SQL Editor для
-- проверки работы базы данных и тестирования функций

-- =====================================================
-- 1. ПРОВЕРКА ТАБЛИЦ И СТРУКТУРЫ
-- =====================================================

-- Список всех таблиц
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Структура таблицы profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Все constraints на таблице profiles
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'profiles';

-- =====================================================
-- 2. ПРОСМОТР ДАННЫХ
-- =====================================================

-- Все профили с полной информацией
SELECT 
  id,
  email,
  nickname,
  total_shards,
  total_cards,
  created_at,
  updated_at
FROM profiles
ORDER BY created_at DESC;

-- Статистика всех пользователей (через view)
SELECT * FROM profile_stats
ORDER BY total_cards DESC, total_shards DESC;

-- Последние 10 зарегистрированных пользователей
SELECT nickname, email, created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- 3. ПРОВЕРКА ФУНКЦИЙ
-- =====================================================

-- Список всех функций в public schema
SELECT 
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Проверка доступности nickname (должно быть TRUE для нового nickname)
SELECT check_nickname_available('NewUser123') as is_available;

-- Проверка занятого nickname (должно быть FALSE)
SELECT check_nickname_available('Alikhan') as is_available;

-- Проверка невалидного nickname (должна быть ошибка)
-- SELECT check_nickname_available('ab') as is_available; -- Слишком короткий
-- SELECT check_nickname_available('user@123') as is_available; -- Недопустимые символы

-- =====================================================
-- 4. ПРОВЕРКА ТРИГГЕРОВ
-- =====================================================

-- Все триггеры в public schema
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- Триггер на auth.users (должен быть on_auth_user_created)
SELECT 
  trigger_name,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';

-- =====================================================
-- 5. ПРОВЕРКА RLS ПОЛИТИК
-- =====================================================

-- Все политики для таблицы profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Проверка что RLS включен
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- =====================================================
-- 6. ТЕСТИРОВАНИЕ СОЗДАНИЯ ПОЛЬЗОВАТЕЛЯ
-- =====================================================

-- ВНИМАНИЕ: Эти запросы только для тестирования!
-- В продакшене пользователи создаются через Supabase Auth

-- Проверка существования пользователя
SELECT 
  u.id,
  u.email,
  p.nickname,
  p.created_at
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'test@example.com';

-- =====================================================
-- 7. СТАТИСТИКА И АНАЛИТИКА
-- =====================================================

-- Общая статистика
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_this_week,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as new_today
FROM profiles;

-- Топ пользователей по количеству осколков
SELECT 
  nickname,
  email,
  total_shards,
  total_cards
FROM profiles
WHERE total_shards > 0
ORDER BY total_shards DESC
LIMIT 10;

-- Распределение пользователей по дате регистрации
SELECT 
  DATE(created_at) as registration_date,
  COUNT(*) as users_count
FROM profiles
GROUP BY DATE(created_at)
ORDER BY registration_date DESC
LIMIT 30;

-- =====================================================
-- 8. ПРОВЕРКА УНИКАЛЬНОСТИ NICKNAME
-- =====================================================

-- Поиск дубликатов nickname (должно быть 0 строк!)
SELECT 
  LOWER(nickname) as lowercase_nickname,
  COUNT(*) as count
FROM profiles
GROUP BY LOWER(nickname)
HAVING COUNT(*) > 1;

-- Все nickname (case-insensitive)
SELECT DISTINCT LOWER(nickname) as nickname
FROM profiles
ORDER BY nickname;

-- =====================================================
-- 9. ТЕСТИРОВАНИЕ ОБНОВЛЕНИЯ ПРОФИЛЯ
-- =====================================================

-- Обновление био пользователя (замените UUID на реальный)
-- UPDATE profiles
-- SET bio = 'Test bio update'
-- WHERE id = 'your-user-uuid';

-- Проверка что updated_at обновился автоматически
SELECT 
  nickname,
  bio,
  created_at,
  updated_at,
  (updated_at > created_at) as was_updated
FROM profiles
WHERE id = 'your-user-uuid';

-- =====================================================
-- 10. ОЧИСТКА ТЕСТОВЫХ ДАННЫХ
-- =====================================================

-- ВНИМАНИЕ: Используйте осторожно!

-- Удалить конкретного пользователя (через auth.users - каскадно удалит profile)
-- DELETE FROM auth.users WHERE email = 'test@example.com';

-- Удалить ВСЕ профили (ОПАСНО!)
-- TRUNCATE profiles CASCADE;

-- =====================================================
-- 11. ПОЛЕЗНЫЕ ЗАПРОСЫ ДЛЯ ОТЛАДКИ
-- =====================================================

-- Проверка прав доступа к таблице
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'profiles'
  AND table_schema = 'public';

-- Проверка индексов
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
  AND schemaname = 'public';

-- Размер таблицы profiles
SELECT 
  pg_size_pretty(pg_total_relation_size('public.profiles')) as table_size;

-- =====================================================
-- 12. ПРОВЕРКА ИНТЕГРАЦИИ С АДМИН-ПАНЕЛЬЮ
-- =====================================================

-- Проверка существования админских таблиц (если миграции 005-006 выполнены)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'admin_roles',
    'collections',
    'cards',
    'shards',
    'spawn_points',
    'drops',
    'user_shards',
    'user_cards',
    'listings',
    'settings',
    'audit_log'
  )
ORDER BY table_name;

-- Проверка админских ролей
SELECT 
  u.email,
  ar.role
FROM admin_roles ar
JOIN auth.users u ON u.id = ar.user_id
ORDER BY ar.created_at DESC;

-- =====================================================
-- КОНЕЦ ФАЙЛА
-- =====================================================

-- Используйте эти запросы для проверки работы БД
-- и диагностики проблем. Копируйте нужные запросы
-- в Supabase SQL Editor и выполняйте.

-- Для получения помощи см.:
-- - SUPABASE_SETUP.md
-- - QUICK_DATABASE_SETUP.md
-- - ADMIN_PANEL.md
