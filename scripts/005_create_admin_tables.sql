-- Создание таблиц для админ-панели

-- Роли администраторов
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Коллекции (расширенная версия)
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_url TEXT,
  chain VARCHAR(50) DEFAULT 'ethereum',
  royalty_pct DECIMAL(5,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Карточки
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  supply_cap INTEGER NOT NULL DEFAULT 1000,
  minted_count INTEGER DEFAULT 0,
  image_url TEXT,
  rarity VARCHAR(50) DEFAULT 'common',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Осколки (shards) - 3 на карточку
CREATE TABLE IF NOT EXISTS shards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  shard_index INTEGER NOT NULL CHECK (shard_index IN (1, 2, 3)),
  name VARCHAR(255),
  image_url TEXT NOT NULL,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(card_id, shard_index)
);

-- Точки спавна
CREATE TABLE IF NOT EXISTS spawn_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shard_id UUID REFERENCES shards(id) ON DELETE CASCADE,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  qty_total INTEGER NOT NULL DEFAULT 1,
  qty_left INTEGER NOT NULL DEFAULT 1,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  radius_m INTEGER DEFAULT 5,
  hold_seconds INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Дропы (расписания)
CREATE TABLE IF NOT EXISTS drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Точки в дропах (связь many-to-many)
CREATE TABLE IF NOT EXISTS drop_spawn_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id UUID REFERENCES drops(id) ON DELETE CASCADE,
  spawn_point_id UUID REFERENCES spawn_points(id) ON DELETE CASCADE,
  UNIQUE(drop_id, spawn_point_id)
);

-- Пользовательские осколки
CREATE TABLE IF NOT EXISTS user_shards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shard_id UUID REFERENCES shards(id) ON DELETE CASCADE,
  obtained_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  spawn_point_id UUID REFERENCES spawn_points(id),
  used BOOLEAN DEFAULT false
);

-- Пользовательские карточки (собранные из 3 осколков)
CREATE TABLE IF NOT EXISTS user_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  token_id VARCHAR(255),
  minted_tx VARCHAR(255),
  minted_at TIMESTAMP WITH TIME ZONE,
  assembled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Листинги маркетплейса
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  user_card_id UUID REFERENCES user_cards(id) ON DELETE CASCADE,
  price_wei BIGINT NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled', 'banned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sold_at TIMESTAMP WITH TIME ZONE,
  banned_at TIMESTAMP WITH TIME ZONE,
  banned_by UUID REFERENCES auth.users(id)
);

-- Настройки системы
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Вставка дефолтных настроек
INSERT INTO settings (key, value, description) VALUES
  ('radius_m', '5', 'Радиус чек-ина в метрах'),
  ('hold_seconds', '3', 'Время удержания для чек-ина в секундах'),
  ('platform_fee_pct', '5', 'Комиссия платформы в процентах'),
  ('min_price_floor', '0', 'Минимальная цена на маркетплейсе')
ON CONFLICT (key) DO NOTHING;

-- Web3 конфигурация
CREATE TABLE IF NOT EXISTS web3_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chain VARCHAR(50) NOT NULL DEFAULT 'ethereum',
  rpc_url TEXT NOT NULL,
  contract_address VARCHAR(255) NOT NULL,
  abi TEXT,
  mint_function VARCHAR(100) DEFAULT 'mintTo',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Логи аудита
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  entity_id UUID,
  before JSONB,
  after JSONB,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_spawn_points_active ON spawn_points(active, lat, lng);
CREATE INDEX IF NOT EXISTS idx_spawn_points_shard ON spawn_points(shard_id);
CREATE INDEX IF NOT EXISTS idx_user_shards_user ON user_shards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cards_user ON user_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_id, ts);

-- Row Level Security (RLS)
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE shards ENABLE ROW LEVEL SECURITY;
ALTER TABLE spawn_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_shards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Политики RLS для публичного доступа к коллекциям
CREATE POLICY "Коллекции доступны всем" ON collections FOR SELECT USING (active = true);
CREATE POLICY "Карточки доступны всем" ON cards FOR SELECT USING (active = true);
CREATE POLICY "Осколки доступны всем" ON shards FOR SELECT USING (true);
CREATE POLICY "Активные точки доступны всем" ON spawn_points FOR SELECT USING (active = true AND qty_left > 0);

-- Пользователи видят свои осколки и карточки
CREATE POLICY "Пользователи видят свои осколки" ON user_shards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Пользователи видят свои карточки" ON user_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Активные листинги доступны всем" ON listings FOR SELECT USING (status = 'active');

-- Функция для проверки админских прав
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для проверки прав Owner
CREATE OR REPLACE FUNCTION is_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
