"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, Calendar, FileText, Edit } from "lucide-react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShippingInfoForm } from "./shipping-info-form"

interface ShippingInfoDisplayProps {
  shippingInfo: {
    tracking_number?: string
    carrier?: string
    shipped_date?: string
    estimated_delivery_date?: string
    shipping_notes?: string
  }
  orderId: string // Add orderId prop
}

export function ShippingInfoDisplay({ shippingInfo, orderId }: ShippingInfoDisplayProps) {
  // Move the dialog state inside the component
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Information
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Truck className="h-4 w-4 mr-1" /> Carrier
              </div>
              <div>{shippingInfo.carrier || "Not specified"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Package className="h-4 w-4 mr-1" /> Tracking Number
              </div>
              <div>{shippingInfo.tracking_number || "Not specified"}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> Shipped Date
              </div>
              <div>
                {shippingInfo.shipped_date
                  ? format(new Date(shippingInfo.shipped_date), "MMMM d, yyyy")
                  : "Not specified"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> Estimated Delivery
              </div>
              <div>
                {shippingInfo.estimated_delivery_date
                  ? format(new Date(shippingInfo.estimated_delivery_date), "MMMM d, yyyy")
                  : "Not specified"}
              </div>
            </div>
          </div>

          {shippingInfo.shipping_notes && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <FileText className="h-4 w-4 mr-1" /> Notes
              </div>
              <div className="text-sm">{shippingInfo.shipping_notes}</div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {shippingInfo.tracking_number && (
            <Button variant="outline" className="w-full" asChild>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  `${shippingInfo.carrier} tracking ${shippingInfo.tracking_number}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Package className="mr-2 h-4 w-4" />
                Track Package
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Dialog for editing shipping info */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Shipping Information</DialogTitle>
          </DialogHeader>
          <ShippingInfoForm orderId={orderId} existingInfo={shippingInfo} onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
