"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

export function CartButton() {
  const { items, totalItems, subtotal, removeFromCart, updateQuantity } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Open cart">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({totalItems} items)</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-1">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Looks like you haven't added anything to your cart yet.</p>
              <Button asChild onClick={() => setIsOpen(false)}>
                <Link href="/collection">Browse Collection</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-4 py-4 border-b">
                  <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.product.category}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center border">
                        <button
                          className="px-2 py-1 border-r"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          className="px-2 py-1 border-l"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(item.product.price * item.quantity, item.product.currency)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between font-medium text-lg">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal, "USD")}</span>
            </div>
            <p className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout</p>
            <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

