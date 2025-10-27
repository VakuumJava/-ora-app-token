import Image from "next/image"
import { FadeIn } from "@/components/fade-in"

export function NFTFragmentsSection() {
  return (
    <section className="relative py-32">
      <div className="relative mx-auto max-w-7xl px-6">
        <FadeIn delay={0} duration={0.3}>
          <h2 
            className="text-center text-4xl font-bold text-white leading-tight mb-20"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            Собирайте частицы NFT чтобы
            <br />
            соединить в один целый
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} duration={0.3}>
          <div className="relative w-full flex items-center justify-center" style={{ minHeight: "500px" }}>
            <Image 
              src="/elements/Fragments.svg" 
              alt="NFT Fragments connecting together" 
              width={1200} 
              height={500}
              className="object-contain w-full h-auto"
              priority
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
