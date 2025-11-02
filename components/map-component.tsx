"use client"

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import { fragmentColors, fragmentImages, type FragmentSpawn } from "@/app/map/page"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"

// Исправление иконок Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

// Кастомная иконка пользователя
const userIcon = L.divIcon({
  className: "custom-user-marker",
  html: `<div style="
    width: 40px;
    height: 40px;
    position: relative;
  ">
    <div style="
      position: absolute;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(56, 138, 232, 0.3);
      top: 2px;
      left: 2px;
    "></div>
    <div style="
      position: absolute;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #388ae8;
      top: 8px;
      left: 8px;
    "></div>
    <div style="
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: white;
      top: 14px;
      left: 14px;
    "></div>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

// Создаём кастомные иконки для каждого осколка с реальными изображениями
const createFragmentIcon = (shardId: string) => {
  const imageMap: Record<string, string> = {
    "shard-1": "/elements/shard-1.png",
    "shard-2": "/elements/shard-2.png", 
    "shard-3": "/elements/shard-3.png",
  }
  
  const imagePath = imageMap[shardId] || "/elements/shard-1.png"
  
  return L.divIcon({
    className: "custom-fragment-marker",
    html: `<div style="
      width: 80px;
      height: 80px;
      position: relative;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.6));
    ">
      <img 
        src="${imagePath}" 
        alt="Осколок ${shardId}"
        style="
          width: 100%;
          height: 100%;
          object-fit: contain;
          animation: float 3s ease-in-out infinite;
        "
      />
    </div>`,
    iconSize: [80, 80],
    iconAnchor: [40, 40],
  })
}

interface MapComponentProps {
  selectedFragment: FragmentSpawn | null
  setSelectedFragment: (fragment: FragmentSpawn | null) => void
  spawnPoints: FragmentSpawn[]
  isLoadingSpawns: boolean
  userLocation: [number, number] | null
}

export default function MapComponent({ setSelectedFragment, spawnPoints, isLoadingSpawns, userLocation: propUserLocation }: MapComponentProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(propUserLocation)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Определяем мобильное устройство
    setIsMobile(window.innerWidth < 768)
  }, [])
  
  // Синхронизируем с prop
  useEffect(() => {
    if (propUserLocation) {
      setUserLocation(propUserLocation)
    }
  }, [propUserLocation])
  
  useEffect(() => {
    // Получаем геолокацию пользователя с улучшенными параметрами
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          
          // Пробуем получить хотя бы одноразово
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation([position.coords.latitude, position.coords.longitude])
            },
            (err) => console.error(err),
            { 
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 30000
            }
          )
        },
        { 
          enableHighAccuracy: true, // Более точное определение
          timeout: 15000,
          maximumAge: 30000
        }
      )

      // Очищаем watchPosition при размонтировании
      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          background: #000;
        }
        .custom-user-marker,
        .custom-fragment-marker {
          background: transparent;
          border: none;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .custom-fragment-marker:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }
        
        .leaflet-popup-content-wrapper {
          background: rgba(0, 0, 0, 0.9);
          color: white;
          border-radius: 12px;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 12px;
        }
        .leaflet-popup-tip {
          background: rgba(0, 0, 0, 0.9);
        }
      `}</style>
      
      <MapContainer
        center={[42.875964, 74.603701]}
        zoom={isMobile ? 11 : 12}
        style={{ width: "100%", height: "100%" }}
        zoomControl={!isMobile}
        preferCanvas={true}
        attributionControl={false}
        zoomAnimation={!isMobile}
        fadeAnimation={!isMobile}
        markerZoomAnimation={!isMobile}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={18}
          minZoom={isMobile ? 10 : 8}
          updateWhenIdle={isMobile}
          updateWhenZooming={!isMobile}
          keepBuffer={isMobile ? 1 : 2}
        />
        
        {/* Маркеры осколков */}
        {spawnPoints.map((spawn: FragmentSpawn) => (
          <Marker
            key={spawn.id}
            position={[spawn.lat, spawn.lng]}
            icon={createFragmentIcon(spawn.shardId)}
            eventHandlers={{
              click: () => setSelectedFragment(spawn)
            }}
          >
            <Popup>
              <div style={{ padding: "8px" }}>
                <strong>{spawn.name}</strong><br />
                Осколок {spawn.fragment} • {spawn.rarity}<br />
                <span style={{ color: spawn.available ? "#10b981" : "#ef4444" }}>
                  {spawn.available ? "Доступно" : "Собрано"}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Маркер пользователя */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div style={{ padding: "8px" }}>
                  <strong>📍 Ваша локация</strong><br />
                  Вы находитесь здесь
                </div>
              </Popup>
            </Marker>
            <Circle
              center={userLocation}
              radius={50}
              pathOptions={{
                color: "#388ae8",
                fillColor: "#388ae8",
                fillOpacity: 0.2,
              }}
            />
          </>
        )}
      </MapContainer>
    </>
  )
}
