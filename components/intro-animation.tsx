'use client'

import { useState, useEffect } from 'react'

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [text, setText] = useState('')
  const [isDissolving, setIsDissolving] = useState(false)
  const fullText = 'Простая игра...\nНо цифровизация'
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Небольшая задержка перед началом анимации для полной загрузки
    const readyTimer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(readyTimer)
  }, [])

  useEffect(() => {
    if (!isReady) return

    let currentIndex = 0
    const typingSpeed = 80 // миллисекунды на символ

    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typeInterval)
        // Начинаем растворение через 1 секунду после окончания печати
        setTimeout(() => {
          setIsDissolving(true)
          // Завершаем анимацию через 1.5 секунды после начала растворения
          setTimeout(onComplete, 1500)
        }, 1000)
      }
    }, typingSpeed)

    return () => clearInterval(typeInterval)
  }, [fullText, onComplete, isReady])

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden">
      {/* Звезды на фоне - спиральная анимация от центра */}
      {isDissolving && (
        <div className="absolute inset-0">
          {Array.from({ length: 150 }).map((_, i) => {
            const angle = (i / 150) * Math.PI * 12 // 6 витков спирали
            const distance = (i / 150) * 120 // Расстояние от центра
            const offsetX = Math.cos(angle) * distance
            const offsetY = Math.sin(angle) * distance
            
            return (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-spiral-star"
                style={{
                  left: '50%',
                  top: '60%',
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animationDuration: `${1.2 + (i / 150) * 0.8}s`,
                  animationDelay: `${(i / 150) * 0.4}s`,
                  opacity: 0,
                  '--spiral-x': `${offsetX}vw`,
                  '--spiral-y': `${offsetY}vh`,
                } as React.CSSProperties & { '--spiral-x': string; '--spiral-y': string }}
              />
            )
          })}
        </div>
      )}

      {/* Текст */}
      <div className="relative z-10 px-8">
        <h1
          className={`text-2xl md:text-3xl lg:text-4xl font-normal text-white text-center whitespace-pre-line transition-all duration-1000 ${
            isDissolving ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-0'
          }`}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 400,
            textShadow: isDissolving
              ? '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.5)'
              : '0 0 20px rgba(255,255,255,0.3)',
          }}
        >
          {text}
          <span className="animate-pulse">|</span>
        </h1>
      </div>

      <style jsx>{`
        @keyframes spiral-star {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(var(--spiral-x) - 50%), calc(var(--spiral-y) - 50%)) scale(1);
            opacity: 0.9;
          }
        }

        .animate-spiral-star {
          animation: spiral-star ease-out forwards;
        }
      `}</style>
    </div>
  )
}
