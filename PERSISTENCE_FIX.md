# Исправление проблем с персистентностью данных

## Проблемы которые были исправлены

### 1. ❌ Осколки не добавлялись в инвентарь и исчезали после перезагрузки
**Причина:** localStorage функции вызывались на сервере (где window не существует), данные сохранялись только в оперативной памяти сервера

**Решение:** 
- Разделили логику на server-side (in-memory arrays) и client-side (localStorage)
- Создали `/lib/client-storage.ts` с функциями для работы с localStorage на клиенте
- Сервер хранит данные в памяти для текущей сессии
- Клиент персистентно хранит collectedSpawnIds в localStorage по userId

### 2. ❌ Собранные точки появлялись снова после перезагрузки
**Причина:** collectedSpawnIds не сохранялись в localStorage после успешного чекина

**Решение:**
- В `map/page.tsx` добавили вызов `addCollectedSpawnId(userId, spawnId)` после успешного чекина
- В `useEffect` загружаем собранные точки через `getCollectedSpawnIds(userId)`
- Фильтруем spawn points перед отображением на карте

### 3. ❌ Инвентарь показывал данные demo-user вместо реального пользователя
**Причина:** API `/api/inventory` использовал хардкодированный userId = "demo-user"

**Решение:**
- Обновили API для принятия query параметра `?userId=xxx`
- Страница инвентаря теперь передает userId из сессии: `getUserSession().userId`

## Файлы изменены

### 1. `/lib/spawn-storage.ts` (REVERTED)
```typescript
// До: использовали loadFromStorage/saveToStorage (не работали на сервере)
export const tempSpawnPoints: any[] = loadFromStorage('qora_spawn_points', [])

// После: простые in-memory массивы
export const tempSpawnPoints: any[] = []
export const userInventory: CollectedShard[] = []
export const userCards: CollectedCard[] = []
```

### 2. `/lib/client-storage.ts` (НОВЫЙ ФАЙЛ)
Утилиты для работы с localStorage на клиенте:
```typescript
// Загрузка данных пользователя
loadUserData(userId: string): StoredUserData

// Сохранение данных
saveUserData(userId: string, data: Partial<StoredUserData>): void

// Добавить собранную точку
addCollectedSpawnId(userId: string, spawnId: string): void

// Проверить собрана ли точка
isSpawnCollected(userId: string, spawnId: string): boolean

// Получить все собранные точки
getCollectedSpawnIds(userId: string): string[]
```

### 3. `/app/map/page.tsx`
```typescript
// До
const inventory = localStorage.getItem('qora_user_inventory')
const parsed = JSON.parse(inventory)
const spawnIds = userShards.map(s => s.spawnPointId)

// После
import { getCollectedSpawnIds, addCollectedSpawnId } from '@/lib/client-storage'

// В useEffect
const collected = getCollectedSpawnIds(session.userId)
setCollectedSpawnIds(collected)

// В onSuccess чекина
addCollectedSpawnId(userId, selectedFragment.id)
setCollectedSpawnIds(prev => [...prev, selectedFragment.id])
```

### 4. `/app/api/inventory/route.ts`
```typescript
// До
const userId = "demo-user" // hardcoded

// После
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'demo-user'
  // ...
}
```

### 5. `/app/inventory/page.tsx`
```typescript
// До
const inventoryResponse = await fetch('/api/inventory')

// После
import { getUserSession } from '@/lib/user-session'

const session = getUserSession()
const inventoryResponse = await fetch(`/api/inventory?userId=${session.userId}`)
```

### 6. API Routes (cleaned)
Удалены вызовы `saveToStorage()` из:
- `/app/api/checkin/route.ts`
- `/app/api/craft/route.ts`
- `/app/api/admin/spawn-points/create/route.ts`

## Архитектура данных

### Server-side (in-memory)
- `tempSpawnPoints[]` - все точки спавна
- `userInventory[]` - собранные осколки всех пользователей
- `userCards[]` - скрафченные карты всех пользователей
- Данные живут только во время работы сервера
- При рестарте/деплое - сбрасываются

### Client-side (localStorage)
- `qora_user_data_{userId}` - данные конкретного пользователя
  - `collectedSpawnIds: string[]` - ID собранных точек
  - `inventory: CollectedShard[]` - копия инвентаря (опционально)
  - `cards: CollectedCard[]` - копия карт (опционально)
- Данные персистентны между сессиями
- Изолированы по userId

### Гибридный подход
1. Клиент отправляет запрос с userId
2. Сервер фильтрует данные по userId
3. После успешной операции клиент обновляет localStorage
4. При загрузке клиент читает из localStorage и фильтрует spawn points

## Тестирование

### Тест 1: Сбор осколка
1. Открыть карту `/map`
2. Подойти к точке спавна
3. Нажать "Удерживать для сбора"
4. ✅ Осколок должен исчезнуть с карты
5. ✅ В консоли: "✅ Точка собрана и сохранена: {id}"
6. Перезагрузить страницу (F5)
7. ✅ Осколок не должен появиться снова

### Тест 2: Инвентарь
1. Собрать несколько осколков
2. Открыть `/inventory`
3. ✅ Должны отображаться все собранные осколки
4. ✅ Статистика должна обновиться
5. Перезагрузить страницу
6. ✅ Осколки остались в инвентаре

### Тест 3: Множественные пользователи
1. Открыть DevTools → Application → Local Storage
2. Очистить localStorage
3. Собрать осколок как user1
4. В консоли: `localStorage.setItem('qora_username', 'user2')`
5. Перезагрузить страницу
6. ✅ Ранее собранный осколок должен снова появиться на карте для user2

### Тест 4: Крафт карты
1. Собрать 3 разных осколка (A, B, C)
2. Открыть `/inventory`
3. Нажать "Создать карту"
4. ✅ Осколки должны исчезнуть
5. ✅ Должна появиться новая карта
6. Перезагрузить страницу
7. ✅ Карта должна остаться, осколки не вернуться

## Оставшиеся ограничения

1. **Серверные данные ephemeral** - при рестарте сервера все in-memory данные теряются
2. **Нет синхронизации между устройствами** - localStorage локален для браузера
3. **Нет защиты от читерства** - клиент может манипулировать localStorage
4. **Нет реальной базы данных** - для продакшена нужна PostgreSQL/Supabase

## Следующие шаги (опционально)

1. Подключить Supabase/Prisma для персистентного хранения на сервере
2. Добавить синхронизацию между сервером и клиентом при загрузке
3. Валидация данных от клиента на сервере
4. Rate limiting для API endpoints
5. Добавить JWT токены для аутентификации
