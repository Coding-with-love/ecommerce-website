"use client"

import { ArrowDown } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function CollectionHero() {
  const scrollToGallery = () => {
    document.getElementById("collection-gallery")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-olive-900/90 to-olive-900/70 z-0"></div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-olive-200/10 rounded-full blur-3xl"></div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm text-white text-xs uppercase tracking-wider rounded-full mb-6">
              Discover Our Latest Pieces
            </span>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight text-white">Our Collection</h1>
            <div className="w-24 h-1 bg-olive-300 mb-8"></div>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
              Each piece in our collection is meticulously crafted with attention to detail, using premium fabrics and
              exquisite embellishments to create garments that are both modest and fashion-forward.
            </p>
          </div>

          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm group"
              onClick={scrollToGallery}
            >
              Explore Collection
              <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white">
        <svg className="absolute -top-16 w-full h-16 text-white fill-current" viewBox="0 0 1440 54">
          <path d="M0 22L60 16.7C120 11 240 1 360 0C480 0 600 11 720 16.7C840 22 960 22 1080 16.7C1200 11 1320 0 1380 -5.3L1440 -11V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z"></path>
        </svg>
      </div>
    </section>
  )
}
