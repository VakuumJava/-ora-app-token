# Система точек спавна и чекина

## ✅ Что реализовано:

### 1. **API для точек спавна**

#### `GET /api/spawn-points`
Получение всех активных точек спавна
```json
[
  {
    "id": "uuid",
    "lat": 42.8746,
    "lng": 74.5698,
    "fragment": "A",
    "rarity": "rare",
    "name": "Карточка название",
    "available": true,
    "radius": 5,
    "shardId": "uuid",
    "imageUrl": "/elements/shard-1.png"
  }
]
```

#### `POST /api/checkin`
Чекин пользователя на точке спавна
```json
{
  "spawnPointId": "uuid",
  "userLat": 42.8746,
  "userLng": 74.5698,
  "accuracy": 10
}
```

**Ответ при успехе:**
```json
{
  "success": true,
  "message": "Осколок успешно собран!",
  "shard": {
    "id": "uuid",
    "label": "A",
    "cardName": "Название карточки",
    "imageUrl": "/elements/shard-1.png",
    "collectedAt": "2025-10-28T..."
  }
}
```

**Ошибки:**
- `Too far from spawn point` - слишком далеко
- `GPS accuracy too low` - точность GPS < 50м
- `Already collected` - уже собрано
- `Spawn point has expired` - точка истекла

### 2. **API для админа**

#### `POST /api/admin/spawn-points/create`
Создание точки спавна (только для админов)
```json
{
  "shardId": "uuid",
  "latitude": 42.8746,
  "longitude": 74.5698,
  "radius": 5,
  "expiresAt": "2025-12-31T23:59:59Z" // необязательно
}
```

#### `GET /api/admin/shards`
Получение всех осколков для выбора

### 3. **Страницы**

#### `/map` - Карта с точками спавна
- Загрузка точек спавна из БД
- Отображение на карте
- Обязательный запрос геолокации
- Модальное окно для чекина
- Прогресс бар (3 секунды удержания)
- Проверка расстояния в реальном времени

#### `/admin/spawn-points` - Админ-панель
- Выбор осколка из списка
- Клик на карту для выбора места
- Настройка радиуса
- Установка срока действия

### 4. **Компоненты**

#### `CheckinModal`
- Отображение расстояния до точки
- Прогресс бар удержания
- Валидация расстояния
- Обработка ошибок

## 📊 Схема БД

```prisma
model SpawnPoint {
  id          String   @id @default(uuid())
  shardId     String
  latitude    Float
  longitude   Float
  radius      Float    @default(5)
  active      Boolean  @default(true)
  expiresAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  shard       Shard    @relation(...)
}

model UserShard {
  id            String   @id @default(uuid())
  userId        String
  shardId       String
  collectedAt   DateTime @default(now())
  used          Boolean  @default(false)
  
  user          User     @relation(...)
  shard         Shard    @relation(...)
}
```

## 🎮 Как использовать:

### Для пользователей:
1. Открыть `/map`
2. Разрешить геолокацию
3. Увидеть точки спавна на карте (увеличенные осколки 80px)
4. Кликнуть на осколок
5. Нажать "Начать чекин"
6. Удерживать 3 секунды в радиусе 5м
7. Осколок добавится в инвентарь

### Для админов:
1. Открыть `/admin/spawn-points`
2. Выбрать осколок (A, B, C)
3. Кликнуть на карту
4. Настроить радиус и срок
5. Создать точку спавна

## ⚙️ Настройки

Переменные окружения:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
```

## 🔒 Безопасность

1. **Проверка расстояния на сервере** - нельзя обмануть
2. **Проверка точности GPS** - максимум 50м
3. **Защита от повторного сбора** - один осколок один раз
4. **Админ-права** - только админы могут создавать точки
5. **Audit log** - все действия админов логируются

## 🚀 Следующие шаги:

- [ ] Интерактивная карта в админ-панели
- [ ] Уведомления о новых точках спавна
- [ ] История чекинов пользователя
- [ ] Статистика по точкам спавна
- [ ] Push-уведомления при приближении
- [ ] Таймер до истечения точки спавна
