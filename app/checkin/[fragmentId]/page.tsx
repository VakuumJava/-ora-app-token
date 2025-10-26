"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { calculateDistance, isWithinRadius, isAccuracyValid } from "@/lib/geo-utils"
import { CHECK_IN_CONFIG } from "@/lib/check-in-config"

export default function CheckInPage() {
  const params = useParams()
  const router = useRouter()
  const fragmentId = params.fragmentId as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [checkInStatus, setCheckInStatus] = useState<"idle" | "holding" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [distance, setDistance] = useState<number | null>(null)

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  // Mock fragment data - in production this would come from API
  const fragment = {
    id: fragmentId,
    name: "Зал древностей (A)",
    chain: "Museum Chain",
    fragment: "A",
    lat: 42.8746,
    lng: 74.6122,
    rarity: "Rare",
  }

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMessage("Геолокация не поддерживается вашим браузером")
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        setUserLocation(newLocation)

        // Calculate distance to fragment
        const dist = calculateDistance(newLocation.lat, newLocation.lng, fragment.lat, fragment.lng)
        setDistance(dist)

        console.log("[v0] Location updated:", {
          userLat: newLocation.lat,
          userLng: newLocation.lng,
          accuracy: newLocation.accuracy,
          distance: dist,
        })
      },
      (error) => {
        console.error("[v0] Geolocation error:", error)
        setErrorMessage("Не удалось получить вашу локацию. Проверьте разрешения.")
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      },
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [fragment.lat, fragment.lng])

  // Start check-in with 3-second hold
  const startCheckIn = () => {
    if (!userLocation) {
      setErrorMessage("Ожидание геолокации...")
      return
    }

    // Validate GPS accuracy
    if (!isAccuracyValid(userLocation.accuracy, CHECK_IN_CONFIG.MAX_GPS_ACCURACY_METERS)) {
      setErrorMessage(
        `GPS точность слишком низкая (${userLocation.accuracy.toFixed(1)}м). Требуется ≤${CHECK_IN_CONFIG.MAX_GPS_ACCURACY_METERS}м`,
      )
      setCheckInStatus("error")
      return
    }

    // Check if within radius
    if (
      !isWithinRadius(userLocation.lat, userLocation.lng, fragment.lat, fragment.lng, CHECK_IN_CONFIG.RADIUS_METERS)
    ) {
      setErrorMessage(
        `Вы слишком далеко (${distance?.toFixed(1)}м). Подойдите ближе к точке (≤${CHECK_IN_CONFIG.RADIUS_METERS}м)`,
      )
      setCheckInStatus("error")
      return
    }

    console.log("[v0] Starting check-in hold timer")
    setIsChecking(true)
    setCheckInStatus("holding")
    setHoldProgress(0)
    setErrorMessage("")

    // Progress animation
    const startTime = Date.now()
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / CHECK_IN_CONFIG.HOLD_DURATION_MS) * 100, 100)
      setHoldProgress(progress)
    }, 50)

    // Hold timer
    holdTimerRef.current = setTimeout(() => {
      completeCheckIn()
    }, CHECK_IN_CONFIG.HOLD_DURATION_MS)
  }

  // Cancel check-in
  const cancelCheckIn = () => {
    console.log("[v0] Check-in cancelled")
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
    setIsChecking(false)
    setCheckInStatus("idle")
    setHoldProgress(0)
  }

  // Complete check-in
  const completeCheckIn = () => {
    console.log("[v0] Check-in completed successfully")
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
    setCheckInStatus("success")
    setHoldProgress(100)
    setIsChecking(false)

    // Redirect to inventory after 2 seconds
    setTimeout(() => {
      router.push("/inventory")
    }, 2000)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current)
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  const canCheckIn =
    userLocation &&
    distance !== null &&
    distance <= CHECK_IN_CONFIG.RADIUS_METERS &&
    userLocation.accuracy <= CHECK_IN_CONFIG.MAX_GPS_ACCURACY_METERS

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Проверка авторизации...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 bg-black/80 px-6 py-4 backdrop-blur-sm">
        <Link href="/map" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="black">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">qora</span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Fragment Info */}
          <div className="mb-8 text-center">
            <div className="mb-2 text-sm text-gray-400">{fragment.chain}</div>
            <h1 className="mb-2 text-3xl font-bold text-white">{fragment.name}</h1>
            <div className="inline-flex items-center gap-2">
              <span className="rounded-full bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 text-xs font-bold text-white">
                Фрагмент {fragment.fragment}
              </span>
              <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                {fragment.rarity}
              </span>
            </div>
          </div>

          {/* Location Status */}
          <div className="mb-6 space-y-3 rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Расстояние до точки</span>
              <span className={`text-lg font-bold ${canCheckIn ? "text-green-400" : "text-yellow-400"}`}>
                {distance !== null ? `${distance.toFixed(1)}м` : "..."}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Точность GPS</span>
              <span
                className={`text-lg font-bold ${userLocation && userLocation.accuracy <= CHECK_IN_CONFIG.MAX_GPS_ACCURACY_METERS ? "text-green-400" : "text-yellow-400"}`}
              >
                {userLocation ? `${userLocation.accuracy.toFixed(1)}м` : "..."}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Требуемый радиус</span>
              <span className="text-lg font-bold text-blue-400">≤{CHECK_IN_CONFIG.RADIUS_METERS}м</span>
            </div>
          </div>

          {/* Check-in Button */}
          {checkInStatus === "idle" && (
            <div className="space-y-4">
              {canCheckIn ? (
                <Button
                  onClick={startCheckIn}
                  className="w-full h-16 text-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Начать чекин (удерживать 3 сек)
                </Button>
              ) : (
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-yellow-400 mb-1">Подойдите ближе</div>
                      <div className="text-xs text-gray-400">
                        {distance !== null &&
                          distance > CHECK_IN_CONFIG.RADIUS_METERS &&
                          `Вы находитесь в ${distance.toFixed(1)}м от точки. Нужно подойти на ${CHECK_IN_CONFIG.RADIUS_METERS}м или ближе.`}
                        {userLocation &&
                          userLocation.accuracy > CHECK_IN_CONFIG.MAX_GPS_ACCURACY_METERS &&
                          ` Точность GPS: ${userLocation.accuracy.toFixed(1)}м (требуется ≤${CHECK_IN_CONFIG.MAX_GPS_ACCURACY_METERS}м).`}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Holding State */}
          {checkInStatus === "holding" && (
            <div className="space-y-4">
              <div className="relative">
                <div className="h-24 w-full overflow-hidden rounded-2xl border border-blue-500 bg-blue-500/10">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-100"
                    style={{ width: `${holdProgress}%` }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-white" />
                    <div className="text-lg font-bold text-white">Удерживайте...</div>
                    <div className="text-sm text-gray-300">{((holdProgress / 100) * 3).toFixed(1)} / 3.0 сек</div>
                  </div>
                </div>
              </div>

              <Button
                onClick={cancelCheckIn}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Отменить
              </Button>
            </div>
          )}

          {/* Success State */}
          {checkInStatus === "success" && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-400" />
              <h2 className="mb-2 text-2xl font-bold text-white">Фрагмент получен!</h2>
              <p className="text-gray-400">Перенаправление в инвентарь...</p>
            </div>
          )}

          {/* Error State */}
          {checkInStatus === "error" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="mb-1 font-bold text-white">Чекин не удался</h3>
                    <p className="text-sm text-gray-400">{errorMessage}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setCheckInStatus("idle")}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
              >
                Попробовать снова
              </Button>
            </div>
          )}

          {/* Back to Map */}
          <Link href="/map">
            <Button variant="ghost" className="mt-6 w-full text-gray-400 hover:text-white">
              <Navigation className="mr-2 h-4 w-4" />
              Вернуться на карту
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
