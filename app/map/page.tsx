"use client"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { MapPin, X, MapPinOff } from "lucide-react"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"

const MapComponent = dynamic(() => import("@/components/map-component"), { 
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-black">
      <div className="text-center text-white">
        <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 mx-auto" />
        <p className="text-xs text-gray-400">Загрузка...</p>
      </div>
    </div>
  )
})

type Fragment = "1" | "2" | "3"
type Rarity = "Common" | "Rare" | "Epic" | "Legendary"

export interface FragmentSpawn {
  id: string
  lat: number
  lng: number
  fragment: Fragment
  rarity: Rarity
  name: string
  available: boolean
}

export const fragmentSpawns: FragmentSpawn[] = [
  { id: "1", lat: 42.8746, lng: 74.5698, fragment: "1", rarity: "Common", name: "Ошская — площадь Ала-Тоо", available: true },
  { id: "2", lat: 42.8796, lng: 74.6054, fragment: "2", rarity: "Rare", name: "ТРЦ Вефа Центр", available: true },
  { id: "3", lat: 42.8653, lng: 74.5847, fragment: "3", rarity: "Epic", name: "Дубовый парк", available: false },
  { id: "4", lat: 42.8432, lng: 74.5856, fragment: "1", rarity: "Legendary", name: "ТРЦ Асия Молл", available: true },
  { id: "5", lat: 42.8587, lng: 74.6169, fragment: "2", rarity: "Rare", name: "Парк имени Панфилова", available: true },
  { id: "6", lat: 42.8676, lng: 74.5874, fragment: "3", rarity: "Epic", name: "Технопарк", available: true },
]

export const fragmentColors: Record<Fragment, string> = {
  "1": "#3b82f6", 
  "2": "#8b5cf6", 
  "3": "#ec4899",
}

export const fragmentImages: Record<Fragment, string> = {
  "1": "/elements/shard-1.png",
  "2": "/elements/shard-2.png", 
  "3": "/elements/shard-3.png",
}

export const rarityColors: Record<Rarity, string> = {
  Common: "#9ca3af", Rare: "#3b82f6", Epic: "#a855f7", Legendary: "#f59e0b",
}

export default function MapPage() {
  const [selectedFragment, setSelectedFragment] = useState<FragmentSpawn | null>(null)
  const [hasGeolocation, setHasGeolocation] = useState<boolean | null>(null)
  const [isCheckingLocation, setIsCheckingLocation] = useState(true)

  useEffect(() => {
    // Проверяем доступность геолокации при загрузке страницы
    if (!navigator.geolocation) {
      setHasGeolocation(false)
      setIsCheckingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHasGeolocation(true)
        setIsCheckingLocation(false)
      },
      (error) => {
        console.error("Ошибка получения геолокации:", error)
        setHasGeolocation(false)
        setIsCheckingLocation(false)
      },
      { 
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }, [])

  const requestGeolocation = () => {
    setIsCheckingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHasGeolocation(true)
        setIsCheckingLocation(false)
      },
      (error) => {
        console.error("Ошибка получения геолокации:", error)
        setHasGeolocation(false)
        setIsCheckingLocation(false)
        alert("Не удалось получить доступ к геолокации. Пожалуйста, разрешите доступ в настройках браузера.")
      },
      { 
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  // Показываем экран запроса геолокации
  if (isCheckingLocation) {
    return (
      <div className="flex h-screen flex-col bg-black">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white px-6 max-w-md">
            <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 mx-auto" />
            <h2 className="text-2xl font-bold mb-4">Проверка геолокации</h2>
            <p className="text-gray-400">Пожалуйста, подождите...</p>
          </div>
        </div>
      </div>
    )
  }

  // Показываем экран ошибки, если геолокация недоступна
  if (hasGeolocation === false) {
    return (
      <div className="flex h-screen flex-col bg-black">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white px-6 max-w-md">
            <MapPinOff className="h-20 w-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Требуется геолокация</h2>
            <p className="text-gray-400 mb-6">
              Для использования карты необходимо разрешить доступ к вашей геолокации. 
              Это нужно для отображения осколков поблизости и возможности их сбора.
            </p>
            <Button 
              onClick={requestGeolocation}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Разрешить доступ к геолокации
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Если кнопка не работает, разрешите геолокацию в настройках браузера
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-black">
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-slide-down {
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .transition-smooth {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
      <SiteHeader />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 border-b border-white/10 bg-black/80 px-3 sm:px-6 py-2 sm:py-3 backdrop-blur-xl z-[1000] animate-slide-down">
        <h1 className="text-base sm:text-xl font-semibold text-white flex items-center gap-2">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          Карта осколков
        </h1>
      </div>
      
      <div className="relative flex-1">
        <MapComponent 
          selectedFragment={selectedFragment}
          setSelectedFragment={setSelectedFragment}
        />
        
        {selectedFragment && (
          <div className="absolute bottom-3 sm:bottom-6 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 w-auto sm:w-full sm:max-w-md rounded-2xl border border-white/10 bg-black/95 backdrop-blur-2xl p-4 sm:p-6 z-[1000] animate-slide-up shadow-2xl mx-auto">
            <button 
              onClick={() => setSelectedFragment(null)}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-400 hover:text-white transition-smooth hover:scale-110 touch-manipulation"
            >
              <X className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
            
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 pr-8 animate-fade-in">{selectedFragment.name}</h3>
            
            <div className="flex gap-2 mb-4 animate-fade-in flex-wrap" style={{ animationDelay: '0.1s' }}>
              <span 
                className="rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold text-white transition-smooth hover:scale-105"
                style={{ background: fragmentColors[selectedFragment.fragment] }}
              >
                Осколок {selectedFragment.fragment}
              </span>
              <span 
                className="rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold text-white transition-smooth hover:scale-105"
                style={{ background: rarityColors[selectedFragment.rarity] }}
              >
                {selectedFragment.rarity}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-300 animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{selectedFragment.lat.toFixed(4)}, {selectedFragment.lng.toFixed(4)}</span>
              </div>
              <div className="mt-3 rounded-lg bg-blue-500/10 border border-blue-500/20 p-2.5 sm:p-3 transition-smooth hover:bg-blue-500/15">
                <div className="text-xs text-blue-300 mb-1">Требования для чекина:</div>
                <div className="text-xs text-gray-400">• Радиус: 5 метров</div>
                <div className="text-xs text-gray-400">• Удержание: 3 секунды</div>
              </div>
            </div>
            
            {selectedFragment.available && (
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-smooth hover:scale-[1.02] animate-fade-in text-sm sm:text-base h-10 sm:h-11 touch-manipulation" style={{ animationDelay: '0.2s' }}>
                Начать чекин
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
