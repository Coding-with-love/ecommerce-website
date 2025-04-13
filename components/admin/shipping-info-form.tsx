"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateShippingInfo } from "@/app/actions/admin-actions"
import { toast } from "@/components/ui/use-toast"
import { Package, Truck } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ShippingInfoFormProps {
  orderId: string
  existingInfo?: {
    tracking_number?: string
    carrier?: string
    shipped_date?: string
    estimated_delivery_date?: string
    shipping_notes?: string
  }
  onSuccess?: () => void
}

export function ShippingInfoForm({ orderId, existingInfo, onSuccess }: ShippingInfoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState(existingInfo?.tracking_number || "")
  const [carrier, setCarrier] = useState(existingInfo?.carrier || "")
  const [shippedDate, setShippedDate] = useState<Date | undefined>(
    existingInfo?.shipped_date ? new Date(existingInfo.shipped_date) : new Date(),
  )
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<Date | undefined>(
    existingInfo?.estimated_delivery_date ? new Date(existingInfo.estimated_delivery_date) : undefined,
  )
  const [shippingNotes, setShippingNotes] = useState(existingInfo?.shipping_notes || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateShippingInfo(orderId, {
        tracking_number: trackingNumber,
        carrier,
        shipped_date: shippedDate ? shippedDate.toISOString() : undefined,
        estimated_delivery_date: estimatedDeliveryDate ? estimatedDeliveryDate.toISOString() : undefined,
        shipping_notes: shippingNotes,
      })

      if (result.success) {
        toast({
          title: "Shipping information updated",
          description: "The order's shipping information has been successfully updated.",
        })
        if (onSuccess) onSuccess()
      } else {
        // Check if it's the missing column error
        if (result.error?.includes("shipping_info column doesn't exist")) {
          toast({
            title: "Database setup required",
            description:
              "The shipping_info column needs to be added to your orders table. Please run the database migration.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error updating shipping information",
            description: result.error || "An error occurred while updating shipping information.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error updating shipping information",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Shipping Carrier</Label>
              <Input
                id="carrier"
                placeholder="e.g. USPS, FedEx, UPS"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Shipped Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !shippedDate && "text-muted-foreground",
                    )}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    {shippedDate ? format(shippedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={shippedDate} onSelect={setShippedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Estimated Delivery</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !estimatedDeliveryDate && "text-muted-foreground",
                    )}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    {estimatedDeliveryDate ? format(estimatedDeliveryDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={estimatedDeliveryDate}
                    onSelect={setEstimatedDeliveryDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Shipping Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information about this shipment"
              value={shippingNotes}
              onChange={(e) => setShippingNotes(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting
              ? "Updating..."
              : existingInfo?.tracking_number
                ? "Update Shipping Info"
                : "Add Shipping Info"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
