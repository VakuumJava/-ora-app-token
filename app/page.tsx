'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SiteHeader } from "@/components/site-header"
import { CosmicBackground } from "@/components/cosmic-background"
import { BackgroundGradients } from "@/components/background-gradients"
import { ParticlesBackground } from "@/components/particles-background"
import { HeroSection } from "@/components/hero-section"
import { NFTCardsShowcase } from "@/components/nft-cards-showcase"
import { HowItWorks } from "@/components/how-it-works"
import { NFTFragmentsSection } from "@/components/nft-fragments-section"
import { FeaturesSection } from "@/components/features-section"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Footer } from "@/components/footer"
import { IntroAnimation } from "@/components/intro-animation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

function HomePageContent() {
  const searchParams = useSearchParams()
  const [showIntro, setShowIntro] = useState(true)
  const [hasVisited, setHasVisited] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showVerifiedAlert, setShowVerifiedAlert] = useState(false)

  useEffect(() => {
    // Проверяем параметр email_verified
    const emailVerified = searchParams.get('email_verified')
    if (emailVerified === 'true') {
      setShowVerifiedAlert(true)
      // Скрываем уведомление через 10 секунд
      setTimeout(() => setShowVerifiedAlert(false), 10000)
      
      // Очищаем URL от параметра
      window.history.replaceState({}, '', '/')
    }

    // Проверяем, был ли пользователь на сайте
    const visited = sessionStorage.getItem('hasVisitedThisSession')
    if (visited) {
      setShowIntro(false)
      setHasVisited(true)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  const handleIntroComplete = () => {
    sessionStorage.setItem('hasVisitedThisSession', 'true')
    setShowIntro(false)
    setHasVisited(true)
  }

  // Ждем проверки sessionStorage перед показом
  if (isLoading) {
    return null
  }

  if (showIntro && !hasVisited) {
    return <IntroAnimation onComplete={handleIntroComplete} />
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmic animated background */}
      <CosmicBackground />

      {/* White moving particles */}
      <ParticlesBackground />

      {/* Background gradient blurs - atmospheric effect */}
      <BackgroundGradients />

      {/* Header */}
      <SiteHeader />

      {/* Уведомление об успешной верификации email */}
      {showVerifiedAlert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-top duration-500">
          <Alert className="backdrop-blur-xl bg-gradient-to-r from-green-950/90 to-emerald-950/90 border-2 border-green-500/50 shadow-2xl shadow-green-500/20">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <AlertDescription className="text-green-100 font-medium ml-2">
              🎉 Email успешно подтверждён! Добро пожаловать в Qora NFT!
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20">
        <HeroSection />
        <NFTCardsShowcase />
        <HowItWorks />
        <NFTFragmentsSection />
        <FeaturesSection />
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomePageContent />
    </Suspense>
  )
}
