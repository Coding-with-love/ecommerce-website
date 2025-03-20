import { getAdminStats } from "@/lib/admin"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrdersWithCustomers } from "../actions/admin-actions"
import Link from "next/link"
import { DollarSign, ShoppingCart, Clock, CheckCircle, CreditCard, XCircle, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabaseAdmin } from "@/lib/supabase-admin"

export default async function AdminDashboard() {
  // Get admin stats
  const stats = await getAdminStats()

  // Get recent orders
  const ordersResponse = await getOrdersWithCustomers(1, 5)
  const recentOrders = ordersResponse.success ? ordersResponse.data : []

  // Get revenue data for chart
  const { data: revenueData } = await supabaseAdmin
    .from("orders")
    .select("created_at, total")
    .order("created_at", { ascending: true })
    .limit(100)

  // Process data for chart - group by month
  const monthlyRevenue =
    revenueData?.reduce((acc, order) => {
      const date = new Date(order.created_at)
      const month = date.toLocaleString("default", { month: "short" })

      if (!acc[month]) {
        acc[month] = 0
      }

      acc[month] += order.total
      return acc
    }, {}) || {}

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</span>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-blue-600 mt-1">Lifetime sales</p>
            <div className="mt-4 h-1 w-full bg-blue-200 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: "100%" }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{stats.totalOrders}</div>
            <p className="text-xs text-green-600 mt-1">All time orders</p>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">
                {stats.totalOrders > 0 ? "Active orders" : "No orders yet"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Pending Orders</CardTitle>
            <Clock className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">{stats.pendingOrders}</div>
            <p className="text-xs text-amber-600 mt-1">Awaiting processing</p>
            <div className="mt-4 h-1 w-full bg-amber-200 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: stats.totalOrders ? `${(stats.pendingOrders / stats.totalOrders) * 100}%` : "0%" }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Fulfilled Orders</CardTitle>
            <CheckCircle className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{stats.fulfilledOrders}</div>
            <p className="text-xs text-purple-600 mt-1">Completed orders</p>
            <div className="mt-4 h-1 w-full bg-purple-200 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full"
                style={{ width: stats.totalOrders ? `${(stats.fulfilledOrders / stats.totalOrders) * 100}%` : "0%" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalOrders > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.pendingOrders}</span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round((stats.pendingOrders / stats.totalOrders) * 100)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Paid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.paidOrders}</span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round((stats.paidOrders / stats.totalOrders) * 100)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${(stats.paidOrders / stats.totalOrders) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Fulfilled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.fulfilledOrders}</span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round((stats.fulfilledOrders / stats.totalOrders) * 100)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${(stats.fulfilledOrders / stats.totalOrders) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">Cancelled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.cancelledOrders}</span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round((stats.cancelledOrders / stats.totalOrders) * 100)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: `${(stats.cancelledOrders / stats.totalOrders) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
                <p>No order data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(monthlyRevenue).length > 0 ? (
              <div className="h-[250px] flex items-end gap-2">
                {Object.entries(monthlyRevenue).map(([month, amount]) => {
                  const maxAmount = Math.max(...Object.values(monthlyRevenue))
                  const percentage = (amount / maxAmount) * 100

                  return (
                    <div key={month} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t-md transition-all duration-500"
                        style={{ height: `${percentage}%`, minHeight: "10px" }}
                      ></div>
                      <div className="mt-2 text-xs font-medium">{month}</div>
                      <div className="text-xs text-muted-foreground">{formatCurrency(amount)}</div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                <TrendingUp className="h-12 w-12 mb-2 opacity-20" />
                <p>No revenue data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-right py-3 px-4 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                              #{order.id.slice(-8).toUpperCase()}
                            </Link>
                          </td>
                          <td className="py-3 px-4">
                            <div>{order.customers?.name || "Unknown"}</div>
                            <div className="text-xs text-muted-foreground">{order.customers?.email}</div>
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
                                      : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {order.status === "fulfilled" && <CheckCircle className="mr-1 h-3 w-3" />}
                              {order.status === "cancelled" && <XCircle className="mr-1 h-3 w-3" />}
                              {order.status === "paid" && <CreditCard className="mr-1 h-3 w-3" />}
                              {order.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {formatCurrency(order.total, order.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-md">
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    When customers place orders, they will appear here.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending">
              {recentOrders.filter((order) => order.status === "pending").length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-right py-3 px-4 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders
                        .filter((order) => order.status === "pending")
                        .map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                                #{order.id.slice(-8).toUpperCase()}
                              </Link>
                            </td>
                            <td className="py-3 px-4">
                              <div>{order.customers?.name || "Unknown"}</div>
                              <div className="text-xs text-muted-foreground">{order.customers?.email}</div>
                            </td>
                            <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-right font-medium">
                              {formatCurrency(order.total, order.currency)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No pending orders found</div>
              )}
            </TabsContent>

            <TabsContent value="paid">
              {recentOrders.filter((order) => order.status === "paid").length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-right py-3 px-4 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders
                        .filter((order) => order.status === "paid")
                        .map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                                #{order.id.slice(-8).toUpperCase()}
                              </Link>
                            </td>
                            <td className="py-3 px-4">
                              <div>{order.customers?.name || "Unknown"}</div>
                              <div className="text-xs text-muted-foreground">{order.customers?.email}</div>
                            </td>
                            <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-right font-medium">
                              {formatCurrency(order.total, order.currency)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No paid orders found</div>
              )}
            </TabsContent>

            <TabsContent value="fulfilled">
              {recentOrders.filter((order) => order.status === "fulfilled").length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-right py-3 px-4 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders
                        .filter((order) => order.status === "fulfilled")
                        .map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                                #{order.id.slice(-8).toUpperCase()}
                              </Link>
                            </td>
                            <td className="py-3 px-4">
                              <div>{order.customers?.name || "Unknown"}</div>
                              <div className="text-xs text-muted-foreground">{order.customers?.email}</div>
                            </td>
                            <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-right font-medium">
                              {formatCurrency(order.total, order.currency)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No fulfilled orders found</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

