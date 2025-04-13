"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Eye } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/types"
import { motion } from "framer-motion"

export default function ProductGallery({ initialProducts = [] }: { initialProducts: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [products] = useState<Product[]>(initialProducts)
  const { addToCart } = useCart()

  const formatCurrency = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    setSelectedProduct(null)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {products.map((product) => (
          <motion.div key={product.id} className="group relative" variants={item}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-5 bg-olive-50 shadow-md transition-all duration-300 group-hover:shadow-xl">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Category tag - updated styling */}
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1.5 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full text-olive-900 shadow-sm">
                  {product.category}
                </span>
              </div>

              {/* Overlay with actions - improved styling */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/90 hover:bg-olive-900 text-olive-900 backdrop-blur-sm shadow-md transition-transform duration-300 hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedProduct(product)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Quick view</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2 cursor-pointer" onClick={() => setSelectedProduct(product)}>
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl font-medium group-hover:text-olive-800 transition-colors text-black">
                  {product.name}
                </h3>
                <span className="font-medium text-lg text-olive-900">
                  {formatCurrency(product.price, product.currency)}
                </span>
              </div>
              <p className="text-muted-foreground line-clamp-2 text-sm">{product.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-2xl shadow-2xl">
          {selectedProduct && (
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[3/4] bg-olive-50">
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />

                {/* Category tag */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1.5 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full text-olive-900 shadow-sm">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>

              <div className="p-10 flex flex-col">
                <div className="mb-8">
                  <h2 className="font-serif text-3xl font-medium mb-3 text-foreground">{selectedProduct.name}</h2>
                  <span className="inline-block text-2xl font-medium text-olive-900 mb-5">
                    {formatCurrency(selectedProduct.price, selectedProduct.currency)}
                  </span>
                  <div className="w-20 h-0.5 bg-olive-200 mb-5"></div>
                  <p className="text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
                </div>

                {/* Product details - improved styling */}
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-sm border-b border-olive-100 pb-3">
                    <span className="text-muted-foreground">Material</span>
                    <span className="font-medium">Premium Cotton</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-olive-100 pb-3">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-medium">One Size</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-olive-100 pb-3">
                    <span className="text-muted-foreground">Availability</span>
                    <span className="font-medium text-green-600">In Stock</span>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex flex-col gap-3">
                    <Button
                      className="w-full rounded-full py-6 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 bg-olive-900 hover:bg-olive-800 shadow-md hover:shadow-lg"
                      onClick={() => handleAddToCart(selectedProduct)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-full py-6 border-olive-200 hover:bg-olive-50 hover:border-olive-300 transition-all duration-300 ease-in-out"
                    >
                      <Link href={`/collection/${selectedProduct.id}`} onClick={() => setSelectedProduct(null)}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
