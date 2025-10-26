'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ChangeEmailPage() {
  const router = useRouter()
  const [newEmail, setNewEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/user/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка изменения email')
      }

      // Перенаправляем на страницу проверки почты
      router.push('/auth/check-email')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка изменения email')
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
            <h1 className="text-2xl font-bold text-white mb-6">Изменить email</h1>

            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-950/30 border-red-500/30">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="newEmail" className="text-white mb-2 block">
                  Новый email
                </Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new@example.com"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <Alert className="bg-blue-500/10 border-blue-500/20">
                <AlertDescription className="text-blue-300 text-sm">
                  📧 На новый email будет отправлено письмо с подтверждением. Ваш старый email будет освобождён после подтверждения нового.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
              >
                {isLoading ? 'Отправка...' : 'Изменить email'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
