"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type FormEvent, useState, useRef } from "react"
import { useRouter } from "next/navigation"

export function OrdersFilters({
  initialStatus = "all",
  initialSearch = "",
}: {
  initialStatus?: string
  initialSearch?: string
}) {
  const [status, setStatus] = useState(initialStatus)
  const [search, setSearch] = useState(initialSearch)
  const router = useRouter()
  const isInitialRender = useRef(true)

  // Avoid any client-side effects during initial render to prevent hydration mismatch
  if (typeof window !== "undefined" && isInitialRender.current) {
    isInitialRender.current = false
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Build the query string
    const params = new URLSearchParams()

    // Only add status if it's not "all"
    if (status && status !== "all") {
      params.set("status", status)
    }

    // Only add search if it's not empty
    if (search && search.trim() !== "") {
      params.set("search", search)
    }

    const queryString = params.toString()
    const url = `/admin/orders${queryString ? `?${queryString}` : ""}`

    // Use Next.js router for navigation
    router.push(url)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name or email"
          className="pl-10"
        />
      </div>

      <div className="w-full sm:w-48">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="fulfilled">Fulfilled</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="shrink-0">
        <Filter size={18} className="mr-2" />
        Apply Filters
      </Button>
    </form>
  )
}

