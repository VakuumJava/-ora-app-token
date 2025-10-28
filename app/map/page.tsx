"use client"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { MapPin, X, MapPinOff } from "lucide-react"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { CheckinModal } from "@/components/checkin-modal"

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

type Fragment = "A" | "B" | "C"
type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary"

export interface FragmentSpawn {
  id: string
  lat: number
  lng: number
  fragment: Fragment
  rarity: Rarity
  name: string
  available: boolean
  radius?: number
  shardId: string
  imageUrl?: string
}

export const fragmentSpawns: FragmentSpawn[] = []

export const fragmentColors: Record<Fragment, string> = {
  "A": "#3b82f6", 
  "B": "#8b5cf6", 
  "C": "#ec4899",
}

export const fragmentImages: Record<Fragment, string> = {
  "A": "/elements/shard-1.png",
  "B": "/elements/shard-2.png", 
  "C": "/elements/shard-3.png",
}

export const rarityColors: Record<Rarity, string> = {
  common: "#9ca3af",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#f59e0b",
}

export default function MapPage() {
  const [selectedFragment, setSelectedFragment] = useState<FragmentSpawn | null>(null)
  const [hasGeolocation, setHasGeolocation] = useState<boolean | null>(null)
  const [isCheckingLocation, setIsCheckingLocation] = useState(true)
  const [locationError, setLocationError] = useState<string>("")
  const [spawnPoints, setSpawnPoints] = useState<FragmentSpawn[]>([])
  const [isLoadingSpawns, setIsLoadingSpawns] = useState(true)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [showCheckinModal, setShowCheckinModal] = useState(false)

  // Загружаем точки спавна из API
  useEffect(() => {
    async function loadSpawnPoints() {
      try {
        const response = await fetch('/api/spawn-points')
        if (response.ok) {
          const data = await response.json()
          setSpawnPoints(data)
        }
      } catch (error) {
        console.error('Error loading spawn points:', error)
      } finally {
        setIsLoadingSpawns(false)
      }
    }
    
    loadSpawnPoints()
  }, [])

  useEffect(() => {
    // Проверяем доступность геолокации при загрузке страницы
    if (!navigator.geolocation) {
      setHasGeolocation(false)
      setIsCheckingLocation(false)
      setLocationError("Ваш браузер не поддерживает геолокацию")
      return
    }

    // Запрашиваем геолокацию с увеличенным таймаутом
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Геолокация получена:", position.coords)
        setUserLocation([position.coords.latitude, position.coords.longitude])
        setHasGeolocation(true)
        setIsCheckingLocation(false)
        setLocationError("")
      },
      (error) => {
        console.error("Ошибка получения геолокации:", error)
        setHasGeolocation(false)
        setIsCheckingLocation(false)
        
        // Детальное сообщение об ошибке
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Вы отклонили запрос на доступ к геолокации")
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError("Информация о местоположении недоступна")
            break
          case error.TIMEOUT:
            setLocationError("Превышено время ожидания запроса геолокации")
            break
          default:
            setLocationError("Произошла неизвестная ошибка при получении геолокации")
        }
      },
      { 
        enableHighAccuracy: false,
        timeout: 15000, // Увеличен таймаут до 15 секунд
        maximumAge: 30000 // Разрешаем использовать кешированное значение
      }
    )
  }, [])

  const requestGeolocation = () => {
    setIsCheckingLocation(true)
    setLocationError("")
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Геолокация получена:", position.coords)
        setUserLocation([position.coords.latitude, position.coords.longitude])
        setHasGeolocation(true)
        setIsCheckingLocation(false)
        setLocationError("")
      },
      (error) => {
        console.error("Ошибка получения геолокации:", error)
        setIsCheckingLocation(false)
        
        // Детальное сообщение об ошибке
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Вы отклонили запрос на доступ к геолокации. Разрешите доступ в настройках браузера.")
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError("Не удалось определить ваше местоположение. Проверьте настройки GPS.")
            break
          case error.TIMEOUT:
            setLocationError("Превышено время ожидания. Попробуйте еще раз.")
            break
          default:
            setLocationError("Произошла ошибка при получении геолокации. Попробуйте еще раз.")
        }
      },
      { 
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 30000
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
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-white px-6 max-w-md">
            <MapPinOff className="h-20 w-20 text-red-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold mb-4">Требуется геолокация</h2>
            <p className="text-gray-400 mb-4">
              Для использования карты необходимо разрешить доступ к вашей геолокации. 
              Это нужно для отображения осколков поблизости и возможности их сбора.
            </p>
            
            {locationError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{locationError}</p>
              </div>
            )}
            
            <Button 
              onClick={requestGeolocation}
              disabled={isCheckingLocation}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingLocation ? (
                <>
                  <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Ожидание...
                </>
              ) : (
                <>
                  <MapPin className="h-5 w-5 mr-2" />
                  Разрешить доступ к геолокации
                </>
              )}
            </Button>
            
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-left">
              <p className="text-xs text-blue-300 font-semibold mb-2">💡 Как разрешить геолокацию:</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Safari: Настройки → Safari → Геолокация</li>
                <li>• Chrome: Настройки → Конфиденциальность → Геоданные</li>
                <li>• Firefox: Настройки → Приватность → Разрешения</li>
              </ul>
            </div>
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
          spawnPoints={spawnPoints}
          isLoadingSpawns={isLoadingSpawns}
          userLocation={userLocation}
        />
        
        {selectedFragment && showCheckinModal && (
          <CheckinModal
            fragment={selectedFragment}
            userLocation={userLocation}
            onClose={() => {
              setSelectedFragment(null)
              setShowCheckinModal(false)
            }}
            onSuccess={() => {
              setShowCheckinModal(false)
              setSelectedFragment(null)
              // Перезагружаем точки спавна
              fetch('/api/spawn-points')
                .then(res => res.json())
                .then(data => setSpawnPoints(data))
                .catch(console.error)
            }}
          />
        )}
        
        {selectedFragment && !showCheckinModal && (
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
              <Button 
                onClick={() => setShowCheckinModal(true)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-smooth hover:scale-[1.02] animate-fade-in text-sm sm:text-base h-10 sm:h-11 touch-manipulation" 
                style={{ animationDelay: '0.2s' }}
              >
                Начать чекин
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
