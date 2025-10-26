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

export default function HomePage() {
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
