"use client"

import { useState, useEffect } from "react"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Search, MoreHorizontal, Mail, ExternalLink, UserPlus, Download, RefreshCw } from 'lucide-react'
import Link from "next/link"
import { format } from "date-fns"
import { EnvironmentError } from "@/components/admin/environment-error"
import { CustomerDetailsDialog } from "./customer-details-dialog"
import { CustomerFilters } from "./customer-filters"
import { exportCustomersToCSV } from "@/app/actions/admin-actions"

export function CustomersList() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [filter, setFilter] = useState<{
    orderStatus?: string;
    minOrderValue?: number;
    hasOrders?: boolean;
  }>({})
  const { toast } = useToast()
  const limit = 10

  // Check if environment variables are set
  const hasEnvVars = typeof window !== "undefined" && 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.SUPABASE_SERVICE_ROLE_KEY

  useEffect(() => {
    if (hasEnvVars) {
      fetchCustomers()
    }
  }, [page, searchQuery, filter])

  const fetchCustomers = async () => {
    setLoading(true)
    setError(null)

    try {
      // Build the query
      let query = supabaseAdmin
        .from("customers")
        .select("*, orders!inner(*)", { count: "exact" })
        .order("created_at", { ascending: false })

      // Apply search if provided
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
      }

      // Apply filters
      if (filter.orderStatus) {
        query = query.eq("orders.status", filter.orderStatus)
      }
      
      if (filter.minOrderValue) {
        query = query.gte("orders.total", filter.minOrderValue)
      }

      // Get total count before pagination
      const { count } = await query

      // Apply pagination
      query = query
        .range((page - 1) * limit, page * limit - 1)

      // Execute the query
      const { data, error: fetchError } = await query

      if (fetchError) {
        console.error("Error fetching customers:", fetchError)
        setError(fetchError.message)
        return
      }

      // Process the data to get unique customers with their order counts
      const processedCustomers = processCustomerData(data || [])
      
      setCustomers(processedCustomers)
      setTotalCustomers(count || 0)
      setTotalPages(Math.ceil((count || 0) / limit))
    } catch (err: any) {
      console.error("Unexpected error:", err)
      setError(err.message || "An unexpected error occurred")
      
      toast({
        title: "Error loading customers",
        description: err.message || "Failed to load customers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Process customer data to get unique customers with their order counts
  const processCustomerData = (data: any[]) => {
    const customerMap = new Map()
    
    data.forEach(item => {
      const customerId = item.id
      
      if (!customerMap.has(customerId)) {
        // Initialize customer with basic info
        customerMap.set(customerId, {
          ...item,
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: null,
          orders: []
        })
      }
      
      const customer = customerMap.get(customerId)
      
      // Count this order
      customer.orderCount += 1
      
      // Add to total spent if the order has a total
      if (item.orders && item.orders.total) {
        customer.totalSpent += item.orders.total
      }
      
      // Track the most recent order date
      if (item.orders && item.orders.created_at) {
        const orderDate = new Date(item.orders.created_at)
        if (!customer.lastOrderDate || orderDate > new Date(customer.lastOrderDate)) {
          customer.lastOrderDate = item.orders.created_at
        }
      }
      
      // Store order info
      if (item.orders) {
        customer.orders.push(item.orders)
      }
    })
    
    return Array.from(customerMap.values())
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page on new search
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const result = await exportCustomersToCSV()
      
      if (result.success && result.url) {
        // Create a temporary link and trigger download
        const link = document.createElement('a')
        link.href = result.url
        link.setAttribute('download', 'customers.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast({
          title: "Export successful",
          description: "Customer data has been exported to CSV",
        })
      } else {
        throw new Error(result.error || "Failed to export customers")
      }
    } catch (err: any) {
      console.error("Export error:", err)
      toast({
        title: "Export failed",
        description: err.message || "Failed to export customer data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleFilterChange = (newFilter: any) => {
    setFilter(newFilter)
    setPage(1) // Reset to first page when filters change
  }

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer)
    setIsDetailsOpen(true)
  }

  if (!hasEnvVars) {
    return <EnvironmentError />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex w-full md:w-96 items-center space-x-2">
          <Input
            type="search"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchCustomers}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            disabled={isExporting || loading}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
          
          <Button asChild size="sm">
            <Link href="/admin/customers/new">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Customer
            </Link>
          </Button>
        </div>
      </div>
      
      <CustomerFilters onFilterChange={handleFilterChange} />
      
      <Card>
        <CardHeader className="pb-1">
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            {loading 
              ? "Loading customers..." 
              : `Showing ${customers.length} of ${totalCustomers} customers`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-6 text-red-500">
              <p>Error: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchCustomers} 
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Orders</TableHead>
                    <TableHead className="hidden md:table-cell">Total Spent</TableHead>
                    <TableHead className="hidden md:table-cell">Last Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Loading skeletons
                    Array.from({ length: limit }).map((_, i) => (
                      <TableRow key={`skeleton-${i}`}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-12" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        {searchQuery 
                          ? "No customers found matching your search criteria" 
                          : "No customers found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-olive-100 flex items-center justify-center text-olive-800 font-medium">
                              {customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <span>{customer.name || "Guest"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {customer.email ? (
                            <a 
                              href={`mailto:${customer.email}`} 
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {customer.email}
                              <Mail className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">No email</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {customer.phone || <span className="text-muted-foreground">No phone</span>}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{customer.orderCount || 0}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {customer.totalSpent ? (
                            new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            }).format(customer.totalSpent)
                          ) : (
                            '$0.00'
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {customer.lastOrderDate ? (
                            format(new Date(customer.lastOrderDate), 'MMM d, yyyy')
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/customers/${customer.id}`}>
                                  Edit Customer
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a 
                                  href={`mailto:${customer.email}`}
                                  className="flex items-center cursor-pointer"
                                >
                                  Send Email
                                </a>
                              </DropdownMenuItem>
                              {customer.orderCount > 0 && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/orders?customer=${customer.id}`}>
                                    View Orders
                                  </Link>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Customer details dialog */}
      <CustomerDetailsDialog 
        customer={selectedCustomer} 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
      />
    </div>
  )
}
