"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Currency, X } from "lucide-react"
import Elegant from "@/public/elegance.png"
import BlackPearl from "@/public/black-pearl.png"
import SageGreen from "@/public/sage-green.png"
import LuxuryBlack from "@/public/luxury-black.png"
import DustyRose from "@/public/dusty-rose.png"
import Signature from "@/public/signature.png"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"
const products = [
  {
    id: "1",
    name: "Blush Pink Embellished Abaya",
    description:
      "A delicate blush pink abaya with intricate embroidery and beadwork on the sleeves and cuffs. Perfect for special occasions.",
    image: Elegant,
    category: "Special Occasion",
    price: 249.99,
    currency: "USD",
  },
  {
    id: "2",
    name: "Classic Black Pearl Abaya",
    description:
      "Timeless black abaya adorned with elegant pearl and crystal embellishments on the sleeves. A perfect blend of tradition and luxury.",
    image: BlackPearl,
    category: "Luxury Collection",
    price: 299.99,
    currency: "USD",
  },
  {
    id: "3",
    name: "Sage Green Embroidered Abaya",
    description:
      "A serene sage green abaya featuring delicate floral embroidery along the sleeves. Perfect for both everyday wear and special occasions.",
    image: SageGreen,
    category: "Everyday Elegance",
    price: 199.99,
    currency: "USD",
  },
  {
    id: "4",
    name: "Luxury Black Floral Abaya",
    description:
      "An exquisite black abaya with detailed floral embroidery throughout. Perfect for making a statement at special events.",
    image: LuxuryBlack,
    category: "Luxury Collection",
    price: 279.99,
    currency: "USD",
  },
  {
    id: "5",
    name: "Dusty Rose Beaded Abaya",
    description:
      "A stunning dusty rose abaya with intricate beadwork and embroidery. The perfect blend of tradition and contemporary design.",
    image: DustyRose,
    category: "Special Occasion",
    price: 259.99,
    currency: "USD",
  },
  {
    id: "6",
    name: "Esra Signature Abaya",
    description:
      "Our signature design featuring premium fabric and exquisite craftsmanship. A timeless piece for your collection.",
    image: Signature,
    category: "Signature Collection",
    price: 259.99,
    currency: "USD",
  },
]

export default function ProductGallery() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { addToCart } = useCart()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="relative aspect-[3/4] overflow-hidden mb-4">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{product.category}</div>
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl group-hover:text-primary transition-colors">{product.name}</h3>
                <span className="font-medium text-lg">{formatCurrency(product.price, product.currency)}</span>
              </div>
              <p className="text-muted-foreground line-clamp-2">{product.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 bg-white/80 hover:bg-white rounded-full"
            onClick={() => setSelectedProduct(null)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          {selectedProduct && (
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[3/4] bg-muted">
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-8 flex flex-col">
                <div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  {selectedProduct.category}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-serif text-3xl">{selectedProduct.name}</h2>
                  <span className="font-medium text-2xl">
                    {formatCurrency(selectedProduct.price, selectedProduct.currency)}
                  </span>
                </div>
                <p className="text-muted-foreground mb-8">{selectedProduct.description}</p>

                <div className="mt-auto space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Purchase directly or contact us for more information and custom requests.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      className="w-full rounded-none transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
                      onClick={() => {
                        addToCart(selectedProduct)
                        setSelectedProduct(null)
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-none transition-all duration-300 ease-in-out"
                    >
                      <Link href="/contact" onClick={() => setSelectedProduct(null)}>
                        Contact for Details
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-none transition-all duration-300 ease-in-out"
                      onClick={() => setSelectedProduct(null)}
                    >
                      Continue Browsing
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

