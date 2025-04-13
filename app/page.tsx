import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductGallery from "@/components/product-gallery"
import { getProducts } from "./actions/product-actions"
import FeaturedCollection from "@/components/featured-collection"

export default async function Home() {
  // Fetch products
  const response = await getProducts({ limit: 10 })
  const products = response.success ? response.data : []

  // Filter for featured products for the featured section
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center bg-olive-900 overflow-hidden">
        {/* Background pattern and gradient */}
        <div className="absolute inset-0 z-0">
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bTAtMTZjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bTE2IDE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0tMTYgMGMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtLTE2IDBjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bTE2LTE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0tMTYgMGMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtLTE2IDBjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')]"></div>

          {/* Radial gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-olive-900/80 via-olive-900 to-olive-900/90"></div>

          {/* Subtle light effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[30vh] bg-white/5 blur-[100px] rounded-full"></div>
        </div>

        {/* Content container */}
        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center justify-center text-center">
          {/* Logo with decorative elements */}
          <div className="relative mb-16 md:mb-20">
            <div className="relative w-[320px] md:w-[480px] mx-auto">
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white tracking-tight">MODEST THREADS</h1>
              <p className="text-white/80 mt-4 text-lg md:text-xl font-light tracking-wide">TIMELESS MODEST FASHION</p>
            </div>

            {/* Decorative lines */}
            <div className="absolute top-1/2 left-0 w-16 md:w-24 h-px bg-white/20 -translate-y-1/2"></div>
            <div className="absolute top-1/2 right-0 w-16 md:w-24 h-px bg-white/20 -translate-y-1/2"></div>
          </div>

          {/* Hero content */}
          <div className="space-y-8 max-w-2xl mx-auto mb-40">
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light tracking-wide">
              Discover our exquisite collection of handcrafted abayas and hijabs, where timeless tradition meets
              contemporary design.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-white text-olive-900 hover:bg-white/90 rounded-md px-8 py-6 transition-all duration-300 ease-in-out text-base z-20 shadow-lg hover:shadow-xl hover:translate-y-[-2px] font-medium"
              >
                <Link href="/collection" className="flex items-center gap-2">
                  Explore Collection
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-black hover:bg-white/20 rounded-md px-8 py-6 transition-all duration-300 ease-in-out text-base z-20 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] font-medium"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center gap-3 z-30">
            <span className="text-white/70 text-xs uppercase tracking-[0.2em] font-light">Discover</span>
            <Link
              href="#featured"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 text-white/80 hover:text-white hover:border-white/60 transition-colors duration-300"
            >
              <ArrowRight className="h-4 w-4 rotate-90" />
              <span className="sr-only">Scroll down</span>
            </Link>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-12 left-12 w-24 h-24 border-l border-t border-white/10 hidden md:block"></div>
        <div className="absolute top-12 right-12 w-24 h-24 border-r border-t border-white/10 hidden md:block"></div>
        <div className="absolute bottom-12 left-12 w-24 h-24 border-l border-b border-white/10 hidden md:block"></div>
        <div className="absolute bottom-12 right-12 w-24 h-24 border-r border-b border-white/10 hidden md:block"></div>
      </section>

      {/* Featured Collection Section */}
      <section id="featured" className="py-24 md:py-32 bg-white relative overflow-hidden">
        <FeaturedCollection initialProducts={featuredProducts} />
      </section>

      {/* All Products Section */}
      <section className="py-24 md:py-32 bg-olive-50 relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-6 tracking-tight">Our Collection</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of modest fashion, designed with elegance, quality, and attention to detail.
            </p>
          </div>

          <ProductGallery initialProducts={products.slice(0, 6)} />

          <div className="mt-16 text-center">
            <Button asChild className="rounded-none bg-olive-900 hover:bg-olive-800 text-white px-8 py-6">
              <Link href="/collection">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-5xl font-serif mb-6 tracking-tight">Exquisite Craftsmanship</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  At Modest Threads, we believe that true luxury lies in the details. Each of our pieces is a testament
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
                  className="rounded-none px-8 border-black text-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
                >
                  <Link href="/contact">Inquire About Custom Orders</Link>
                </Button>
              </div>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="aspect-square relative rounded-none overflow-hidden">
                <Image
                  src="/black-pearl.png?height=600&width=600"
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
    </div>
  )
}
