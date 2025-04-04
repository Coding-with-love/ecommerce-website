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
    <div className="container px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-serif mb-6 tracking-tight">Featured Collections</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore our most sought-after collections, each designed to combine timeless modesty with contemporary
              elegance.
            </p>
          </div>

          <div className="space-y-6">
            {featuredItems.map((item, index) => (
              <div
                key={item.id}
                className={`p-6 border-l-2 cursor-pointer transition-all ${
                  activeIndex === index ? "border-black bg-neutral-50" : "border-neutral-200 hover:border-neutral-400"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <h3 className="font-serif text-xl mb-2">{item.name}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-none border-black text-black hover:bg-black hover:text-white group transition-all duration-300 ease-in-out"
          >
            <Link href="/collection">
              View All Collections
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/5] relative overflow-hidden">
            <Image
              src={featuredItems[activeIndex]?.image || "/placeholder.svg"}
              alt={featuredItems[activeIndex]?.name}
              fill
              className="object-cover transition-opacity duration-500"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 w-2/3 h-16 bg-olive-200 -z-10"></div>
          <div className="absolute -top-8 -right-8 w-16 h-2/3 bg-olive-100 -z-10"></div>
        </motion.div>
      </div>
    </div>
  )
}

