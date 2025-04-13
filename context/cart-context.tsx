"use client"

import type React from "react"
import { createContext, useState, useContext, useCallback, useEffect } from "react"

interface Product {
  id: string
  name: string
  price: number
  description: string
  imageUrl?: string
  image?: string
  category?: string
  currency?: string
}

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextProps {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  subtotal: number
}

const CartContext = createContext<CartContextProps>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  subtotal: 0,
})

export const useCart = () => useContext(CartContext)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const totalPrice = subtotal // Add shipping, tax, etc. if needed

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [items])

  // Add to cart with optional quantity parameter
  const addToCart = useCallback((product: Product, quantity = 1) => {
    console.log("Adding to cart:", product, "quantity:", quantity)

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      const newItems = existingItem
        ? prevItems.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          )
        : [...prevItems, { product, quantity }]

      console.log("New cart state:", newItems)
      return newItems
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }

      setItems((prevItems) => prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
    },
    [removeFromCart],
  )

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const value: CartContextProps = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    subtotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
