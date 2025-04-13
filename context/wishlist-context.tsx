"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Product } from "@/lib/types"
import { supabase } from "@/lib/supabase"

interface WishlistContextType {
  items: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Check for user authentication
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  // Load wishlist from localStorage or database
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        // If user is logged in, load from database
        const { data, error } = await supabase
          .from("wishlist")
          .select("product_id, products(*)")
          .eq("user_id", user.id)

        if (!error && data) {
          const products = data.map((item) => item.products).filter(Boolean)
          setItems(products)
        }
      } else {
        // If not logged in, load from localStorage
        const savedWishlist = localStorage.getItem("wishlist")
        if (savedWishlist) {
          try {
            setItems(JSON.parse(savedWishlist))
          } catch (e) {
            console.error("Failed to parse wishlist from localStorage", e)
          }
        }
      }
      setIsInitialized(true)
    }

    loadWishlist()
  }, [user])

  // Save wishlist to localStorage or database when it changes
  useEffect(() => {
    if (!isInitialized) return

    const saveWishlist = async () => {
      if (user) {
        // If user is logged in, save to database
        // First, remove all existing items
        await supabase.from("wishlist").delete().eq("user_id", user.id)

        // Then insert new items
        if (items.length > 0) {
          const wishlistItems = items.map((product) => ({
            user_id: user.id,
            product_id: product.id,
          }))
          await supabase.from("wishlist").insert(wishlistItems)
        }
      } else {
        // If not logged in, save to localStorage
        if (items.length > 0) {
          localStorage.setItem("wishlist", JSON.stringify(items))
        } else {
          localStorage.removeItem("wishlist")
        }
      }
    }

    saveWishlist()
  }, [items, user, isInitialized])

  const addToWishlist = useCallback((product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) return prevItems
      return [...prevItems, product]
    })
  }, [])

  const removeFromWishlist = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }, [])

  const isInWishlist = useCallback(
    (productId: string) => {
      return items.some((item) => item.id === productId)
    },
    [items]
  )

  const clearWishlist = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
