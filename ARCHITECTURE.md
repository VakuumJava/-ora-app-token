# 🏗️ Архитектура Admin Panel

## Обзор

Админ-панель построена по современной архитектуре с четким разделением на слои:

```
┌─────────────────────────────────────────────────────┐
│                    Frontend UI                       │
│        (Next.js 15 + React 19 + TypeScript)         │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────────────┐
│                  API Layer                           │
│           (Next.js API Routes)                       │
└──────────────────┬──────────────────────────────────┘
                   │ Supabase Client
┌──────────────────▼──────────────────────────────────┐
│              Business Logic                          │
│         (lib/admin-utils.ts)                        │
└──────────────────┬──────────────────────────────────┘
                   │ SQL + RPC
┌──────────────────▼──────────────────────────────────┐
│            Database Layer                            │
│     (PostgreSQL + RLS + Functions)                  │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend Layer

### Технологии
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (Radix UI)
- **State:** React Hooks (useState, useEffect)

### Структура компонентов

```
app/admin-panel/
  page.tsx              # Главная страница с табами
    ├─ Dashboard        # Статистика
    ├─ Collections      # Управление коллекциями
    ├─ Cards            # Управление карточками
    ├─ Shards           # Загрузка осколков
    ├─ Spawn Points     # Точки спавна
    ├─ Drops            # Дропы
    ├─ Marketplace      # Маркетплейс
    ├─ Users            # Пользователи
    ├─ Web3             # Web3 конфиг
    ├─ Settings         # Настройки
    └─ Audit Log        # Логи

components/ui/
  ├─ dialog.tsx         # Модальные окна
  ├─ table.tsx          # Таблицы
  ├─ switch.tsx         # Переключатели
  ├─ card.tsx           # Карточки
  └─ ... (другие UI компоненты)
```

### Паттерны UI

#### Модальные формы (Dialog)
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Создать</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Новая коллекция</DialogTitle>
    </DialogHeader>
    {/* Форма */}
  </DialogContent>
</Dialog>
```

#### Таблицы данных (Table)
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Название</TableHead>
      <TableHead>Действия</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>
          <Button>Редактировать</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 🔌 API Layer

### Next.js API Routes

```
app/api/admin/
  ├─ collections/route.ts
  ├─ cards/route.ts
  ├─ shards/route.ts
  ├─ spawn-points/
  │  ├─ route.ts
  │  ├─ [id]/route.ts
  │  └─ import/route.ts
  ├─ drops/
  │  ├─ route.ts
  │  └─ [id]/toggle/route.ts
  ├─ listings/
  │  ├─ route.ts
  │  └─ [id]/ban/route.ts
  ├─ users/
  │  ├─ route.ts
  │  └─ [id]/
  │     ├─ grant-shard/route.ts
  │     └─ revoke-shard/route.ts
  ├─ web3/
  │  ├─ route.ts
  │  └─ test-mint/route.ts
  ├─ dashboard/route.ts
  ├─ settings/route.ts
  └─ audit-log/route.ts
```

### Паттерн API Route

```typescript
export async function POST(request: NextRequest) {
  // 1. Проверка прав
  const { authorized } = await checkAdminRole()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Валидация данных
  const body = await request.json()
  if (!body.name) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 })
  }

  // 3. Бизнес-логика
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('collections')
    .insert(body)
    .select()
    .single()

  // 4. Логирование
  await logAdminAction({
    action: 'create_collection',
    entity: 'collections',
    entity_id: data.id,
    after: data
  })

  // 5. Ответ
  return NextResponse.json(data)
}
```

---

## 💼 Business Logic Layer

### lib/admin-utils.ts

Утилиты для бизнес-логики:

```typescript
// Проверка прав
checkAdminRole(requiredRole?: AdminRole): Promise<{...}>

// Логирование
logAdminAction(params: {...}): Promise<void>

// Настройки
getSetting(key: string): Promise<string | null>
updateSetting(key: string, value: string): Promise<boolean>

// Валидация
checkShardCollectionLimit(userId, shardId): Promise<{...}>
checkCardAssembly(userId, cardId): Promise<{...}>

// Сборка карточек
assembleCard(userId, cardId): Promise<{...}>

// Геолокация
calculateDistance(lat1, lon1, lat2, lon2): number
```

