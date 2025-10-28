"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, X, Loader2 } from "lucide-react"
import type { FragmentSpawn } from "@/app/map/page"
import { calculateDistance } from "@/lib/geo-utils"

interface CheckinModalProps {
  fragment: FragmentSpawn
  userLocation: [number, number] | null
  onClose: () => void
  onSuccess: () => void
}

export function CheckinModal({ fragment, userLocation, onClose, onSuccess }: CheckinModalProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [error, setError] = useState("")
  const [distance, setDistance] = useState<number | null>(null)
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (userLocation) {
      const dist = calculateDistance(
        userLocation[0],
        userLocation[1],
        fragment.lat,
        fragment.lng
      )
      setDistance(dist)
    }
  }, [userLocation, fragment])

  const startCheckin = async () => {
    if (!userLocation) {
      setError("Не удалось получить вашу геолокацию")
      return
    }

    const dist = calculateDistance(
      userLocation[0],
      userLocation[1],
      fragment.lat,
      fragment.lng
    )

    const requiredRadius = fragment.radius || 5
    if (dist > requiredRadius) {
      setError(`Вы слишком далеко! Подойдите ближе на ${Math.round(dist - requiredRadius)}м`)
      return
    }

    setIsChecking(true)
    setError("")
    setHoldProgress(0)

    // Прогресс бар (3 секунды)
    const startTime = Date.now()
    const holdDuration = 3000

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / holdDuration) * 100, 100)
      setHoldProgress(progress)
    }, 50)

    holdTimerRef.current = setTimeout(async () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      
      // Выполняем чекин
      try {
        const response = await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            spawnPointId: fragment.id,
            userLat: userLocation[0],
            userLng: userLocation[1],
            accuracy: 10 // TODO: получать реальную точность GPS
          })
        })

        const data = await response.json()

        if (response.ok) {
          onSuccess()
        } else {
          setError(data.message || data.error || 'Ошибка чекина')
          setIsChecking(false)
          setHoldProgress(0)
        }
      } catch (err) {
        setError('Ошибка сети')
        setIsChecking(false)
        setHoldProgress(0)
      }
    }, holdDuration)
  }

  const cancelCheckin = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    setIsChecking(false)
    setHoldProgress(0)
  }

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [])

  const requiredRadius = fragment.radius || 5
  const isInRange = distance !== null && distance <= requiredRadius

  return (
    <div className="absolute bottom-3 sm:bottom-6 left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 w-auto sm:w-full sm:max-w-md rounded-2xl border border-white/10 bg-black/95 backdrop-blur-2xl p-4 sm:p-6 z-[1000] animate-slide-up shadow-2xl mx-auto">
      <button 
        onClick={onClose}
        className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-400 hover:text-white transition-smooth hover:scale-110 touch-manipulation"
      >
        <X className="h-5 w-5 sm:h-4 sm:w-4" />
      </button>
      
      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 pr-8 animate-fade-in">
        {fragment.name}
      </h3>
      
      <div className="space-y-3">
        {distance !== null && (
          <div className={`p-3 rounded-lg border ${
            isInRange 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-orange-500/10 border-orange-500/30'
          }`}>
            <div className="flex items-center gap-2">
              <MapPin className={`h-4 w-4 ${isInRange ? 'text-green-400' : 'text-orange-400'}`} />
              <span className={`text-sm font-medium ${isInRange ? 'text-green-300' : 'text-orange-300'}`}>
                Расстояние: {distance.toFixed(1)}м
              </span>
            </div>
            {!isInRange && (
              <p className="text-xs text-gray-400 mt-1">
                Требуется: {requiredRadius}м
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {isChecking && (
          <div className="space-y-2">
            <p className="text-sm text-gray-300 text-center">
              Удерживайте позицию...
            </p>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-100"
                style={{ width: `${holdProgress}%` }}
              />
            </div>
          </div>
        )}

        {!isChecking ? (
          <Button
            onClick={startCheckin}
            disabled={!isInRange || !userLocation}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!userLocation ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Определение местоположения...
              </>
            ) : !isInRange ? (
              "Подойдите ближе"
            ) : (
              "Начать чекин"
            )}
          </Button>
        ) : (
          <Button
            onClick={cancelCheckin}
            variant="outline"
            className="w-full border-red-500/50 text-red-300 hover:bg-red-500/10"
          >
            Отменить
          </Button>
        )}
      </div>
    </div>
  )
}
