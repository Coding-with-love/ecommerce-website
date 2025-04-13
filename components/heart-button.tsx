"use client"

import type React from "react"
import { Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/context/wishlist-context"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/types"

interface HeartButtonProps {
  product: Product
  className?: string
  variant?: "ghost" | "outline" | "default"
  size?: "default" | "sm" | "lg" | "icon"
}

export function HeartButton({ 
  product, 
  className = "", 
  variant = "ghost", 
  size = "icon" 
}: HeartButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [isAnimating, setIsAnimating] = useState(false)

  const inWishlist = isInWishlist(product.id)

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    if (inWishlist) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
        variant: "default",
      })
    } else {
      addToWishlist(product)
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
        variant: "success",
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} relative`}
      onClick={handleToggleWishlist}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-5 w-5 transition-all duration-300 ${
          inWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"
        } ${isAnimating ? "scale-125" : "scale-100"}`}
      />
    </Button>
  )
}
