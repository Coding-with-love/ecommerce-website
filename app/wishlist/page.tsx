"use client"

import { useState, useEffect } from "react"
import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, ShoppingCart, Trash, ArrowLeft, MoveRight } from 'lucide-react'
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function WishlistPage() {
  const { items, removeFromWishlist, totalItems } = useWishlist()
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
      setLoading(false)
    }

    getUser()
  }, [])

  const handleAddToCart = (product: any) => {
    addToCart(product)
    removeFromWishlist(product.id)
  }

  return (
    <div className="container max-w-6xl py-24 px-4 sm:px-6 mt-16">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" className="mr-4" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">My Wishlist</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-800"></div>
          <p className="mt-4 text-olive-800">Loading your wishlist...</p>
        </div>
      ) : totalItems === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">
                Save items you love to your wishlist and revisit them anytime.
              </p>
              <Button asChild>
                <Link href="/collection">Browse Collection</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative aspect-square overflow-hidden group">
                <Link href={`/collection/${product.id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View product</span>
                </Link>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeFromWishlist(product.id)
                  }}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Remove from wishlist</span>
                </Button>
              </div>
              <CardContent className="flex-1 pt-4">
                <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                <div className="mt-2 font-medium">{formatCurrency(product.price, product.currency)}</div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAddToCart(product)
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalItems > 0 && (
        <div className="mt-12 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/collection">
              Continue Shopping
              <MoveRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
