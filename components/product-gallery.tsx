"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const products = [
  {
    id: "1",
    name: "Blush Pink Embellished Abaya",
    description:
      "A delicate blush pink abaya with intricate embroidery and beadwork on the sleeves and cuffs. Perfect for special occasions.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6438.JPG-qUJDAPNydBSNzZBaopSenrUnw0864C.jpeg",
    category: "Special Occasion",
  },
  {
    id: "2",
    name: "Classic Black Pearl Abaya",
    description:
      "Timeless black abaya adorned with elegant pearl and crystal embellishments on the sleeves. A perfect blend of tradition and luxury.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6434.JPG-gMa5CcoJ4J7I5FtDa5hxveOyUKQgbA.jpeg",
    category: "Luxury Collection",
  },
  {
    id: "3",
    name: "Sage Green Embroidered Abaya",
    description:
      "A serene sage green abaya featuring delicate floral embroidery along the sleeves. Perfect for both everyday wear and special occasions.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6435.JPG-CsMvRiK70j8X8jdpBSxU14avneRxJT.jpeg",
    category: "Everyday Elegance",
  },
  {
    id: "4",
    name: "Luxury Black Floral Abaya",
    description:
      "An exquisite black abaya with detailed floral embroidery throughout. Perfect for making a statement at special events.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6436.JPG-8ZsGWg45COOp3NVH9CzCw5wYH4gibI.jpeg",
    category: "Luxury Collection",
  },
  {
    id: "5",
    name: "Dusty Rose Beaded Abaya",
    description:
      "A stunning dusty rose abaya with intricate beadwork and embroidery. The perfect blend of tradition and contemporary design.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6437.JPG-V2FQd1AGJdxam1FzUpYwz4FPXcGyWW.jpeg",
    category: "Special Occasion",
  },
  {
    id: "6",
    name: "Esra Signature Abaya",
    description:
      "Our signature design featuring premium fabric and exquisite craftsmanship. A timeless piece for your collection.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6440.JPG-azzRZ2T3EoIkpjwBOCjXUTjNcAYJWU.jpeg",
    category: "Signature Collection",
  },
]

export default function ProductGallery() {
  const [selectedProduct, setSelectedProduct] = useState(null)

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
              <h3 className="font-serif text-xl group-hover:text-primary transition-colors">{product.name}</h3>
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
                <h2 className="font-serif text-3xl mb-4">{selectedProduct.name}</h2>
                <p className="text-muted-foreground mb-8">{selectedProduct.description}</p>

                <div className="mt-auto space-y-4">
                  <p className="text-sm text-muted-foreground">
                    For pricing information and to place an order, please contact us directly.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button className="w-full rounded-none transition-all duration-300 ease-in-out">
                      Contact for Details
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

