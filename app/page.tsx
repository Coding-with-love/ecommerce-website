import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductGallery from "@/components/product-gallery"
import FeaturedCollection from "@/components/featured-collection"
import TestimonialSection from "@/components/testimonial-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6438.JPG-qUJDAPNydBSNzZBaopSenrUnw0864C.jpeg"
            alt="Elegant abaya"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-start text-left max-w-5xl mx-auto">
          <div className="w-full md:max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight text-white">
              <span className="block">Elegance in</span>
              <span className="block font-normal">Modesty</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
              Discover our exquisite collection of handcrafted abayas, where timeless tradition meets contemporary
              design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-none px-8 transition-all duration-300 ease-in-out"
              >
                <Link href="#collection">Explore Collection</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white bg-black/40 hover:bg-white hover:text-black rounded-none px-8 transition-all duration-300 ease-in-out"
              >
                <Link href="#contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10 animate-bounce">
          <Link href="#collection" className="text-white/80 hover:text-white">
            <ArrowRight className="h-8 w-8 rotate-90" />
            <span className="sr-only">Scroll down</span>
          </Link>
        </div>
      </section>

      {/* Collection Intro */}
      <section id="collection" className="py-24 md:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-6 tracking-tight">Our Collection</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Each piece in our collection is meticulously crafted with attention to detail, using premium fabrics and
              exquisite embellishments to create garments that are both modest and fashion-forward.
            </p>
          </div>
          <ProductGallery />
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 md:py-32 bg-neutral-50">
        <FeaturedCollection />
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-5xl font-serif mb-6 tracking-tight">Exquisite Craftsmanship</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  At Modest Threads, we believe that true luxury lies in the details. Each of our abayas is a testament
                  to the skill and dedication of our artisans.
                </p>
                <p className="text-lg leading-relaxed">
                  From intricate hand embroidery to carefully placed beadwork, every element is thoughtfully designed
                  and meticulously executed to create garments of exceptional quality.
                </p>
                <p className="text-lg leading-relaxed">
                  We source only the finest fabrics that drape beautifully and ensure comfort throughout the day, making
                  our pieces as practical as they are elegant.
                </p>
              </div>
              <div className="mt-8">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-none px-8 border-black text-black hover:bg-black hover:text-white"
                >
                  <Link href="#contact">Inquire About Custom Orders</Link>
                </Button>
              </div>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="aspect-square relative rounded-none overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6437.JPG-V2FQd1AGJdxam1FzUpYwz4FPXcGyWW.jpeg"
                  alt="Detailed abaya embroidery"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-2/3 aspect-square bg-olive-100 -z-10"></div>
              <div className="absolute -top-6 -right-6 w-1/3 aspect-square bg-olive-200 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-olive-900 text-white">
        <TestimonialSection />
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-32 bg-white">
        <ContactSection />
      </section>
    </div>
  )
}

