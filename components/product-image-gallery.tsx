"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

interface ProductImageGalleryProps {
  product: Product
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  // Create an array of images - use the main image and additional images
  const images = [product.image || "/placeholder.svg?height=800&width=800", ...(product.images || [])].filter(Boolean) // Filter out any undefined or empty strings

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-olive-50">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative w-full h-full cursor-zoom-in">
              <Image
                src={images[activeIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-black/50 rounded-full p-2">
                  <ZoomIn className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-black/95">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={images[activeIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white hover:bg-white/20"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white hover:bg-white/20"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Navigation arrows - only show if there are multiple images */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm z-10"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm z-10"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation - only show if there are multiple images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              className={`aspect-square relative rounded-lg overflow-hidden bg-olive-100 ${
                activeIndex === index ? "ring-2 ring-olive-800" : "hover:opacity-80"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${product.name} - View ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
