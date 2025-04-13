"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils"
import { getTrackingUrl } from "@/lib/shipping-utils"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Truck,
  Calendar,
  ExternalLink,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null)
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error: authError } = await supabase.auth.getSession()

        if (authError) {
          console.error("Authentication error:", authError)
          setError("Authentication failed. Please log in again.")
          router.push("/account/login?redirect=/orders")
          return
        }

        const user = data.session?.user

        if (!user) {
          console.log("No authenticated user found")
          router.push("/account/login?redirect=/orders")
          return
        }

        setUser(user)
        fetchOrder(params.id, user.id)
      } catch (err) {
        console.error("Error in getUser:", err)
        setError("Failed to authenticate user")
        setLoading(false)
      }
    }

    getUser()
  }, [params.id, router])

  const fetchOrder = async (orderId: string, userId: string) => {
    setLoading(true)
    setError(null)

    // Validate orderId
    if (!orderId || orderId === "undefined") {
      console.error("Invalid order ID:", orderId)
      setError("Invalid order ID")
      setLoading(false)
      return
    }

    try {
      console.log(`Fetching order ${orderId} for user ${userId}`)

      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .eq("customer_id", userId)
        .single()

      if (orderError) {
        console.error("Error fetching order data:", orderError)
        setError(`Failed to fetch order: ${orderError.message || "Unknown error"}`)
        setLoading(false)
        return
      }

      if (!orderData) {
        console.error("No order found with ID:", orderId)
        setError("Order not found")
        setLoading(false)
        return
      }

      console.log("Order data retrieved:", orderData.id)
      setOrder(orderData)

      // Fetch order items WITHOUT using the relationship
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId)

      if (itemsError) {
        console.error("Error fetching order items:", itemsError)
        setError(`Failed to fetch order items: ${itemsError.message || "Unknown error"}`)
        // Continue with the order data we have
        setOrderItems([])
      } else {
        console.log(`Retrieved ${itemsData?.length || 0} order items`)

        // For each order item, fetch the product separately if we have a product_id
        const itemsWithProducts = await Promise.all(
          (itemsData || []).map(async (item) => {
            if (item.product_id) {
              try {
                // Try to normalize the product_id - it might be a string or UUID
                const productId = item.product_id

                // If it's a valid UUID string, we can use it directly
                // Otherwise, we'll just use it as is and let Supabase handle any errors

                const { data: productData, error: productError } = await supabase
                  .from("products")
                  .select("*")
                  .eq("id", productId)
                  .single()

                if (!productError && productData) {
                  return { ...item, products: productData }
                } else {
                  console.log(`Could not find product with ID ${productId}: ${productError?.message}`)
                }
              } catch (err) {
                console.error(`Error fetching product ${item.product_id}:`, err)
              }
            }
            return item
          }),
        )

        setOrderItems(itemsWithProducts)
      }
    } catch (err: any) {
      console.error("Unexpected error fetching order:", err)
      setError(`An unexpected error occurred: ${err?.message || "Unknown error"}`)

      // Show toast with error
      toast({
        title: "Error loading order",
        description: err?.message || "Failed to load order details",
        variant: "destructive",
      })

      // Only redirect on critical errors
      if (!order) {
        router.push("/orders")
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        )
      case "fulfilled":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Fulfilled
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(date)
    } catch (err) {
      console.error("Error formatting date:", err)
      return "Invalid date"
    }
  }

  if (loading) {
    return (
      <div className="container max-w-5xl py-24 px-4 sm:px-6 mt-16">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-800"></div>
          <p className="mt-4 text-olive-800">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container max-w-5xl py-24 px-4 sm:px-6 mt-16">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">{error || "Order not found"}</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the order you're looking for. It may have been removed or the URL might be incorrect.
          </p>
          <Button asChild>
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  const isOrderFulfilled = order.status === "fulfilled"

  return (
    <div className="container max-w-5xl py-24 px-4 sm:px-6 mt-16">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" className="mr-4" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                  <p className="text-sm text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">{getStatusBadge(order.status)}</div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderItems.length > 0 ? (
                  orderItems.map((item) => {
                    const product = item.products || {}
                    const productImage = product.image || "/placeholder.svg"
                    const productId = product.id || item.product_id
                    const productName = product.name || item.product_name

                    return (
                      <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          {productId ? (
                            <Link href={`/product/${productId}`}>
                              <Image
                                src={productImage || "/placeholder.svg"}
                                alt={productName}
                                fill
                                className="object-cover"
                              />
                            </Link>
                          ) : (
                            <Image src={"/placeholder.svg"} alt={productName} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          {productId ? (
                            <Link href={`/product/${productId}`} className="hover:underline">
                              <h4 className="font-medium">{productName}</h4>
                            </Link>
                          ) : (
                            <h4 className="font-medium">{productName}</h4>
                          )}
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">{formatCurrency(item.price, order.currency)} each</span>
                            <span className="font-medium">
                              {formatCurrency(item.price * item.quantity, order.currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-muted-foreground">No items found for this order.</p>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.total, order.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.total, order.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information - Only show if order is fulfilled and has shipping info */}
          {order.status === "fulfilled" && order.shipping_info && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.shipping_info.tracking_number && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <Truck className="h-4 w-4 mr-1" /> Carrier
                      </div>
                      <div>{order.shipping_info.carrier || "Not specified"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <Package className="h-4 w-4 mr-1" /> Tracking Number
                      </div>
                      <div>{order.shipping_info.tracking_number}</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {order.shipping_info.shipped_date && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> Shipped Date
                      </div>
                      <div>{format(new Date(order.shipping_info.shipped_date), "MMMM d, yyyy")}</div>
                    </div>
                  )}

                  {order.shipping_info.estimated_delivery_date && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> Estimated Delivery
                      </div>
                      <div>{format(new Date(order.shipping_info.estimated_delivery_date), "MMMM d, yyyy")}</div>
                    </div>
                  )}
                </div>

                {order.shipping_info.shipping_notes && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Notes</div>
                    <div className="text-sm">{order.shipping_info.shipping_notes}</div>
                  </div>
                )}

                {order.shipping_info.tracking_number && (
                  <div className="pt-2">
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={getTrackingUrl(order.shipping_info.carrier || "", order.shipping_info.tracking_number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Track Package
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              {order.shipping_address ? (
                <address className="not-italic">
                  {order.shipping_address.name}
                  <br />
                  {order.shipping_address.address?.line1}
                  {order.shipping_address.address?.line2 && (
                    <>
                      <br />
                      {order.shipping_address.address.line2}
                    </>
                  )}
                  <br />
                  {order.shipping_address.address?.city}, {order.shipping_address.address?.state}{" "}
                  {order.shipping_address.address?.postal_code}
                  <br />
                  {order.shipping_address.address?.country}
                </address>
              ) : (
                <p className="text-muted-foreground">No shipping address provided</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              {order.billing_address ? (
                <address className="not-italic">
                  {order.billing_address.name}
                  <br />
                  {order.billing_address.address?.line1}
                  {order.billing_address.address?.line2 && (
                    <>
                      <br />
                      {order.billing_address.address.line2}
                    </>
                  )}
                  <br />
                  {order.billing_address.address?.city}, {order.billing_address.address?.state}{" "}
                  {order.billing_address.address?.postal_code}
                  <br />
                  {order.billing_address.address?.country}
                </address>
              ) : (
                <p className="text-muted-foreground">Same as shipping address</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">Payment Method</p>
              <p className="text-sm text-muted-foreground mb-4">Credit Card (ending in 4242)</p>

              <p className="font-medium">Payment Status</p>
              <div className="flex items-center gap-2 mt-1">
                {order.status === "pending" ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Paid
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button variant="outline" asChild>
              <Link href="/contact">Need Help?</Link>
            </Button>
            {order.status === "pending" && <Button variant="destructive">Cancel Order</Button>}
          </div>
        </div>
      </div>
    </div>
  )
}
