"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CosmicBackground } from "@/components/cosmic-background"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)
  const [nicknameStatus, setNicknameStatus] = useState<{
    available: boolean | null
    message: string
  }>({ available: null, message: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Проверка доступности никнейма в реальном времени
  useEffect(() => {
    const checkNickname = async () => {
      const nickname = formData.nickname.trim()

      // Сбрасываем статус если поле пустое или слишком короткое
      if (nickname.length < 3) {
        setNicknameStatus({ available: null, message: "" })
        return
      }

      setIsCheckingNickname(true)

      try {
        const response = await fetch(
          `/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`
        )
        const data = await response.json()

        setNicknameStatus({
          available: data.available,
          message: data.message || "",
        })
      } catch (error) {
        console.error("Error checking nickname:", error)
        setNicknameStatus({
          available: null,
          message: "Ошибка проверки nickname",
        })
      } finally {
        setIsCheckingNickname(false)
      }
    }

    // Дебаунсинг: проверяем только через 500мс после последнего изменения
    const timeoutId = setTimeout(checkNickname, 500)

    return () => clearTimeout(timeoutId)
  }, [formData.nickname])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}
    
    // Проверка nickname
    if (formData.nickname.length < 3) {
      newErrors.nickname = "Минимум 3 символа"
    }
    if (!nicknameStatus.available) {
      newErrors.nickname = nicknameStatus.message || "Nickname недоступен"
    }
    
    // Проверка пароля
    if (formData.password.length < 6) {
      newErrors.password = "Минимум 6 символов"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      // Отправляем запрос на наш API endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          nickname: formData.nickname,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Обработка ошибок от API
        if (data.error.includes('already exists') || data.error.includes('уже существует')) {
          if (data.error.toLowerCase().includes('email')) {
            throw new Error("Этот email уже зарегистрирован")
          } else if (data.error.toLowerCase().includes('nickname')) {
            throw new Error(`Nickname "${formData.nickname}" уже занят`)
          }
        }
        throw new Error(data.error || "Ошибка регистрации")
      }

      // Успешная регистрация! Токены автоматически сохранены в cookies
      // Перенаправляем на главную страницу
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("Registration error:", err)
      setErrors({ 
        general: err instanceof Error ? err.message : "Ошибка регистрации" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Отблики для глубины */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#A3C4F3]/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-[#7FA0E3]/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7FA0E3]/6 rounded-full blur-[130px]" />
      </div>

      <CosmicBackground />

      <div className="relative z-10 w-full max-w-sm">
        {/* Кнопка назад */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Назад
          </span>
        </button>

        <Link href="/" className="flex justify-center mb-8">
          <span className="text-2xl font-bold text-white tracking-wider">QORA</span>
        </Link>

        <Card className="backdrop-blur-lg bg-white/5 border-white/10 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl text-white">Регистрация</CardTitle>
            <CardDescription className="text-zinc-400 text-sm">Создайте новый аккаунт</CardDescription>
          </CardHeader>
          <CardContent>
            {errors.general && (
              <Alert variant="destructive" className="mb-4 backdrop-blur-md bg-red-950/30 border-red-500/30">
                <AlertDescription className="text-sm">{errors.general}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleRegister} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="nickname" className="text-zinc-300 text-sm">
                  Никнейм
                </Label>
                <div className="relative">
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="username"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className={`backdrop-blur-md bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-10 focus:border-white/30 focus:bg-white/10 ${
                      nicknameStatus.available === true
                        ? "border-green-500/50"
                        : nicknameStatus.available === false
                          ? "border-red-500/50"
                          : ""
                    }`}
                    required
                    minLength={3}
                    maxLength={20}
                  />
                  {isCheckingNickname && (
                    <span className="absolute right-3 top-2.5 text-zinc-400 text-xs">
                      Проверка...
                    </span>
                  )}
                </div>
                {nicknameStatus.available === true && (
                  <p className="text-green-400 text-xs">✓ Nickname доступен</p>
                )}
                {nicknameStatus.available === false && (
                  <p className="text-red-400 text-xs">✗ {nicknameStatus.message}</p>
                )}
                {errors.nickname && <p className="text-red-400 text-xs">{errors.nickname}</p>}
                <p className="text-zinc-500 text-xs">
                  3-20 символов, только буквы, цифры и _
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-zinc-300 text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="backdrop-blur-md bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-10 focus:border-white/30 focus:bg-white/10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-zinc-300 text-sm">
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="backdrop-blur-md bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-10 focus:border-white/30 focus:bg-white/10"
                  required
                />
                {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-zinc-300 text-sm">
                  Подтвердите пароль
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="backdrop-blur-md bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-10 focus:border-white/30 focus:bg-white/10"
                  required
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading || isCheckingNickname || nicknameStatus.available === false}
                className="w-full bg-white text-black hover:bg-zinc-200 h-10 font-medium mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>

            <p className="text-center text-xs text-zinc-500 mt-6">
              Уже есть аккаунт?{" "}
              <Link href="/login" className="text-white hover:underline">
                Войти
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
