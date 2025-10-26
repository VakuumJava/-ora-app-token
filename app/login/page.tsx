"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CosmicBackground } from "@/components/cosmic-background"
import { ArrowLeft, CheckCircle } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [identifier, setIdentifier] = useState("") // email или nickname
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    // Проверяем параметры URL
    const verified = searchParams.get('verified')
    const errorParam = searchParams.get('error')

    if (verified === 'true') {
      setSuccessMessage('✅ Email успешно подтверждён! Теперь вы можете войти.')
    } else if (errorParam === 'invalid_token') {
      setError('Недействительная ссылка подтверждения')
    } else if (errorParam === 'token_expired') {
      setError('Ссылка подтверждения истекла')
    } else if (errorParam === 'verification_failed') {
      setError('Ошибка при подтверждении email')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier, // email или nickname
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка входа")
      }

      // Успешный вход! Токены автоматически сохранены в cookies
      router.push("/")
      router.refresh()
    } catch (err) {
      let errorMessage = "Ошибка входа"
      if (err instanceof Error) {
        if (err.message.includes("Invalid") || err.message.includes("not found")) {
          errorMessage = "Неверный email/nickname или пароль"
        } else {
          errorMessage = err.message
        }
      }
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Отблики для глубины */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#7FA0E3]/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-20 w-80 h-80 bg-[#A3C4F3]/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-32 left-1/3 w-96 h-96 bg-[#7FA0E3]/6 rounded-full blur-[130px]" />
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
            <CardTitle className="text-xl text-white">Вход</CardTitle>
            <CardDescription className="text-zinc-400 text-sm">Войдите в свой аккаунт</CardDescription>
          </CardHeader>
          <CardContent>
            {successMessage && (
              <Alert className="mb-4 backdrop-blur-md bg-green-950/30 border-green-500/30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-sm text-green-300">{successMessage}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="mb-4 backdrop-blur-md bg-red-950/30 border-red-500/30">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-zinc-300 text-sm">
                  Email или Nickname
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="your@email.com или username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="backdrop-blur-md bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-10 focus:border-white/30 focus:bg-white/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300 text-sm">
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="backdrop-blur-md bg-white/5 border-white/10 text-white placeholder:text-zinc-500 h-10 focus:border-white/30 focus:bg-white/10"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-zinc-200 h-10 font-medium"
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>

            <p className="text-center text-xs text-zinc-500 mt-6">
              Нет аккаунта?{" "}
              <Link href="/register" className="text-white hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Загрузка...</div>}>
      <LoginForm />
    </Suspense>
  )
}
