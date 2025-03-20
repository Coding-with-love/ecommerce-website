import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrdersWithCustomers } from "@/app/actions/admin-actions"
import { OrdersFilters } from "@/components/admin/orders-filters"
import { OrdersTable } from "@/components/admin/orders-table"

export const dynamic = "force-dynamic" // Ensure the page is not cached

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get query parameters without client-side logging
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page, 10) : 1
  const status = typeof searchParams.status === "string" ? searchParams.status : "all"
  const search = typeof searchParams.search === "string" ? searchParams.search : ""

  // Fetch orders - pass undefined for status if it's "all"
  const response = await getOrdersWithCustomers(page, 10, status !== "all" ? status : undefined, search || undefined)

  const orders = response.success ? response.data : []
  const pagination = response.success ? response.pagination : { page: 1, limit: 10, total: 0, totalPages: 1 }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        {status !== "all" && (
          <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Filtered by status: {status}</div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersFilters initialStatus={status} initialSearch={search} />

          <div className="mt-6">
            <OrdersTable orders={orders} />
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Build query params for this page link
                  const pageParams = new URLSearchParams()
                  pageParams.set("page", pageNum.toString())
                  if (status && status !== "all") pageParams.set("status", status)
                  if (search) pageParams.set("search", search)

                  return (
                    <Link
                      key={pageNum}
                      href={`/admin/orders?${pageParams.toString()}`}
                      className={`px-3 py-1 rounded ${
                        pageNum === pagination.page
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

