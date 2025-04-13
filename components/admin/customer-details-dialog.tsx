"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Mail, Phone, MapPin, Calendar, Package, ExternalLink, Edit } from 'lucide-react'

interface CustomerDetailsDialogProps {
  customer: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDetailsDialog({ customer, open, onOpenChange }: CustomerDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")
  
  if (!customer) return null
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "MMMM d, yyyy")
    } catch (e) {
      return "Invalid date"
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="h-8 w-8 rounded-full bg-olive-100 flex items-center justify-center text-olive-800 font-medium">
              {customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}
            </div>
            {customer.name || "Guest Customer"}
          </DialogTitle>
          <DialogDescription>
            Customer since {formatDate(customer.created_at)}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
                  <div className="space-y-2">
                    {customer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                          {customer.email}
                        </a>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${customer.phone}`} className="text-blue-600 hover:underline">
                          {customer.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Account Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Created: {formatDate(customer.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>Total Orders: {customer.orderCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Order Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-2xl font-bold">
                        {customer.totalSpent ? formatCurrency(customer.totalSpent) : '$0.00'}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-2xl font-bold">
                        {customer.orderCount || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Orders Placed</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Order</h3>
                  {customer.lastOrderDate ? (
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm">{formatDate(customer.lastOrderDate)}</div>
                      {customer.orders && customer.orders[0] && (
                        <div className="mt-2">
                          <Badge variant="outline">
                            {customer.orders[0].status.charAt(0).toUpperCase() + customer.orders[0].status.slice(1)}
                          </Badge>
                          <div className="mt-1 font-medium">
                            {formatCurrency(customer.orders[0].total)}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No orders yet</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" asChild>
                <Link href={`/admin/customers/${customer.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Customer
                </Link>
              </Button>
              {customer.orderCount > 0 && (
                <Button asChild>
                  <Link href={`/admin/orders?customer=${customer.id}`}>
                    <Package className="h-4 w-4 mr-2" />
                    View Orders
                  </Link>
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            {customer.orders && customer.orders.length > 0 ? (
              <div className="space-y-4">
                {customer.orders.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Order #{order.id.slice(0, 8)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                      <Badge variant="outline" className={
                        order.status === 'fulfilled' ? 'bg-green-50 text-green-700 border-green-200' :
                        order.status === 'paid' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{formatCurrency(order.total)}</div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/orders/${order.id}`}>
                          View Details
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>This customer hasn't placed any orders yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="addresses" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Shipping Address</h3>
                {customer.shipping_address ? (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">{customer.shipping_address.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {customer.shipping_address.address?.line1}<br />
                          {customer.shipping_address.address?.line2 && (
                            <>{customer.shipping_address.address.line2}<br /></>
                          )}
                          {customer.shipping_address.address?.city}, {customer.shipping_address.address?.state} {customer.shipping_address.address?.postal_code}<br />
                          {customer.shipping_address.address?.country}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 text-muted-foreground">
                    No shipping address on file
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Billing Address</h3>
                {customer.billing_address ? (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">{customer.billing_address.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {customer.billing_address.address?.line1}<br />
                          {customer.billing_address.address?.line2 && (
                            <>{customer.billing_address.address.line2}<br /></>
                          )}
                          {customer.billing_address.address?.city}, {customer.billing_address.address?.state} {customer.billing_address.address?.postal_code}<br />
                          {customer.billing_address.address?.country}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 text-muted-foreground">
                    No billing address on file
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
