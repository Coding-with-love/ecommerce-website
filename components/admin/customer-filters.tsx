"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Filter, X } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CustomerFiltersProps {
  onFilterChange: (filters: any) => void
}

export function CustomerFilters({ onFilterChange }: CustomerFiltersProps) {
  const [orderStatus, setOrderStatus] = useState<string>("")
  const [minOrderValue, setMinOrderValue] = useState<string>("")
  const [hasOrders, setHasOrders] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)
  
  const handleApplyFilters = () => {
    onFilterChange({
      orderStatus: orderStatus || undefined,
      minOrderValue: minOrderValue ? parseFloat(minOrderValue) : undefined,
      hasOrders,
    })
    setIsOpen(false)
  }
  
  const handleResetFilters = () => {
    setOrderStatus("")
    setMinOrderValue("")
    setHasOrders(false)
    onFilterChange({})
    setIsOpen(false)
  }
  
  // Count active filters
  const activeFilterCount = [
    orderStatus,
    minOrderValue,
    hasOrders,
  ].filter(Boolean).length
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter Customers</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-muted-foreground" 
              onClick={handleResetFilters}
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="order-status">Order Status</Label>
            <Select value={orderStatus} onValueChange={setOrderStatus}>
              <SelectTrigger id="order-status">
                <SelectValue placeholder="Any status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="min-order-value">Minimum Order Value</Label>
            <Input
              id="min-order-value"
              type="number"
              placeholder="Enter amount"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="has-orders"
              checked={hasOrders}
              onCheckedChange={setHasOrders}
            />
            <Label htmlFor="has-orders">Has placed orders</Label>
          </div>
          
          <Button className="w-full" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
