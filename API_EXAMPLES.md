# API Examples для Админ-панели

Примеры использования всех API endpoints для разработки фронтенда.

## Аутентификация

Все запросы к `/api/admin/*` требуют авторизации через Supabase Auth.

```typescript
// В компонентах Next.js используйте:
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data: { session } } = await supabase.auth.getSession()
```

---

## Collections (Коллекции)

### Создать коллекцию

```typescript
const response = await fetch('/api/admin/collections', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Urban Relics',
    description: 'Городские артефакты прошлого',
    cover_url: 'https://example.com/cover.jpg',
    chain: 'ethereum',
    royalty_pct: 5
  })
})

const collection = await response.json()
// { id: 'uuid', name: 'Urban Relics', ... }
```

### Получить все коллекции

```typescript
const response = await fetch('/api/admin/collections')
const collections = await response.json()
// [{ id: 'uuid', name: 'Urban Relics', ... }, ...]
```

---

## Cards (Карточки)

### Создать карточку (+ автоматически 3 осколка)

```typescript
const response = await fetch('/api/admin/cards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    collection_id: 'collection-uuid',
    name: 'Старинный компас',
    description: 'Викторианский навигационный инструмент',
    supply_cap: 1000,
    image_url: 'https://example.com/compass.jpg',
    rarity: 'rare'
  })
})

const card = await response.json()
// { id: 'uuid', name: 'Старинный компас', ... }
// Автоматически создаются 3 осколка
```

### Получить карточки коллекции

```typescript
const response = await fetch('/api/admin/cards?collection_id=uuid')
const cards = await response.json()
// [{ id: 'uuid', name: 'Старинный компас', shards: [...], ... }]
```

---

## Shards (Осколки)

### Обновить осколок (загрузить изображения)

```typescript
const response = await fetch('/api/admin/shards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'shard-uuid',
    name: 'Компас - Осколок 1',
    image_url: 'https://example.com/shard1.jpg',
    icon_url: 'https://example.com/icon1.png'
  })
})

const shard = await response.json()
```

### Получить осколки карточки

```typescript
const response = await fetch('/api/admin/shards?card_id=card-uuid')
const shards = await response.json()
// [{ id: 'uuid', shard_index: 1, image_url: '...', ... }, ...]
```

---

## Spawn Points (Точки спавна)

### Создать одну точку

```typescript
const response = await fetch('/api/admin/spawn-points', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    shard_id: 'shard-uuid',
    lat: 55.7558,
    lng: 37.6173,
    qty_total: 10,
    starts_at: '2025-01-01T00:00:00Z',
    ends_at: '2025-12-31T23:59:59Z'
  })
})

const spawnPoint = await response.json()
// { id: 'uuid', lat: 55.7558, lng: 37.6173, ... }
```

### Массовый импорт из CSV

```typescript
const csvData = [
  { lat: 55.7558, lng: 37.6173, count: 10, from: '2025-01-01', to: '2025-12-31' },
  { lat: 55.7600, lng: 37.6200, count: 5, from: '2025-01-01', to: '2025-12-31' }
]

const response = await fetch('/api/admin/spawn-points/import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    shard_id: 'shard-uuid',
    points: csvData
  })
})

const result = await response.json()
// { success: true, count: 2, points: [...] }
```

### Включить/выключить точку

```typescript
const response = await fetch(`/api/admin/spawn-points/${pointId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    active: false
  })
})

const updated = await response.json()
```

### Получить все точки

```typescript
// Все точки
const response = await fetch('/api/admin/spawn-points')

// Только активные
const response = await fetch('/api/admin/spawn-points?active=true')

// Точки конкретного осколка
const response = await fetch('/api/admin/spawn-points?shard_id=uuid')

const spawnPoints = await response.json()
```

---

## Drops (Дропы)

### Создать дроп

```typescript
const response = await fetch('/api/admin/drops', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Зимний дроп',
    description: 'Праздничная акция',
    starts_at: '2025-12-20T00:00:00Z',
    ends_at: '2025-12-31T23:59:59Z',
    spawn_point_ids: ['uuid1', 'uuid2', 'uuid3']
  })
})

const drop = await response.json()
```

### Включить/выключить дроп

```typescript
const response = await fetch(`/api/admin/drops/${dropId}/toggle`, {
  method: 'PATCH'
})

const updated = await response.json()
// { id: 'uuid', active: false, ... }
```

### Получить все дропы

```typescript
const response = await fetch('/api/admin/drops')
const drops = await response.json()
// [{ id: 'uuid', name: 'Зимний дроп', spawn_points: [...], ... }]
```

---

## Marketplace (Маркетплейс)

### Обновить настройки

```typescript
const response = await fetch('/api/admin/listings', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    platform_fee_pct: 7.5,
    min_price_floor: 0.01
  })
})

const result = await response.json()
// { success: true }
```

### Получить листинги

```typescript
// Все листинги
const response = await fetch('/api/admin/listings')

// Только активные
const response = await fetch('/api/admin/listings?status=active')

// Только забаненные
const response = await fetch('/api/admin/listings?status=banned')

const listings = await response.json()
```

### Забанить листинг

```typescript
const response = await fetch(`/api/admin/listings/${listingId}/ban`, {
  method: 'POST'
})

