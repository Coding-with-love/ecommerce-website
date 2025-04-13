"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { updateOrderStatus } from "@/app/actions/admin-actions"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, Clock, Package, XCircle, ChevronDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShippingInfoForm } from "./shipping-info-form"

interface OrderStatusActionsProps {
  order: any
}

export function OrderStatusActions({ order }: OrderStatusActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isShippingDialogOpen, setIsShippingDialogOpen] = useState(false)

  const handleStatusUpdate = async (status: string) => {
    setIsUpdating(true)
    try {
      const result = await updateOrderStatus(order.id, status)
      if (result.success) {
        toast({
          title: "Order status updated",
          description: `Order status has been updated to ${status}.`,
        })
      } else {
        toast({
          title: "Error updating order status",
          description: result.error || "An error occurred while updating order status.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error updating order status",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isShippingDialogOpen} onOpenChange={setIsShippingDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Package className="mr-2 h-4 w-4" />
            {order.shipping_info?.tracking_number ? "Update Shipping" : "Add Shipping Info"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Shipping Information</DialogTitle>
          </DialogHeader>
          <ShippingInfoForm
            orderId={order.id}
            existingInfo={order.shipping_info}
            onSuccess={() => setIsShippingDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isUpdating}>
            {isUpdating ? (
              "Updating..."
            ) : (
              <>
                Change Status <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {order.status !== "pending" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("pending")}>
              <Clock className="mr-2 h-4 w-4" />
              Mark as Pending
            </DropdownMenuItem>
          )}
          {order.status !== "paid" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("paid")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Paid
            </DropdownMenuItem>
          )}
          {order.status !== "fulfilled" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("fulfilled")}>
              <Package className="mr-2 h-4 w-4" />
              Mark as Fulfilled
            </DropdownMenuItem>
          )}
          {order.status !== "cancelled" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("cancelled")}>
              <XCircle className="mr-2 h-4 w-4" />
              Mark as Cancelled
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
