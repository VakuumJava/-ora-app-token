"use client"

import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useState, useEffect } from "react"

// Исправление иконок Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

// Иконка для выбранного места
const clickIcon = L.divIcon({
  className: "custom-click-marker",
  html: `<div style="
    width: 40px;
    height: 40px;
    position: relative;
  ">
    <div style="
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(59, 130, 246, 0.3);
      animation: pulse 2s infinite;
    "></div>
    <div style="
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #3b82f6;
      top: 10px;
      left: 10px;
    "></div>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

// Создаём кастомные иконки для осколков
const createFragmentIcon = (fragment: string) => {
  const imageMap: Record<string, string> = {
    "A": "/elements/shard-1.png",
    "B": "/elements/shard-2.png",
    "C": "/elements/shard-3.png",
  }

  const imagePath = imageMap[fragment] || "/elements/shard-1.png"

  return L.divIcon({
    className: "custom-fragment-marker",
    html: `<div style="
      width: 60px;
      height: 60px;
      position: relative;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.6));
    ">
      <img 
        src="${imagePath}" 
        alt="Осколок ${fragment}"
        style="
          width: 100%;
          height: 100%;
          object-fit: contain;
        "
      />
    </div>`,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  })
}

interface SpawnPoint {
  id: string
  lat: number
  lng: number
  fragment: string
  radius: number
}

interface AdminSpawnMapProps {
  onMapClick: (lat: number, lng: number) => void
  clickLocation: [number, number] | null
  spawnPoints: SpawnPoint[]
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function AdminSpawnMap({ onMapClick, clickLocation, spawnPoints }: AdminSpawnMapProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  return (
    <>
      <style jsx global>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          background: #111827;
        }
        .custom-click-marker,
        .custom-fragment-marker {
          background: transparent;
          border: none;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }
      `}</style>

      <MapContainer
        center={[42.875964, 74.603701]}
        zoom={isMobile ? 11 : 12}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
        preferCanvas={true}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={18}
          minZoom={8}
        />

        <MapClickHandler onClick={onMapClick} />

        {/* Существующие точки спавна */}
        {spawnPoints.map((spawn) => (
          <Marker
            key={spawn.id}
            position={[spawn.lat, spawn.lng]}
            icon={createFragmentIcon(spawn.fragment)}
          >
            <Circle
              center={[spawn.lat, spawn.lng]}
              radius={spawn.radius}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
              }}
            />
          </Marker>
        ))}

        {/* Выбранное место */}
        {clickLocation && (
          <Marker position={clickLocation} icon={clickIcon}>
            <Circle
              center={clickLocation}
              radius={5}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.2,
              }}
            />
          </Marker>
        )}
      </MapContainer>
    </>
  )
}