const banned = await response.json()
// { id: 'uuid', status: 'banned', banned_at: '...', ... }
```

### Разбанить листинг

```typescript
const response = await fetch(`/api/admin/listings/${listingId}/ban`, {
  method: 'DELETE'
})

const unbanned = await response.json()
// { id: 'uuid', status: 'active', banned_at: null, ... }
```

---

## Users (Пользователи)

### Поиск пользователей

```typescript
const response = await fetch('/api/admin/users?q=user@example.com')
const users = await response.json()
// [{ id: 'uuid', email: 'user@example.com', user_shards: [...], ... }]
```

### Выдать осколок пользователю

```typescript
const response = await fetch(`/api/admin/users/${userId}/grant-shard`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    shard_id: 'shard-uuid'
  })
})

const userShard = await response.json()
// { id: 'uuid', user_id: '...', shard_id: '...', ... }
```

### Забрать осколок у пользователя

```typescript
const response = await fetch(`/api/admin/users/${userId}/revoke-shard`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_shard_id: 'user-shard-uuid'
  })
})

const result = await response.json()
// { success: true }
```

---

## Web3

### Получить конфигурацию

```typescript
const response = await fetch('/api/admin/web3')
const config = await response.json()
// { id: 'uuid', chain: 'ethereum', rpc_url: '...', ... }
```

### Обновить конфигурацию

```typescript
const response = await fetch('/api/admin/web3', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chain: 'polygon',
    rpc_url: 'https://polygon-rpc.com',
    contract_address: '0x...',
    abi: '[{"inputs":[],"name":"mint"...}]',
    mint_function: 'safeMint'
  })
})

const config = await response.json()
```

### Тестовый минт

```typescript
const response = await fetch('/api/admin/web3/test-mint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image_url: 'https://example.com/nft.jpg',
    to_address: '0x...' // опционально, по умолчанию текущий пользователь
  })
})

const result = await response.json()
// { success: true, config: {...}, message: 'Ready to mint...' }
```

---

## Dashboard (Дашборд)

### Получить статистику

```typescript
const response = await fetch('/api/admin/dashboard')
const data = await response.json()

// {
//   stats: {
//     today_checkins: 127,
//     today_cards_collected: 42,
//     active_listings: 89,
//     today_deals: 15
//   },
//   spawn_points: [...]
// }
```

---

## Settings (Настройки)

### Получить все настройки

```typescript
const response = await fetch('/api/admin/settings')
const settings = await response.json()

// [
//   { key: 'radius_m', value: '5', description: '...' },
//   { key: 'hold_seconds', value: '3', description: '...' },
//   ...
// ]
```

### Обновить настройку

Используйте утилиту `updateSetting()` в серверных компонентах:

```typescript
import { updateSetting } from '@/lib/admin-utils'

await updateSetting('radius_m', '10')
await updateSetting('hold_seconds', '5')
```

---

## Audit Log (Логи)

### Получить логи

```typescript
// Последние 100 записей
const response = await fetch('/api/admin/audit-log')

// С пагинацией
const response = await fetch('/api/admin/audit-log?limit=50&offset=100')

const logs = await response.json()

// [
//   {
//     id: 'uuid',
//     actor_id: 'user-uuid',
//     action: 'create_collection',
//     entity: 'collections',
//     entity_id: 'collection-uuid',
//     before: null,
//     after: {...},
//     ts: '2025-10-25T15:32:10Z',
//     users: { email: 'admin@example.com' }
//   },
//   ...
// ]
```

---

## Примеры использования в React компонентах

### Создание коллекции с обработкой ошибок

```typescript
'use client'

import { useState } from 'react'

export function CreateCollectionForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          description: formData.get('description'),
          cover_url: formData.get('cover_url'),
          chain: formData.get('chain') || 'ethereum',
          royalty_pct: parseFloat(formData.get('royalty_pct') as string) || 0
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create collection')
      }

      const collection = await response.json()
      console.log('Created:', collection)
      
      // Перезагрузить список или редирект
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      {/* форма */}
      <button type="submit" disabled={loading}>
        {loading ? 'Создание...' : 'Создать коллекцию'}
      </button>
    </form>
  )
}
```

### Загрузка данных с React Query

```typescript
'use client'

import { useQuery } from '@tanstack/react-query'

export function CollectionsList() {
  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['admin', 'collections'],
    queryFn: async () => {
      const response = await fetch('/api/admin/collections')
      if (!response.ok) throw new Error('Failed to fetch collections')
      return response.json()
    }
  })

  if (isLoading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error.message}</div>

  return (
    <div>
      {collections.map((collection: any) => (
        <div key={collection.id}>
          {collection.name}
        </div>
      ))}
    </div>
  )
}
```

---

## Обработка ошибок

Все API endpoints возвращают ошибки в формате:

```json
{
  "error": "Error message"
}
```

Статус коды:
- `200` - Success
- `400` - Bad Request (неверные данные)
- `401` - Unauthorized (нет прав)
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

На данный момент rate limiting не реализован, но рекомендуется добавить:

```typescript
// В middleware.ts
import { rateLimit } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const ip = request.ip ?? '127.0.0.1'
    const { success } = await rateLimit(ip)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }
  }
}
```

---

**Полная документация API доступна в ADMIN_PANEL.md**
