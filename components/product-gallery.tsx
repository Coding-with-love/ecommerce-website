"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/types"

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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer" onClick={() => setSelectedProduct(product)}>
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
                <h3 className="font-serif text-xl group-hover:text-olive-800 transition-colors">{product.name}</h3>
                <span className="font-medium text-lg">{formatCurrency(product.price, product.currency)}</span>
              </div>
              <p className="text-muted-foreground line-clamp-2">{product.description}</p>
            </div>
          </div>
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
                      className="w-full rounded-none transition-all duration-300 ease-in-out flex items-center justify-center gap-2 bg-olive-900 hover:bg-olive-800"
                      onClick={() => handleAddToCart(selectedProduct)}
                    >
                      <ShoppingBag className="h-4 w-4" />
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

