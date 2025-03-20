import { getOrderDetails } from "@/app/actions/admin-actions"
import { formatCurrency } from "@/lib/utils"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Package } from "lucide-react"
import { OrderStatusActions } from "@/components/admin/order-status-actions"

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  // Get the ID parameter
  const id = await params.id

  // Get order details
  const response = await getOrderDetails(id)

  if (!response.success || !response.data) {
    notFound()
  }

  const order = response.data
  const customer = order.customers
  const orderItems = order.order_items || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Order #{order.id.slice(-8).toUpperCase()}</h1>
        </div>

        <OrderStatusActions order={order} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order Date</h3>
                  <p>{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order Status</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "fulfilled"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : order.status === "paid"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment ID</h3>
                  <p>{order.stripe_payment_intent_id || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
                  <p className="font-medium">{formatCurrency(order.total, order.currency)}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Order Items</h3>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">{item.product_name}</div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatCurrency(item.price, order.currency)}
                        </div>
                      </div>
                      <div className="font-medium">{formatCurrency(item.price * item.quantity, order.currency)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(order.total, order.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Customer Name</h3>
                <p>{customer?.name || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{customer?.email || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <p>{customer?.phone || "N/A"}</p>
              </div>

              {order.shipping_address && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipping Address</h3>
                  <div className="text-sm">
                    {order.shipping_address.name}
                    <br />
                    {order.shipping_address.address?.line1}
                    <br />
                    {order.shipping_address.address?.line2 && (
                      <>
                        {order.shipping_address.address.line2}
                        <br />
                      </>
                    )}
                    {order.shipping_address.address?.city}, {order.shipping_address.address?.state}{" "}
                    {order.shipping_address.address?.postal_code}
                    <br />
                    {order.shipping_address.address?.country}
                  </div>
                </div>
              )}

              {order.billing_address && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Billing Address</h3>
                  <div className="text-sm">
                    {order.billing_address.name}
                    <br />
                    {order.billing_address.address?.line1}
                    <br />
                    {order.billing_address.address?.line2 && (
                      <>
                        {order.billing_address.address.line2}
                        <br />
                      </>
                    )}
                    {order.billing_address.address?.city}, {order.billing_address.address?.state}{" "}
                    {order.billing_address.address?.postal_code}
                    <br />
                    {order.billing_address.address?.country}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

