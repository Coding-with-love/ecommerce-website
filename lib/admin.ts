import { supabaseAdmin } from "./supabase-admin"

// Get dashboard statistics
export async function getAdminStats() {
  try {
    // Check if supabaseAdmin is properly initialized
    if (!supabaseAdmin || typeof supabaseAdmin.from !== "function") {
      console.error("supabaseAdmin client is not properly initialized")
      return {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        paidOrders: 0,
        fulfilledOrders: 0,
        cancelledOrders: 0,
      }
    }

    // Use supabaseAdmin to bypass RLS
    const { data: orders, error: ordersError } = await supabaseAdmin.from("orders").select("id, total, status")

    if (ordersError) {
      console.error("Error fetching orders for stats:", ordersError)
      return {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        paidOrders: 0,
        fulfilledOrders: 0,
        cancelledOrders: 0,
      }
    }

    const totalOrders = orders?.length || 0
    const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0

    // Count orders by status
    const pendingOrders = orders?.filter((order) => order.status === "pending").length || 0
    const fulfilledOrders = orders?.filter((order) => order.status === "fulfilled").length || 0
    const cancelledOrders = orders?.filter((order) => order.status === "cancelled").length || 0
    const paidOrders = orders?.filter((order) => order.status === "paid").length || 0

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      paidOrders,
      fulfilledOrders,
      cancelledOrders,
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      paidOrders: 0,
      fulfilledOrders: 0,
      cancelledOrders: 0,
    }
  }
}

export async function isAdmin() {
  try {
    const {
      data: { session },
    } = await supabaseAdmin.auth.getSession()

    if (!session?.user) {
      return false
    }

    // Check if the user has the 'admin' role in their metadata
    if (session.user.user_metadata?.role === "admin") {
      return true
    }

    // Check if the user exists in the admins table
    const { data: adminData } = await supabaseAdmin.from("admins").select("*").eq("user_id", session.user.id).single()

    return !!adminData
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

