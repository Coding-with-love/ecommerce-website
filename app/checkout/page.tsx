"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { createCheckoutSession } from "@/app/actions/stripe-actions"
import { supabase } from "@/lib/supabase"

export default function CheckoutPage() {
  const { items, subtotal, totalItems } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUserData, setIsLoadingUserData] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  })

  // Fetch user data if signed in
  useEffect(() => {
    async function fetchUserData() {
      setIsLoadingUserData(true)

      try {
        // Check if user is signed in
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Fetch user profile from database
          const { data: customer, error } = await supabase
            .from("customers")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (customer && !error) {
            // Pre-fill form with user data
            setFormData({
              name: customer.name || "",
              email: customer.email || "",
              address: customer.address || "",
              city: customer.city || "",
              state: customer.state || "",
              postalCode: customer.postal_code || "",
              country: customer.country || "",
            })
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoadingUserData(false)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create a checkout session with Stripe
      const result = await createCheckoutSession({
        items: items.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        customerInfo: formData,
      })

      if (result.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.url
      } else {
        console.error("Failed to create checkout session")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setIsLoading(false)
    }
  }

  // If cart is empty, redirect to collection
  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen pt-20">
        <div className="container px-4 py-16 md:px-6 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-serif mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some items to your cart before proceeding to checkout.</p>
          <Button asChild>
            <a href="/collection">Browse Collection</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pt-20">
      <div className="container px-4 py-16 md:px-6">
        <h1 className="text-3xl md:text-4xl font-serif mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            {isLoadingUserData ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-serif">Contact Information</h2>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-serif">Shipping Address</h2>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 space-y-6">
            <h2 className="text-xl font-serif">Order Summary</h2>

            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.product.id} className="py-4 flex gap-4">
                  <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <span>{formatCurrency(item.product.price * item.quantity, item.product.currency)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, "USD")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2">
                <span>Total</span>
                <span>{formatCurrency(subtotal, "USD")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

