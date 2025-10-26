-- Дополнительные SQL функции для админ-панели

-- Функция для увеличения счетчика выпущенных карточек
CREATE OR REPLACE FUNCTION increment_minted_count(card_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE cards 
  SET minted_count = minted_count + 1 
  WHERE id = card_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для проверки лимита сбора осколков
CREATE OR REPLACE FUNCTION check_shard_collection_limit(
  p_user_id UUID,
  p_shard_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Проверяем, собирал ли пользователь этот осколок за последнюю минуту
  SELECT COUNT(*) INTO recent_count
  FROM user_shards
  WHERE user_id = p_user_id
    AND shard_id = p_shard_id
    AND obtained_at > NOW() - INTERVAL '1 minute';
    
  RETURN recent_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для проверки возможности сборки карточки
CREATE OR REPLACE FUNCTION can_assemble_card(
  p_user_id UUID,
  p_card_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  shard_count INTEGER;
  user_shard_count INTEGER;
BEGIN
  -- Получаем количество осколков для карточки
  SELECT COUNT(*) INTO shard_count
  FROM shards
  WHERE card_id = p_card_id;
  
  -- Должно быть ровно 3 осколка
  IF shard_count != 3 THEN
    RETURN FALSE;
  END IF;
  
  -- Проверяем, есть ли у пользователя все 3 неиспользованных осколка
  SELECT COUNT(DISTINCT us.shard_id) INTO user_shard_count
  FROM user_shards us
  JOIN shards s ON s.id = us.shard_id
  WHERE us.user_id = p_user_id
    AND s.card_id = p_card_id
    AND us.used = FALSE;
    
  RETURN user_shard_count = 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для получения статистики дашборда
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'today_checkins', (
      SELECT COUNT(*) FROM user_shards
      WHERE obtained_at >= CURRENT_DATE
    ),
    'today_cards_collected', (
      SELECT COUNT(*) FROM user_cards
      WHERE assembled_at >= CURRENT_DATE
    ),
    'active_listings', (
      SELECT COUNT(*) FROM listings
      WHERE status = 'active'
    ),
    'today_deals', (
      SELECT COUNT(*) FROM listings
      WHERE status = 'sold'
        AND sold_at >= CURRENT_DATE
    ),
    'total_users', (
      SELECT COUNT(*) FROM auth.users
    ),
    'total_collections', (
      SELECT COUNT(*) FROM collections WHERE active = TRUE
    ),
    'total_cards', (
      SELECT COUNT(*) FROM cards WHERE active = TRUE
    ),
    'active_spawn_points', (
      SELECT COUNT(*) FROM spawn_points
      WHERE active = TRUE AND qty_left > 0
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для автоматической деактивации истекших точек спавна
CREATE OR REPLACE FUNCTION deactivate_expired_spawn_points()
RETURNS void AS $$
BEGIN
  UPDATE spawn_points
  SET active = FALSE
  WHERE ends_at IS NOT NULL
    AND ends_at < NOW()
    AND active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для автоматической деактивации истекших дропов
CREATE OR REPLACE FUNCTION deactivate_expired_drops()
RETURNS void AS $$
BEGIN
  UPDATE drops
  SET active = FALSE
  WHERE ends_at < NOW()
    AND active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для логирования изменений в коллекциях
CREATE OR REPLACE FUNCTION log_collection_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (actor_id, action, entity, entity_id, after)
    VALUES (auth.uid(), 'create_collection', 'collections', NEW.id, row_to_json(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (actor_id, action, entity, entity_id, before, after)
    VALUES (auth.uid(), 'update_collection', 'collections', NEW.id, row_to_json(OLD), row_to_json(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (actor_id, action, entity, entity_id, before)
    VALUES (auth.uid(), 'delete_collection', 'collections', OLD.id, row_to_json(OLD));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создание триггеров
DROP TRIGGER IF EXISTS collections_audit_trigger ON collections;
CREATE TRIGGER collections_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON collections
  FOR EACH ROW EXECUTE FUNCTION log_collection_changes();

-- Триггер для проверки лимита тиража при создании user_cards
CREATE OR REPLACE FUNCTION check_card_supply_limit()
RETURNS TRIGGER AS $$
DECLARE
  card_supply_cap INTEGER;
  current_minted INTEGER;
BEGIN
  -- Получаем лимит и текущее количество
  SELECT supply_cap, minted_count INTO card_supply_cap, current_minted
  FROM cards
  WHERE id = NEW.card_id;
  
  -- Проверяем лимит
  IF current_minted >= card_supply_cap THEN
    RAISE EXCEPTION 'Card supply limit reached';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_card_supply_trigger ON user_cards;
CREATE TRIGGER check_card_supply_trigger
  BEFORE INSERT ON user_cards
  FOR EACH ROW EXECUTE FUNCTION check_card_supply_limit();

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_user_shards_obtained_at ON user_shards(obtained_at);
CREATE INDEX IF NOT EXISTS idx_user_cards_assembled_at ON user_cards(assembled_at);
CREATE INDEX IF NOT EXISTS idx_listings_sold_at ON listings(sold_at);
CREATE INDEX IF NOT EXISTS idx_spawn_points_ends_at ON spawn_points(ends_at) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_drops_ends_at ON drops(ends_at) WHERE active = TRUE;

-- View для быстрого доступа к статистике пользователей
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id as user_id,
  u.email,
  COUNT(DISTINCT us.id) as total_shards,
  COUNT(DISTINCT uc.id) as total_cards,
  COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'active') as active_listings,
  COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'sold') as sold_listings
FROM auth.users u
LEFT JOIN user_shards us ON us.user_id = u.id
LEFT JOIN user_cards uc ON uc.user_id = u.id
LEFT JOIN listings l ON l.user_id = u.id
GROUP BY u.id, u.email;

-- View для статистики коллекций
CREATE OR REPLACE VIEW collection_stats AS
SELECT 
  c.id,
  c.name,
  c.description,
  c.active,
  COUNT(DISTINCT ca.id) as total_cards,
  SUM(ca.minted_count) as total_minted,
  COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'active') as active_listings
FROM collections c
LEFT JOIN cards ca ON ca.collection_id = c.id
LEFT JOIN user_cards uc ON uc.card_id = ca.id
LEFT JOIN listings l ON l.card_id = ca.id
GROUP BY c.id, c.name, c.description, c.active;

-- Планировщик для автоматической деактивации (требует pg_cron)
-- Раскомментируйте если установлен pg_cron:
-- SELECT cron.schedule('deactivate-expired-content', '*/5 * * * *', $$
--   SELECT deactivate_expired_spawn_points();
--   SELECT deactivate_expired_drops();
-- $$);
