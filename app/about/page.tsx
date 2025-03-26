import Image from "next/image"
import TestimonialSection from "@/components/testimonial-section"
import Logo from "@/public/logo.png"
export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* About Hero */}
      <section className="relative py-20 md:py-28 bg-olive-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-tight">About Us</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Modest Threads was founded with a vision to create elegant, modest fashion that combines traditional
              values with contemporary design.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 tracking-tight">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Modest Threads began as a small family business with a passion for creating beautiful, modest garments
                  that women could feel both comfortable and elegant wearing.
                </p>
                <p className="text-lg leading-relaxed">
                  What started as a small collection has grown into a curated selection of handcrafted abayas and modest
                  fashion pieces, each designed with attention to detail and quality.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, we continue to honor traditional craftsmanship while embracing modern aesthetics, creating
                  pieces that are timeless in their elegance.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] relative rounded-none overflow-hidden flex items-center justify-center">
                <Image
                  src={Logo}
                  alt="Modest Threads founder"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-2/3 h-16 bg-olive-200 -z-10"></div>
              <div className="absolute -top-6 -left-6 w-16 h-2/3 bg-olive-100 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-serif mb-12 tracking-tight text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 shadow-sm">
              <h3 className="text-xl font-serif mb-4">Quality Craftsmanship</h3>
              <p className="text-muted-foreground">
                We believe in creating garments that stand the test of time, both in style and durability. Each piece is
                meticulously crafted with attention to every detail.
              </p>
            </div>
            <div className="bg-white p-8 shadow-sm">
              <h3 className="text-xl font-serif mb-4">Ethical Production</h3>
              <p className="text-muted-foreground">
                We work with skilled artisans who are fairly compensated for their craft. We believe in ethical
                production practices that respect both people and the environment.
              </p>
            </div>
            <div className="bg-white p-8 shadow-sm">
              <h3 className="text-xl font-serif mb-4">Timeless Elegance</h3>
              <p className="text-muted-foreground">
                We focus on creating pieces that transcend fleeting trends, embracing a timeless elegance that allows
                our customers to build a lasting wardrobe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials 
      <section className="py-16 md:py-24 bg-olive-900 text-white">
        <TestimonialSection />
      </section>*/}
    </div>
  )
}

