import Image from "next/image"
import { FadeIn } from "@/components/fade-in"

export function NFTCardsShowcase() {
  return (
    <FadeIn delay={0.3} duration={0.8}>
      <div className="relative w-full mx-auto px-6">
        <div className="relative w-full flex items-center justify-center" style={{ minHeight: "200px" }}>
          <Image 
            src="/cards/Initial Cards.svg" 
            alt="NFT Cards Collection" 
            width={1400} 
            height={200}
            className="object-contain w-full h-auto"
            style={{ opacity: 1 }}
            priority
          />
        </div>
      </div>
    </FadeIn>
  )
}
