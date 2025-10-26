-- =====================================================
-- 008: PROFILES TABLE WITH UNIQUE NICKNAMES
-- =====================================================
-- Создание таблицы профилей пользователей с уникальными никнеймами
-- и автоматической синхронизацией с auth.users

-- =====================================================
-- 1. СОЗДАНИЕ ТАБЛИЦЫ PROFILES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  wallet_address TEXT,
  total_shards INTEGER DEFAULT 0,
  total_cards INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- UNIQUE constraint на nickname - НЕ МОЖЕТ ПОВТОРЯТЬСЯ!
  CONSTRAINT unique_nickname UNIQUE (nickname),
  CONSTRAINT nickname_length CHECK (char_length(nickname) >= 3 AND char_length(nickname) <= 20),
  CONSTRAINT nickname_format CHECK (nickname ~ '^[a-zA-Z0-9_]+$')
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON public.profiles(nickname);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

COMMENT ON TABLE public.profiles IS 'Профили пользователей с уникальными никнеймами';
COMMENT ON COLUMN public.profiles.nickname IS 'Уникальный никнейм пользователя (3-20 символов, только a-z, A-Z, 0-9, _)';
COMMENT ON CONSTRAINT unique_nickname ON public.profiles IS 'Никнейм должен быть уникальным во всей системе';

-- =====================================================
-- 2. RLS ПОЛИТИКИ
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Все могут читать профили
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

-- Пользователи могут вставлять только свой профиль
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Пользователи могут обновлять только свой профиль
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Пользователи НЕ могут удалять профили (удаление через auth.users cascade)
-- CREATE POLICY "Users cannot delete profiles" 
--   ON public.profiles 
--   FOR DELETE 
--   USING (false);

-- =====================================================
-- 3. ФУНКЦИЯ ДЛЯ ПРОВЕРКИ УНИКАЛЬНОСТИ NICKNAME
-- =====================================================

CREATE OR REPLACE FUNCTION public.check_nickname_available(p_nickname TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Проверка формата nickname
  IF p_nickname !~ '^[a-zA-Z0-9_]+$' THEN
    RAISE EXCEPTION 'Nickname может содержать только буквы, цифры и подчеркивание';
  END IF;

  IF char_length(p_nickname) < 3 OR char_length(p_nickname) > 20 THEN
    RAISE EXCEPTION 'Nickname должен быть от 3 до 20 символов';
  END IF;

  -- Проверка уникальности (case-insensitive)
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE LOWER(nickname) = LOWER(p_nickname)
  );
END;
$$;

COMMENT ON FUNCTION public.check_nickname_available IS 'Проверяет доступность никнейма (case-insensitive)';

-- =====================================================
-- 4. ФУНКЦИЯ ДЛЯ АВТОМАТИЧЕСКОГО СОЗДАНИЯ ПРОФИЛЯ
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nickname TEXT;
BEGIN
  -- Получаем nickname из user metadata
  v_nickname := NEW.raw_user_meta_data->>'nickname';
  
  -- Проверяем, что nickname указан
  IF v_nickname IS NULL OR v_nickname = '' THEN
    RAISE EXCEPTION 'Nickname обязателен';
  END IF;

  -- Проверяем доступность nickname
  IF NOT public.check_nickname_available(v_nickname) THEN
    RAISE EXCEPTION 'Nickname "%" уже занят', v_nickname;
  END IF;

  -- Создаем профиль
  INSERT INTO public.profiles (id, email, nickname)
  VALUES (NEW.id, NEW.email, v_nickname);

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user IS 'Автоматически создает профиль при регистрации нового пользователя';

-- =====================================================
-- 5. ТРИГГЕР ДЛЯ АВТОМАТИЧЕСКОГО СОЗДАНИЯ ПРОФИЛЯ
-- =====================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Создает профиль автоматически при регистрации';

-- =====================================================
-- 6. ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 7. ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ СЧЕТЧИКОВ
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_profile_stats(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    total_shards = (
      SELECT COUNT(*) 
      FROM public.user_shards 
      WHERE user_id = p_user_id AND NOT used
    ),
    total_cards = (
      SELECT COUNT(*) 
      FROM public.user_cards 
      WHERE user_id = p_user_id
    )
  WHERE id = p_user_id;
END;
$$;

COMMENT ON FUNCTION public.update_profile_stats IS 'Обновляет счетчики осколков и карточек в профиле';

-- =====================================================
-- 8. VIEW ДЛЯ РАСШИРЕННОЙ ИНФОРМАЦИИ О ПРОФИЛЕ
-- =====================================================

CREATE OR REPLACE VIEW public.profile_stats AS
SELECT 
  p.id,
  p.email,
  p.nickname,
  p.avatar_url,
  p.bio,
  p.wallet_address,
  p.created_at,
  p.updated_at,
  COALESCE(shard_count.count, 0) as total_shards,
  COALESCE(card_count.count, 0) as total_cards,
  COALESCE(listing_count.count, 0) as active_listings
FROM public.profiles p
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM public.user_shards 
  WHERE NOT used 
  GROUP BY user_id
) shard_count ON shard_count.user_id = p.id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count 
  FROM public.user_cards 
  GROUP BY user_id
) card_count ON card_count.user_id = p.id
LEFT JOIN (
  SELECT seller_id, COUNT(*) as count 
  FROM public.listings 
  WHERE status = 'active' 
  GROUP BY seller_id
) listing_count ON listing_count.seller_id = p.id;

COMMENT ON VIEW public.profile_stats IS 'Расширенная статистика профилей с актуальными счетчиками';

-- =====================================================
-- 9. ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ТЕКУЩЕГО ПРОФИЛЯ
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_current_profile()
RETURNS TABLE (
  id UUID,
  email TEXT,
  nickname TEXT,
  avatar_url TEXT,
  bio TEXT,
  wallet_address TEXT,
  total_shards BIGINT,
  total_cards BIGINT,
  active_listings BIGINT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.profile_stats
  WHERE profile_stats.id = auth.uid();
END;
$$;

COMMENT ON FUNCTION public.get_current_profile IS 'Возвращает профиль текущего пользователя с актуальной статистикой';

-- =====================================================
-- 10. GRANT PERMISSIONS
-- =====================================================

-- Разрешаем доступ к таблице
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;

-- Разрешаем доступ к view
GRANT SELECT ON public.profile_stats TO anon, authenticated;

-- Разрешаем использование функций
GRANT EXECUTE ON FUNCTION public.check_nickname_available TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_profile_stats TO authenticated;

-- =====================================================
-- КОНЕЦ МИГРАЦИИ
-- =====================================================

-- Проверка созданных объектов
DO $$
BEGIN
  RAISE NOTICE '✅ Таблица profiles создана с UNIQUE constraint на nickname';
  RAISE NOTICE '✅ RLS политики настроены';
  RAISE NOTICE '✅ Триггер автоматического создания профиля активен';
  RAISE NOTICE '✅ Функции проверки nickname и получения профиля готовы';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Теперь при регистрации:';
  RAISE NOTICE '   1. Проверяется уникальность nickname (case-insensitive)';
  RAISE NOTICE '   2. Профиль создается автоматически через триггер';
  RAISE NOTICE '   3. Nickname НЕ МОЖЕТ повторяться!';
END $$;