### lib/admin-types.ts

TypeScript типы:

```typescript
export type AdminRole = 'owner' | 'manager'

export interface Collection {
  id: string
  name: string
  description?: string
  // ...
}

export interface Card {
  // ...
}

// ... все остальные типы
```

---

## 🗄️ Database Layer

### Структура таблиц

```sql
-- Админка
admin_roles          # Роли администраторов

-- Контент
collections          # NFT коллекции
cards                # Карточки
shards               # Осколки (3 на карточку)
spawn_points         # Точки спавна
drops                # Расписания дропов
drop_spawn_points    # Связь дропов и точек

-- Пользователи
user_shards          # Осколки пользователей
user_cards           # Карточки пользователей

-- Маркетплейс
listings             # Листинги

-- Система
settings             # Настройки
web3_config          # Web3 конфигурация
audit_log            # Логи действий
```

### SQL функции

```sql
-- Проверка прав
is_admin() RETURNS BOOLEAN
is_owner() RETURNS BOOLEAN

-- Бизнес-логика
increment_minted_count(card_id UUID)
check_shard_collection_limit(user_id, shard_id)
can_assemble_card(user_id, card_id)
get_dashboard_stats() RETURNS JSON

-- Автоматизация
deactivate_expired_spawn_points()
deactivate_expired_drops()
```

### Триггеры

```sql
-- Логирование изменений
collections_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE
  FOR EACH ROW

-- Проверка лимитов
check_card_supply_trigger
  BEFORE INSERT ON user_cards
  FOR EACH ROW
```

### Views

```sql
-- Статистика пользователей
CREATE VIEW user_stats AS
SELECT 
  u.id, 
  u.email,
  COUNT(DISTINCT us.id) as total_shards,
  COUNT(DISTINCT uc.id) as total_cards
FROM auth.users u
LEFT JOIN user_shards us ON us.user_id = u.id
LEFT JOIN user_cards uc ON uc.user_id = u.id
GROUP BY u.id;

-- Статистика коллекций
CREATE VIEW collection_stats AS
SELECT 
  c.id,
  c.name,
  COUNT(DISTINCT ca.id) as total_cards,
  SUM(ca.minted_count) as total_minted
FROM collections c
LEFT JOIN cards ca ON ca.collection_id = c.id
GROUP BY c.id;
```

---

## 🔒 Security Layer

### Row Level Security (RLS)

```sql
-- Коллекции доступны всем
CREATE POLICY "Коллекции доступны всем" 
ON collections FOR SELECT 
USING (active = true);

-- Пользователи видят свои осколки
CREATE POLICY "Пользователи видят свои осколки" 
ON user_shards FOR SELECT 
USING (auth.uid() = user_id);
```

### Авторизация на API

```typescript
// Каждый API endpoint проверяет права
const { authorized, role } = await checkAdminRole()

if (!authorized) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

// Owner-only endpoints
if (role !== 'owner') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### Audit Log

Все действия логируются:

```typescript
await logAdminAction({
  action: 'create_collection',
  entity: 'collections',
  entity_id: data.id,
  before: oldData,  // для UPDATE/DELETE
  after: data       // для INSERT/UPDATE
})
```

---

## 📊 Data Flow

### Создание коллекции

```
1. User clicks "Создать коллекцию"
   ↓
2. Modal Dialog opens
   ↓
3. User fills form and clicks "Создать"
   ↓
4. Frontend validates input
   ↓
5. POST /api/admin/collections
   ↓
6. API checks admin role (checkAdminRole)
   ↓
7. API inserts to Supabase (collections table)
   ↓
8. Supabase RLS checks permissions
   ↓
9. Trigger logs to audit_log
   ↓
10. API returns new collection
    ↓
11. Frontend updates UI
    ↓
12. Modal closes
```

### Сборка карточки из осколков

```
1. User collects 3 shards (фронт игры)
   ↓
