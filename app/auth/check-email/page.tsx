import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[2px] w-[2px] animate-pulse rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">📧 Проверьте почту</h1>
          <p className="text-zinc-400 mb-6">
            Мы отправили письмо с подтверждением на вашу почту. Пожалуйста, перейдите по ссылке в письме, чтобы
            активировать аккаунт.
          </p>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 text-left">
            <p className="text-blue-400 text-sm font-medium mb-2">⚠️ Важно:</p>
            <p className="text-blue-400/80 text-xs mb-2">
              • Проверьте папку "Спам" или "Промоакции"
            </p>
            <p className="text-blue-400/80 text-xs mb-2">
              • Письмо приходит с адреса: onboarding@resend.dev
            </p>
            <p className="text-blue-400/80 text-xs">
              • Ссылка действительна в течение 24 часов
            </p>
          </div>

          <Link href="/login">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium h-12">
              Вернуться к входу
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}