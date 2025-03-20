"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckCircle, XCircle, Clock, CreditCard, ChevronDown } from "lucide-react"
import { updateOrderStatus } from "@/app/actions/admin-actions"
import { useToast } from "@/components/ui/use-toast"

export function OrderStatusActions({ order }) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (status: "pending" | "paid" | "fulfilled" | "cancelled") => {
    setIsUpdating(true)

    try {
      const result = await updateOrderStatus(order.id, status)

      if (result.success) {
        toast({
          title: "Order updated",
          description: `Order status changed to ${status}`,
        })

        // Refresh the page to show updated data
        window.location.reload()
      } else {
        toast({
          title: "Update failed",
          description: result.error || "Failed to update order status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isUpdating}>
          {isUpdating ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
          ) : null}
          Update Status
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleStatusUpdate("pending")}
          disabled={order.status === "pending"}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" /> Mark as Pending
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusUpdate("paid")}
          disabled={order.status === "paid"}
          className="flex items-center gap-2"
        >
          <CreditCard className="h-4 w-4" /> Mark as Paid
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusUpdate("fulfilled")}
          disabled={order.status === "fulfilled"}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" /> Mark as Fulfilled
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusUpdate("cancelled")}
          disabled={order.status === "cancelled"}
          className="flex items-center gap-2"
        >
          <XCircle className="h-4 w-4" /> Mark as Cancelled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

