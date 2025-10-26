'use client'

import { useState, useEffect } from 'react'
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

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true)
  const [hasVisited, setHasVisited] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем, был ли пользователь на сайте
    const visited = sessionStorage.getItem('hasVisitedThisSession')
    if (visited) {
      setShowIntro(false)
      setHasVisited(true)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [])

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
