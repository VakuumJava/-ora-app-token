# Бэкенд для Qora Platform

## Статус
⚠️ **Бэкенд пока не реализован**. Сейчас работает только фронтенд с пустыми состояниями.

## Технологический стек (по ТЗ)

### Backend
- **Django 4.2+** - основной фреймворк
- **Django REST Framework** - API
- **Django Channels** - WebSocket для real-time обновлений
- **PostgreSQL 15+** - основная БД
- **PostGIS** - расширение для геопространственных данных
- **Redis** - кэширование и очереди

### Деплой
- **Docker + Docker Compose** - контейнеризация
- **Nginx** - reverse proxy
- **Gunicorn** - WSGI сервер
- **Daphne** - ASGI сервер для WebSocket

## Структура проекта

\`\`\`
backend/
├── qora/                   # Основной Django проект
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── apps/
│   ├── users/             # Пользователи и авторизация
│   ├── collections/       # Коллекции NFT
│   ├── cards/             # Карточки и фрагменты
│   ├── spawns/            # Точки спавна на карте
│   ├── inventory/         # Инвентарь пользователей
│   ├── marketplace/       # P2P маркетплейс
│   └── admin_panel/       # Админ-панель
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
\`\`\`

## Модели данных (из ТЗ)

### User
\`\`\`python
- id (UUID)
- username (unique)
- email (unique)
- password_hash
- google_id (nullable)
- apple_id (nullable)
- created_at
- last_login
- is_active
- is_admin
\`\`\`

### Collection
\`\`\`python
- id (UUID)
- name
- description
- image_url
- total_cards
- created_at
- is_active
\`\`\`

### Card
\`\`\`python
- id (UUID)
- collection_id (FK)
- name
- description
- rarity (Common/Uncommon/Rare/Epic/Legendary)
- image_url
- total_supply
- minted_count
\`\`\`

### Fragment
\`\`\`python
- id (UUID)
- card_id (FK)
- fragment_type (A/B/C)
- total_supply
- collected_count
\`\`\`

### SpawnPoint
\`\`\`python
- id (UUID)
- fragment_id (FK)
- latitude (decimal)
- longitude (decimal)
- radius_meters (default: 5)
- is_active
- created_at
\`\`\`

### UserInventory
\`\`\`python
- id (UUID)
- user_id (FK)
- fragment_id (FK, nullable)
- card_id (FK, nullable)
- collected_at
- is_used (для фрагментов после сборки)
\`\`\`

### Listing
\`\`\`python
- id (UUID)
- seller_id (FK)
- card_inventory_id (FK)
- price (decimal)
- status (active/sold/cancelled)
- created_at
- sold_at (nullable)
\`\`\`

## API Endpoints (из ТЗ)

### Auth
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход
- `POST /api/auth/google` - OAuth Google
- `POST /api/auth/apple` - OAuth Apple
- `POST /api/auth/logout` - выход
- `GET /api/auth/me` - текущий пользователь

### Map
- `GET /api/map/spawns` - получить активные точки спавна
- `POST /api/map/checkin` - чекин на точке

### Inventory
- `GET /api/inventory/fragments` - фрагменты пользователя
- `GET /api/inventory/cards` - карточки пользователя
- `POST /api/inventory/assemble` - собрать карточку из фрагментов

### Marketplace
- `GET /api/marketplace/listings` - все листинги
- `POST /api/marketplace/list` - выставить карточку
- `POST /api/marketplace/buy/:id` - купить карточку
- `DELETE /api/marketplace/cancel/:id` - отменить листинг

### Admin
- `POST /api/admin/collections` - создать коллекцию
- `POST /api/admin/cards` - создать карточку
- `POST /api/admin/fragments` - создать фрагмент
- `POST /api/admin/spawns` - создать точку спавна
- `GET /api/admin/users` - список пользователей
- `PATCH /api/admin/users/:id/block` - заблокировать пользователя

## WebSocket

### Подключение
\`\`\`
ws://localhost:8000/ws/map/
\`\`\`

### События
- `spawn_collected` - фрагмент собран, убрать пин с карты
- `new_listing` - новый листинг на маркетплейсе
- `listing_sold` - листинг продан

## Логика чекина (из ТЗ)

\`\`\`python
def validate_checkin(user_lat, user_lon, spawn_point, gps_accuracy, speed):
    # 1. Проверка расстояния
    distance = calculate_distance(user_lat, user_lon, spawn_point.lat, spawn_point.lon)
    if distance > spawn_point.radius_meters:
        return False, "Слишком далеко от точки"
    
    # 2. Проверка точности GPS
    if gps_accuracy > 15:  # метров
        return False, "Недостаточная точность GPS"
    
    # 3. Проверка скорости
    if speed > 2.5:  # м/с
        return False, "Слишком высокая скорость"
    
    # 4. Проверка таймера (3 секунды на фронте)
    # Фронтенд отправляет запрос только после 3 секунд удержания
    
    # 5. Проверка лимита
    fragment = spawn_point.fragment
    if fragment.collected_count >= fragment.total_supply:
        return False, "Фрагмент закончился"
    
    return True, "OK"
\`\`\`

## Переменные окружения

\`\`\`env
# Django
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/qora
REDIS_URL=redis://localhost:6379/0

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# Mapbox (для валидации координат)
MAPBOX_TOKEN=your-mapbox-token

# Check-in параметры
CHECKIN_RADIUS_METERS=5
CHECKIN_HOLD_SECONDS=3
MAX_GPS_ACCURACY_METERS=15
MAX_SPEED_MPS=2.5
\`\`\`

## Следующие шаги

1. **Создать Django проект**
   \`\`\`bash
   django-admin startproject qora backend
   cd backend
   python manage.py startapp users
   python manage.py startapp collections
   # ... остальные приложения
   \`\`\`

2. **Настроить PostgreSQL + PostGIS**
   \`\`\`sql
   CREATE DATABASE qora;
   CREATE EXTENSION postgis;
   \`\`\`

3. **Создать модели** согласно схеме выше

4. **Реализовать API endpoints** с DRF

5. **Добавить WebSocket** с Django Channels

6. **Настроить Docker Compose** для деплоя

7. **Интегрировать с фронтендом** через API

## Контакты

Для вопросов по бэкенду обращайтесь к команде разработки.
