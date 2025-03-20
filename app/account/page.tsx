"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Package, ChevronRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Number of orders to show initially
const INITIAL_ORDERS_SHOWN = 2

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [expandedOrders, setExpandedOrders] = useState({})
  const [showAllOrders, setShowAllOrders] = useState(false)

  useEffect(() => {
    async function getProfile() {
      setIsLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setIsLoading(false)
        return
      }

      // Get user profile
      const { data: customer } = await supabase.from("customers").select("*").eq("id", session.user.id).single()

      // Get user orders
      const { data: orderData } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("customer_id", session.user.id)
        .order("created_at", { ascending: false })

      setUser(customer)
      setOrders(orderData || [])
      setIsLoading(false)
    }

    getProfile()
  }, [])

  const toggleOrderExpanded = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  // Get the orders to display based on showAllOrders state
  const displayedOrders = showAllOrders ? orders : orders.slice(0, INITIAL_ORDERS_SHOWN)

  // Check if we need to show the "View More" button
  const hasMoreOrders = orders.length > INITIAL_ORDERS_SHOWN

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen pt-20">
        <div className="container px-4 py-16 md:px-6">
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen pt-20">
        <div className="container px-4 py-16 md:px-6">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-serif mb-4">Account</h1>
            <p className="mb-6">Please sign in to view your account and order history.</p>
            <Button asChild>
              <Link href="/account/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pt-20">
      <div className="container px-4 py-16 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif mb-6">My Account</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Name:</span> {user.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {user.email}
                  </div>
                  {user.address && (
                    <div>
                      <span className="font-medium">Address:</span>
                      <div className="text-muted-foreground">
                        {user.address}
                        <br />
                        {user.city}, {user.state} {user.postal_code}
                        <br />
                        {user.country}
                      </div>
                    </div>
                  )}
                  {!user.address && <div className="text-muted-foreground">No shipping address added yet.</div>}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/account/edit">Edit Profile</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  {orders.length
                    ? `You have placed ${orders.length} order${orders.length !== 1 ? "s" : ""}.`
                    : "You have not placed any orders yet."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {displayedOrders.map((order) => (
                      <div key={order.id} className="border rounded-md overflow-hidden">
                        <div
                          className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                          onClick={() => toggleOrderExpanded(order.id)}
                        >
                          <div>
                            <div className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <div className="font-medium">{formatCurrency(order.total, order.currency)}</div>
                            {expandedOrders[order.id] ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>

                        {expandedOrders[order.id] && (
                          <div className="p-4 border-t">
                            <h4 className="font-medium mb-3">Order Items</h4>
                            <div className="space-y-3">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                                    <Package className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <div className="flex-grow">
                                    <div className="font-medium">{item.product_name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      Qty: {item.quantity} × {formatCurrency(item.price, order.currency)}
                                    </div>
                                  </div>
                                  <div className="font-medium">
                                    {formatCurrency(item.price * item.quantity, order.currency)}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 pt-3 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Total</span>
                                <span>{formatCurrency(order.total, order.currency)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* View More Orders button */}
                    {hasMoreOrders && (
                      <div className="text-center pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAllOrders(!showAllOrders)}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          {showAllOrders ? (
                            <>Show Less Orders</>
                          ) : (
                            <>
                              View All Orders ({orders.length})<ChevronRight className="ml-1 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Browse our collection and place your first order.
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/collection">Shop Now</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

