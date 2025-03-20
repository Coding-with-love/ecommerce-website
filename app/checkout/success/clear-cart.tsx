"use client"

import { useEffect } from "react"
import { useCart } from "@/context/cart-context"

export function ClearCartOnSuccess({ sessionId }: { sessionId?: string }) {
  const { clearCart } = useCart()

  useEffect(() => {
    // If we have a valid session ID, clear the cart
    if (sessionId) {
      clearCart()
    }
  }, [sessionId, clearCart])

  // This component doesn't render anything
  return null
}

