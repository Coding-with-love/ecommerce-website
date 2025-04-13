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
export async function isAdmin(): Promise<boolean> {
  try {
    // Get the current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData.session) {
      return false
    }

    // Check if the user has the admin role in their metadata
    const userRole = sessionData.session.user?.user_metadata?.role

    return userRole === "admin"
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}
// Function to set admin role for a user (to be used by a superadmin)
export async function setAdminRole(userId: string, isAdmin = true) {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: isAdmin ? "admin" : "user" },
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error setting admin role:", error)
    return { success: false, error }
  }
}
