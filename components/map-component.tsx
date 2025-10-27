"use client"

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet"
import { fragmentSpawns, fragmentColors, type FragmentSpawn } from "@/app/map/page"
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

// Создаём кастомные иконки для каждого фрагмента
const createFragmentIcon = (color: string) => {
  return L.divIcon({
    className: "custom-fragment-marker",
    html: `<div style="
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: ${color};
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

interface MapComponentProps {
  selectedChain: "TON" | "ETH" | "BASE" | null
  selectedFragment: FragmentSpawn | null
  setSelectedFragment: (fragment: FragmentSpawn | null) => void
}

function MapUpdater({ selectedChain }: { selectedChain: string | null }) {
  const map = useMap()
  
  useEffect(() => {
    // Обновляем вид карты при изменении фильтра
    if (selectedChain) {
      const filtered = fragmentSpawns.filter(f => f.chain === selectedChain)
      if (filtered.length > 0) {
        const bounds = L.latLngBounds(filtered.map(f => [f.lat, f.lng]))
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    } else {
      map.setView([42.875964, 74.603701], 12)
    }
  }, [selectedChain, map])
  
  return null
}

export default function MapComponent({ selectedChain, setSelectedFragment }: MapComponentProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Определяем мобильное устройство
    setIsMobile(window.innerWidth < 768)
  }, [])
  
  useEffect(() => {
    // Получаем геолокацию пользователя
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.log("Геолокация недоступна:", error)
        },
        { 
          enableHighAccuracy: false, // Быстрее на мобильных
          timeout: 5000,
          maximumAge: 10000
        }
      )
    }
  }, [])
  
  const filtered = selectedChain 
    ? fragmentSpawns.filter(f => f.chain === selectedChain)
    : fragmentSpawns

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
        
        <MapUpdater selectedChain={selectedChain} />
        
        {/* Маркеры фрагментов */}
        {filtered.map((spawn) => (
          <Marker
            key={spawn.id}
            position={[spawn.lat, spawn.lng]}
            icon={createFragmentIcon(fragmentColors[spawn.fragment])}
            eventHandlers={{
              click: () => setSelectedFragment(spawn)
            }}
          >
            <Popup>
              <div style={{ padding: "8px" }}>
                <strong>{spawn.name}</strong><br />
                Фрагмент {spawn.fragment} • {spawn.rarity}<br />
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
