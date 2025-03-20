"use client"

import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, CheckCircle, XCircle, Clock, CreditCard } from "lucide-react"
import { updateOrderStatus } from "@/app/actions/admin-actions"
import { useToast } from "@/components/ui/use-toast"

export function OrdersTable({ orders = [] }) {
  const { toast } = useToast()
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  const handleStatusUpdate = async (orderId: string, status: "pending" | "paid" | "fulfilled" | "cancelled") => {
    setUpdatingOrderId(orderId)

    try {
      const result = await updateOrderStatus(orderId, status)

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
      setUpdatingOrderId(null)
    }
  }

  if (orders.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No orders found</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">Order ID</th>
            <th className="text-left py-3 px-4 font-medium">Customer</th>
            <th className="text-left py-3 px-4 font-medium">Date</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-right py-3 px-4 font-medium">Amount</th>
            <th className="text-right py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                  #{order.id.slice(-8).toUpperCase()}
                </Link>
              </td>
              <td className="py-3 px-4">
                <div>{order.customers?.name || "Unknown"}</div>
                <div className="text-sm text-muted-foreground">{order.customers?.email}</div>
              </td>
              <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
              <td className="py-3 px-4">
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
              </td>
              <td className="py-3 px-4 text-right">{formatCurrency(order.total, order.currency)}</td>
              <td className="py-3 px-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={updatingOrderId === order.id}>
                      {updatingOrderId === order.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                      ) : (
                        <MoreHorizontal className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(order.id, "pending")}
                      disabled={order.status === "pending"}
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4" /> Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(order.id, "paid")}
                      disabled={order.status === "paid"}
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" /> Mark as Paid
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(order.id, "fulfilled")}
                      disabled={order.status === "fulfilled"}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" /> Mark as Fulfilled
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(order.id, "cancelled")}
                      disabled={order.status === "cancelled"}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" /> Mark as Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

