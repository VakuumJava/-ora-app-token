'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ChangeNicknamePage() {
  const router = useRouter()
  const [newNickname, setNewNickname] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  const checkNicknameAvailability = async (nickname: string) => {
    if (nickname.length < 3) {
      setIsAvailable(null)
      return
    }

    setCheckingAvailability(true)
    try {
      const response = await fetch(`/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`)
      const data = await response.json()
      setIsAvailable(data.available)
    } catch {
      setIsAvailable(null)
    } finally {
      setCheckingAvailability(false)
    }
  }

  const handleNicknameChange = (value: string) => {
    setNewNickname(value)
    setError('')
    
    // Debounce проверки доступности
    const timeoutId = setTimeout(() => {
      checkNicknameAvailability(value)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/user/change-nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newNickname }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка изменения никнейма')
      }

      // Успешно изменён
      router.push('/profile?nickname_changed=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка изменения никнейма')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-purple-500/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-blue-500/20 rounded-full blur-[140px]" />
      </div>

      <SiteHeader />

      <div className="pt-32 pb-20 relative z-10 px-6">
        <div className="max-w-md mx-auto">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад в профиль
          </Link>

          <div className="rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8">
            <h1 className="text-2xl font-bold text-white mb-6">Изменить никнейм</h1>

            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-950/30 border-red-500/30">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="newNickname" className="text-white mb-2 block">
                  Новый никнейм
                </Label>
                <Input
                  id="newNickname"
                  type="text"
                  value={newNickname}
                  onChange={(e) => handleNicknameChange(e.target.value)}
                  placeholder="nickname"
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_]+"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
                
                {checkingAvailability && (
                  <p className="text-xs text-white/50 mt-2">Проверка доступности...</p>
                )}
                
                {isAvailable === true && (
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <p className="text-xs text-green-400">Никнейм доступен</p>
                  </div>
                )}
                
                {isAvailable === false && (
                  <p className="text-xs text-red-400 mt-2">Никнейм уже занят</p>
                )}
              </div>

              <Alert className="bg-blue-500/10 border-blue-500/20">
                <AlertDescription className="text-blue-300 text-sm">
                  ⚠️ Ваш старый никнейм будет освобождён и станет доступным для других пользователей
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={isLoading || !isAvailable}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
              >
                {isLoading ? 'Изменение...' : 'Изменить никнейм'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
