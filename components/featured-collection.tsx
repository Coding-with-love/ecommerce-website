"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

export default function FeaturedCollection({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [featuredItems, setFeaturedItems] = useState<Product[]>(initialProducts)

  // If no products are provided, use the first 3 from the initialProducts
  useEffect(() => {
    if (initialProducts.length > 0 && featuredItems.length === 0) {
      setFeaturedItems(initialProducts.slice(0, 3))
    }
  }, [initialProducts, featuredItems.length])

  // If there are no featured items, show a fallback
  if (featuredItems.length === 0) {
    return null
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-olive-100 text-olive-800 text-xs uppercase tracking-wider rounded-full mb-5 font-medium">
              Featured
            </span>
            <h2 className="text-3xl md:text-5xl font-serif mb-6 tracking-tight leading-tight">Curated Collections</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore our most sought-after collections, each designed to combine timeless modesty with contemporary
              elegance.
            </p>
          </div>

          <div className="space-y-4">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className={`p-6 border-l-2 cursor-pointer transition-all rounded-r-xl ${
                  activeIndex === index
                    ? "border-olive-800 bg-gradient-to-r from-olive-50 to-transparent shadow-md"
                    : "border-olive-200 hover:border-olive-400 hover:bg-olive-50/50"
                }`}
                onClick={() => setActiveIndex(index)}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-serif text-xl mb-2 font-medium">{item.name}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-full border-olive-800 text-olive-800 hover:bg-olive-800 hover:text-white group transition-all duration-300 ease-in-out py-6 px-8 shadow-sm hover:shadow-md"
          >
            <Link href="/collection">
              View All Collections
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/5] relative overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={featuredItems[activeIndex]?.image || "/placeholder.svg"}
              alt={featuredItems[activeIndex]?.name}
              fill
              className="object-cover transition-all duration-700 ease-in-out"
            />

            {/* Overlay with product info - improved styling */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
              <div className="text-white">
                <h3 className="font-serif text-2xl mb-3 font-medium text-white">{featuredItems[activeIndex]?.name}</h3>
                <p className="text-white/90 mb-5 line-clamp-2">{featuredItems[activeIndex]?.description}</p>
                <Button
                  asChild
                  className="rounded-full bg-white/20 hover:bg-white hover:text-olive-900 backdrop-blur-sm border-white/40 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Link href={`/collection/${featuredItems[activeIndex]?.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative elements - enhanced styling */}
          <div className="absolute -bottom-8 -left-8 w-2/3 h-32 bg-olive-200/50 -z-10 rounded-2xl"></div>
          <div className="absolute -top-8 -right-8 w-32 h-2/3 bg-olive-100/70 -z-10 rounded-2xl"></div>

          {/* Image pagination dots - improved styling */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {featuredItems.map((_, index) => (
              <button
                key={index}
                className={`h-2.5 rounded-full transition-all ${
                  activeIndex === index ? "bg-olive-800 w-8" : "bg-olive-300 w-2.5 hover:bg-olive-400"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View product ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
