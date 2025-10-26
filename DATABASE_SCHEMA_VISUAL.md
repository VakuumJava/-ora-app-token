# 🗺️ Визуальная схема базы данных

```
┌─────────────────────────────────────────────────────────────────────┐
│                         QORA NFT PLATFORM                            │
│                      Database Architecture                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       AUTHENTICATION LAYER                           │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────┐
    │         auth.users (Supabase Auth)           │
    │──────────────────────────────────────────────│
    │ id              UUID (PK)                    │
    │ email           TEXT                         │
    │ encrypted_pw    TEXT (hashed)                │
    │ created_at      TIMESTAMPTZ                  │
    │ last_sign_in    TIMESTAMPTZ                  │
    │ raw_user_meta_data  JSONB                    │
    │   └─ {nickname: "..."}                       │
    └──────────────────────────────────────────────┘
                         │
                         │ TRIGGER: on_auth_user_created
                         │ (автоматическое создание профиля)
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          PROFILE LAYER                               │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────┐
    │          public.profiles                      │
    │──────────────────────────────────────────────│
    │ id              UUID (PK, FK → auth.users)   │
    │ email           TEXT (NOT NULL)              │
    │ nickname        TEXT (UNIQUE!, NOT NULL) ✨  │
    │ avatar_url      TEXT                         │
    │ bio             TEXT                         │
    │ wallet_address  TEXT                         │
    │ total_shards    INTEGER (DEFAULT 0)          │
    │ total_cards     INTEGER (DEFAULT 0)          │
    │ created_at      TIMESTAMPTZ                  │
    │ updated_at      TIMESTAMPTZ                  │
    │──────────────────────────────────────────────│
    │ CONSTRAINT unique_nickname                   │
    │ CONSTRAINT nickname_length (3-20 chars)      │
    │ CONSTRAINT nickname_format (a-z, 0-9, _)     │
    └──────────────────────────────────────────────┘
                         │
                         │
                         ▼
    ┌──────────────────────────────────────────────┐
    │        profile_stats (VIEW)                   │
    │──────────────────────────────────────────────│
    │ Агрегирует данные из:                        │
    │ - profiles                                   │
    │ - user_shards (COUNT)                        │
    │ - user_cards (COUNT)                         │
    │ - listings (COUNT)                           │
    │──────────────────────────────────────────────│
    │ Используется для Dashboard                   │
    └──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         CONTENT LAYER                                │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │ collections  │◄─────│    cards     │◄─────│   shards     │
    │──────────────│      │──────────────│      │──────────────│
    │ id (PK)      │      │ id (PK)      │      │ id (PK)      │
    │ name         │      │ name         │      │ card_id (FK) │
    │ description  │      │ collection   │      │ label (A/B/C)│
    │ active       │      │ rarity       │      │ image_url    │
    └──────────────┘      │ supply_limit │      │ spawn_point  │
                          │ minted_count │      └──────────────┘
                          └──────────────┘
                                 │
                                 │ Каждая карта = 3 осколка (A/B/C)
                                 ▼

┌─────────────────────────────────────────────────────────────────────┐
│                        USER INVENTORY LAYER                          │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐          ┌──────────────────┐
    │   user_shards    │          │   user_cards     │
    │──────────────────│          │──────────────────│
    │ id (PK)          │          │ id (PK)          │
    │ user_id (FK) ──┐ │          │ user_id (FK) ──┐ │
    │ shard_id (FK)  │ │          │ card_id (FK)   │ │
    │ collected_at   │ │          │ assembled_at   │ │
    │ used (BOOL)    │ │          │ minted (BOOL)  │ │
    └────────────────┘ │          └────────────────┘ │
                       │                             │
                       └─────────┬───────────────────┘
                                 │
                                 ▼
                         ┌──────────────┐
                         │   profiles   │
                         │ (user_id)    │
                         └──────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        GEOLOCATION LAYER                             │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐          ┌──────────────────┐
    │  spawn_points    │◄─────────│      drops       │
    │──────────────────│          │──────────────────│
    │ id (PK)          │          │ id (PK)          │
    │ shard_id (FK)    │          │ name             │
    │ latitude         │          │ schedule         │
    │ longitude        │          │ start_date       │
    │ radius (meters)  │          │ end_date         │
    │ active (BOOL)    │          │ active (BOOL)    │
    └──────────────────┘          └──────────────────┘
             │                             │
             └──────────┬──────────────────┘
                        │
                        ▼
            ┌──────────────────────┐
            │  drop_spawn_points   │
            │──────────────────────│
            │ drop_id (FK)         │
            │ spawn_point_id (FK)  │
            └──────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        MARKETPLACE LAYER                             │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────┐
    │               listings                        │
    │──────────────────────────────────────────────│
    │ id (PK)                                      │
    │ seller_id (FK → profiles)                    │
    │ user_card_id (FK → user_cards)               │
    │ price (DECIMAL)                              │
    │ status (active/sold/cancelled)               │
    │ banned (BOOL)                                │
    │ created_at                                   │
    └──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         ADMIN LAYER                                  │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │ admin_roles  │      │  settings    │      │  audit_log   │
    │──────────────│      │──────────────│      │──────────────│
    │ user_id (FK) │      │ key          │      │ id           │
    │ role         │      │ value        │      │ action       │
    │ (owner/mgr)  │      │ updated_at   │      │ entity       │
    └──────────────┘      └──────────────┘      │ admin_id     │
                                                 │ timestamp    │
                                                 └──────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     KEY FUNCTIONS & TRIGGERS                         │
└─────────────────────────────────────────────────────────────────────┘

📝 TRIGGERS:
   ┌────────────────────────────────────────────────────┐
   │ on_auth_user_created                               │
   │ ────────────────────────────────────────────────   │
   │ WHEN:  INSERT на auth.users                        │
   │ DOES:  Создает профиль автоматически               │
   │        Проверяет уникальность nickname             │
   └────────────────────────────────────────────────────┘

   ┌────────────────────────────────────────────────────┐
   │ set_updated_at                                     │
   │ ────────────────────────────────────────────────   │
   │ WHEN:  UPDATE на profiles                          │
   │ DOES:  Автоматически обновляет updated_at          │
   └────────────────────────────────────────────────────┘

🔧 FUNCTIONS:
   ┌────────────────────────────────────────────────────┐
   │ check_nickname_available(nickname TEXT)            │
   │ ────────────────────────────────────────────────   │
   │ INPUT:  Nickname для проверки                      │
   │ DOES:   Проверяет уникальность (case-insensitive)  │
   │ OUTPUT: TRUE если доступен, FALSE если занят       │
   └────────────────────────────────────────────────────┘

   ┌────────────────────────────────────────────────────┐
   │ get_current_profile()                              │
   │ ────────────────────────────────────────────────   │
   │ INPUT:  auth.uid() (текущий пользователь)          │
   │ DOES:   Возвращает профиль с статистикой          │
   │ OUTPUT: Строка из profile_stats view              │
   └────────────────────────────────────────────────────┘

   ┌────────────────────────────────────────────────────┐
   │ update_profile_stats(user_id UUID)                 │
   │ ────────────────────────────────────────────────   │
   │ INPUT:  UUID пользователя                          │
   │ DOES:   Пересчитывает total_shards, total_cards   │
   │ OUTPUT: void (обновляет profiles напрямую)         │
   └────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      SECURITY (RLS POLICIES)                         │
└─────────────────────────────────────────────────────────────────────┘

    profiles:
    ├─ SELECT:  Все могут читать (public)
    ├─ INSERT:  Только свой профиль (auth.uid() = id)
    └─ UPDATE:  Только свой профиль (auth.uid() = id)

    user_shards:
    ├─ SELECT:  Только свои (auth.uid() = user_id)
    ├─ INSERT:  Только админы или система
    └─ UPDATE:  Только свои (auth.uid() = user_id)

    user_cards:
    ├─ SELECT:  Только свои (auth.uid() = user_id)
    └─ INSERT:  Только система (при сборке)

    listings:
    ├─ SELECT:  Все активные (public)
    ├─ INSERT:  Только свои (auth.uid() = seller_id)
    └─ UPDATE:  Только свои (auth.uid() = seller_id)

┌─────────────────────────────────────────────────────────────────────┐
│                        DATA FLOW DIAGRAM                             │
└─────────────────────────────────────────────────────────────────────┘

РЕГИСТРАЦИЯ:
    User Input → Frontend Validation → /api/auth/check-nickname
                                              ↓
                                    check_nickname_available()
                                              ↓
                                    { available: true/false }
                                              ↓
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                         ✅ Доступен                     ❌ Занят
                              ↓                               ↓
                    supabase.auth.signUp()          Show Error
                              ↓
                    INSERT auth.users
                              ↓
                    TRIGGER: on_auth_user_created
                              ↓
                    handle_new_user()
                              ↓
                    check_nickname_available()
                              ↓
                    INSERT profiles
                              ↓
                    ✅ Регистрация завершена

ВХОД:
    User Input (email/nickname + password)
              ↓
    Frontend → /login page
              ↓
    supabase.auth.signInWithPassword()
              ↓
    Проверка credentials в auth.users
              ↓
    ┌─────────┴─────────┐
    ▼                   ▼
✅ Успех            ❌ Ошибка
    ↓                   ↓
JWT Token         Show Error
    ↓
Redirect to /

СБОР ОСКОЛКА:
    User at location → GPS Check → Within radius?
                                        ↓
                                   Check hold time (3s)
                                        ↓
                                   INSERT user_shards
                                        ↓
                                   update_profile_stats()
                                        ↓
                                   Check can_assemble_card()
                                        ↓
                                   ┌───────┴───────┐
                                   ▼               ▼
                              3/3 shards      < 3 shards
                                   ↓               ↓
                           assemble_card()    Continue
                                   ↓
                           INSERT user_cards
                                   ↓
                           Mark shards as used
                                   ↓
                           increment_minted_count()

┌─────────────────────────────────────────────────────────────────────┐
│                         INDEXES                                      │
└─────────────────────────────────────────────────────────────────────┘

profiles:
├─ idx_profiles_nickname      (nickname) - для поиска
├─ idx_profiles_email         (email) - для входа
└─ idx_profiles_created_at    (created_at) - для сортировки

user_shards:
├─ idx_user_shards_user_id    (user_id) - для инвентаря
├─ idx_user_shards_shard_id   (shard_id) - для проверок
└─ idx_user_shards_used       (used) - для подсчета

spawn_points:
└─ idx_spawn_points_location  (latitude, longitude) - для карты

listings:
├─ idx_listings_seller_id     (seller_id) - для профиля продавца
└─ idx_listings_status        (status) - для маркетплейса

┌─────────────────────────────────────────────────────────────────────┐
│                    CONNECTION TO FRONTEND                            │
└─────────────────────────────────────────────────────────────────────┘

    Frontend (Next.js)
          │
          ├─ /register → app/register/page.tsx
          │                    ↓
          │              check-nickname API
          │                    ↓
          │              supabase.auth.signUp()
          │
          ├─ /login → app/login/page.tsx
          │                    ↓
          │              supabase.auth.signInWithPassword()
          │
          ├─ /profile → app/profile/page.tsx
          │                    ↓
          │              get_current_profile()
          │
          ├─ /map → app/map/page.tsx
          │                    ↓
          │              SELECT spawn_points
          │
          ├─ /checkin → app/checkin/page.tsx
          │                    ↓
          │              INSERT user_shards
          │
          └─ /admin-panel → app/admin-panel/page.tsx
                               ↓
                         /api/admin/* endpoints

┌─────────────────────────────────────────────────────────────────────┐
│                       PERFORMANCE NOTES                              │
└─────────────────────────────────────────────────────────────────────┘

✅ Индексы на всех FK для быстрых JOIN
✅ View для агрегированных данных (избегаем N+1)
✅ RLS policies оптимизированы (используют индексы)
✅ Trigger работает AFTER INSERT (не блокирует основную транзакцию)
✅ Connection pooling через Supabase (до 15 одновременных подключений на Free tier)

┌─────────────────────────────────────────────────────────────────────┐
│                       BACKUP & RECOVERY                              │
└─────────────────────────────────────────────────────────────────────┘

Supabase автоматически:
├─ Point-in-time recovery (7 дней на Free tier)
├─ Ежедневные бэкапы
├─ Geo-replication (опционально на Pro tier)
└─ Export через pg_dump

Ручной бэкап:
└─ Dashboard → Database → Backups → Download

┌─────────────────────────────────────────────────────────────────────┐
│                            LEGEND                                    │
└─────────────────────────────────────────────────────────────────────┘

(PK)     = Primary Key
(FK)     = Foreign Key
(UNIQUE) = Unique Constraint
✨       = Special Feature (уникальные nicknames!)
─────►   = One-to-Many relationship
◄─────   = Many-to-One relationship
◄────►   = Many-to-Many relationship
```

---

**Эта схема показывает полную архитектуру базы данных QORA NFT Platform.**  
**Используйте её как справочник при разработке! 🚀**
