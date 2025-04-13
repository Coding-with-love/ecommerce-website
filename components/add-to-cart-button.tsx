"use client"

import { useState } from "react"
import { ShoppingBag, Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { toast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/types"

interface AddToCartButtonProps {
  product: Product
  showQuantity?: boolean
}

export default function AddToCartButton({ product, showQuantity = true }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(product, quantity)

    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart.`,
    })

    // Reset after animation
    setTimeout(() => {
      setIsAdding(false)
    }, 1500)
  }

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10)) // Limit to 10 items
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1)) // Minimum 1 item
  }

  const isOutOfStock = product.stock_status === "out_of_stock"

  return (
    <div className="flex flex-col space-y-3">
      {showQuantity && (
        <div className="flex items-center border border-olive-200 rounded-md w-fit">
          <button
            type="button"
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isOutOfStock}
            className="px-3 py-2 text-olive-800 hover:bg-olive-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 font-medium">{quantity}</span>
          <button
            type="button"
            onClick={incrementQuantity}
            disabled={quantity >= 10 || isOutOfStock}
            className="px-3 py-2 text-olive-800 hover:bg-olive-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={isAdding || isOutOfStock}
        className={`w-full h-12 rounded-md transition-all duration-300 ${
          isAdding ? "bg-green-600 hover:bg-green-700" : "bg-olive-800 hover:bg-olive-900"
        }`}
      >
        {isAdding ? (
          <span className="flex items-center">
            <Check className="h-5 w-5 mr-2" />
            Added to Cart
          </span>
        ) : (
          <span className="flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            {isOutOfStock ? "Out of Stock" : `Add to Cart${showQuantity && quantity > 1 ? ` (${quantity})` : ""}`}
          </span>
        )}
      </Button>
    </div>
  )
}
