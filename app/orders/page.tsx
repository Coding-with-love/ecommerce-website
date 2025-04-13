"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  ShoppingBag,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  MessageSquare,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getTrackingUrl } from "@/lib/shipping-utils"
import { useToast } from "@/components/ui/use-toast"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
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
          router.push("/account/login?redirect=/orders")
          return
        }

        const user = data.session?.user
        setUser(user)

        if (!user) {
          router.push("/account/login?redirect=/orders")
          return
        }

        fetchOrders(user.id)
      } catch (err) {
        console.error("Error getting user session:", err)
        setLoading(false)
        setError("Failed to authenticate user")
      }
    }

    getUser()
  }, [router])

  const fetchOrders = async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log(`Fetching orders for user ${userId}`)

      const { data, error: ordersError } = await supabase
        .from("orders")
        .select(`*, order_items(*)`)
        .eq("customer_id", userId)
        .order("created_at", { ascending: false })

      if (ordersError) {
        console.error("Error fetching orders:", ordersError)
        setError(`Failed to fetch orders: ${ordersError.message}`)
        setOrders([])
      } else {
        console.log(`Retrieved ${data?.length || 0} orders`)
        setOrders(data || [])
      }
    } catch (error: any) {
      console.error("Unexpected error fetching orders:", error)
      setError(`An unexpected error occurred: ${error?.message || "Unknown error"}`)

      toast({
        title: "Error loading orders",
        description: error?.message || "Failed to load your orders",
        variant: "destructive",
      })
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
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="container max-w-5xl py-24 px-4 sm:px-6 mt-16">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" className="mr-4" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-800"></div>
          <p className="mt-4 text-olive-800">Loading your orders...</p>
        </div>
      ) : error ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Error loading orders</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => fetchOrders(user.id)}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button asChild>
                <Link href="/collection">Browse Collection</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} formatDate={formatDate} getStatusBadge={getStatusBadge} />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              {orders
                .filter((order) => order.status === "pending")
                .map((order) => (
                  <OrderCard key={order.id} order={order} formatDate={formatDate} getStatusBadge={getStatusBadge} />
                ))}
            </TabsContent>

            <TabsContent value="paid" className="space-y-6">
              {orders
                .filter((order) => order.status === "paid")
                .map((order) => (
                  <OrderCard key={order.id} order={order} formatDate={formatDate} getStatusBadge={getStatusBadge} />
                ))}
            </TabsContent>

            <TabsContent value="fulfilled" className="space-y-6">
              {orders
                .filter((order) => order.status === "fulfilled")
                .map((order) => (
                  <OrderCard key={order.id} order={order} formatDate={formatDate} getStatusBadge={getStatusBadge} />
                ))}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-6">
              {orders
                .filter((order) => order.status === "cancelled")
                .map((order) => (
                  <OrderCard key={order.id} order={order} formatDate={formatDate} getStatusBadge={getStatusBadge} />
                ))}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

function OrderCard({ order, formatDate, getStatusBadge }: any) {
  const [expanded, setExpanded] = useState(false)
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false)

  // Check if the order has shipping info with tracking
  const hasTracking = order.shipping_info?.tracking_number
  const isOrderFulfilled = order.status === "fulfilled"

  return (
    <Card key={order.id} className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
            <CardDescription>Placed on {formatDate(order.created_at)}</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
            <div className="font-medium">{formatCurrency(order.total, order.currency)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">
                {order.order_items?.length || 0} {order.order_items?.length === 1 ? "item" : "items"}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Hide details" : "View details"}
            </Button>
          </div>

          {expanded && (
            <div className="mt-4 space-y-4">
              <Separator />
              <div className="space-y-4">
                {(order.order_items || []).map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × {formatCurrency(item.price, order.currency)}
                      </p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.price * item.quantity, order.currency)}</p>
                  </div>
                ))}
              </div>

              {order.shipping_address && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address.name}
                      <br />
                      {order.shipping_address.address?.line1}
                      {order.shipping_address.address?.line2 && <br />}
                      {order.shipping_address.address?.line2}
                      <br />
                      {order.shipping_address.address?.city}, {order.shipping_address.address?.state}{" "}
                      {order.shipping_address.address?.postal_code}
                      <br />
                      {order.shipping_address.address?.country}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 flex justify-end gap-2 border-t">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/orders/${order.id}`}>Order Details</Link>
        </Button>

        {isOrderFulfilled && (
          <>
            {hasTracking ? (
              <Button size="sm" asChild>
                <a
                  href={getTrackingUrl(order.shipping_info.carrier || "", order.shipping_info.tracking_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Track Package
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : (
              <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">Track Package</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tracking Information</DialogTitle>
                  </DialogHeader>
                  <div className="py-6">
                    <p className="text-center mb-4">
                      This order has been fulfilled, but tracking information is not yet available.
                    </p>
                    <p className="text-center text-sm text-muted-foreground">
                      Please check back later or contact customer support for assistance.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setIsTrackingDialogOpen(false)}>
                      Close
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}