2. Backend calls checkCardAssembly(userId, cardId)
   ↓
3. SQL function checks:
   - Существует ли 3 осколка для карточки?
   - Есть ли у пользователя все 3 неиспользованных?
   ↓
4. If YES → assembleCard(userId, cardId)
   ↓
5. Creates user_cards record
   ↓
6. Marks shards as used (used = true)
   ↓
7. Increments card.minted_count
   ↓
8. Triggers check_card_supply_trigger
   ↓
9. Logs to audit_log
   ↓
10. Returns success with userCardId
```

---

## 🚀 Performance Optimizations

### Database
- ✅ Индексы на часто запрашиваемые колонки
- ✅ Views для агрегированных данных
- ✅ Оптимизированные JOIN'ы
- ✅ LIMIT на большие выборки

### Frontend
- ✅ Server Components (Next.js)
- ✅ Lazy loading компонентов
- ✅ Мемоизация (React.memo)
- ✅ Дебаунсинг поисков

### API
- ✅ Минимальные SELECT (только нужные поля)
- ✅ Батчинг запросов
- ✅ Кэширование настроек
- ✅ Пагинация больших списков

---

## 🔄 Scalability

### Horizontal Scaling
- Next.js поддерживает multiple instances
- Supabase автоматически масштабируется
- Stateless API (можно добавлять серверы)

### Vertical Scaling
- PostgreSQL индексы и оптимизации
- Connection pooling (Supabase)
- Read replicas для аналитики

### Caching Strategy
```typescript
// Настройки кэшируются в памяти
const settingsCache = new Map<string, string>()

async function getSetting(key: string) {
  if (settingsCache.has(key)) {
    return settingsCache.get(key)
  }
  // fetch from DB
  settingsCache.set(key, value)
  return value
}
```

---

## 📈 Monitoring & Observability

### Логи
- ✅ Audit log для всех админских действий
- ✅ API logs в Next.js
- ✅ PostgreSQL logs в Supabase
- ✅ Error tracking (можно добавить Sentry)

### Метрики
- Dashboard stats обновляется в реальном времени
- View `user_stats` для быстрого доступа
- View `collection_stats` для аналитики

### Алерты (TODO)
- Email при подозрительных действиях
- Slack/Discord уведомления
- Threshold alerts (много минтов, много банов)

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// lib/admin-utils.test.ts
describe('calculateDistance', () => {
  it('should calculate correct distance', () => {
    const dist = calculateDistance(55.7558, 37.6173, 55.7600, 37.6200)
    expect(dist).toBeCloseTo(480, 0) // ~480 метров
  })
})
```

### Integration Tests
```typescript
// api/admin/collections.test.ts
describe('POST /api/admin/collections', () => {
  it('should create collection', async () => {
    const response = await fetch('/api/admin/collections', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' })
    })
    expect(response.status).toBe(200)
  })
})
```

### E2E Tests (TODO)
- Playwright для UI тестов
- Сценарии: создание коллекции, добавление точки, бан листинга

---

## 📚 Documentation

- **ADMIN_PANEL.md** - Полная документация
- **API_EXAMPLES.md** - Примеры API
- **QUICKSTART.md** - Быстрый старт
- **CHECKLIST.md** - Чеклист запуска
- **IMPLEMENTATION_SUMMARY.md** - Что реализовано
- **ARCHITECTURE.md** - Этот файл

---

## 🔮 Future Enhancements

### Phase 2
- [ ] Интеграция карты (Mapbox/Leaflet)
- [ ] Загрузка изображений (S3/Supabase Storage)
- [ ] Rate limiting
- [ ] 2FA для админов

### Phase 3
- [ ] Аналитика и графики
- [ ] Экспорт отчетов (CSV, PDF)
- [ ] Bulk operations (массовые действия)
- [ ] Advanced search & filters

### Phase 4
- [ ] Webhook система
- [ ] API для внешних интеграций
- [ ] Mobile admin app
- [ ] AI модерация контента

---

**Архитектура спроектирована для легкого расширения и масштабирования! 🚀**
