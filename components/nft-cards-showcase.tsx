import Image from "next/image"
import { FadeIn } from "@/components/fade-in"

export function NFTCardsShowcase() {
  return (
    <FadeIn delay={0} duration={0.3}>
      <div className="relative w-full mx-auto px-4 sm:px-6">
        <div className="relative w-full flex items-center justify-center" style={{ minHeight: "150px" }}>
          <Image 
            src="/cards/Initial Cards.svg" 
            alt="NFT Cards Collection" 
            width={1400} 
            height={200}
            className="object-contain w-full h-auto max-w-full"
            style={{ opacity: 1 }}
            priority
          />
        </div>
      </div>
    </FadeIn>
  )
}
