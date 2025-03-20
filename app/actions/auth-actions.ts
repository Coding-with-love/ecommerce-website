"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { isAdmin } from "@/lib/admin"
import { revalidatePath } from "next/cache"

// Update order status
export async function updateOrderStatus(orderId: string, status: "pending" | "paid" | "fulfilled" | "cancelled") {
  try {
    // Check if the current user is an admin
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if supabaseAdmin is properly initialized
    if (!supabaseAdmin || typeof supabaseAdmin.from !== "function") {
      console.error("supabaseAdmin client is not properly initialized")
      return { success: false, error: "Database client initialization error" }
    }

    // Update the order status
    const { error } = await supabaseAdmin.from("orders").update({ status }).eq("id", orderId)

    if (error) throw error

    // Revalidate the admin pages
    revalidatePath("/admin")
    revalidatePath("/admin/orders")
    revalidatePath(`/admin/orders/${orderId}`)

    return { success: true }
  } catch (error) {
    console.error("Error updating order status:", error)
    return { success: false, error: "Failed to update order status" }
  }
}

// Get all orders with customer information
export async function getOrdersWithCustomers(page = 1, limit = 10, status?: string, search?: string) {
  try {
    // Check if the current user is an admin
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if supabaseAdmin is properly initialized
    if (!supabaseAdmin || typeof supabaseAdmin.from !== "function") {
      console.error("supabaseAdmin client is not properly initialized")
      return {
        success: false,
        error: "Database client initialization error",
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      }
    }

    // Build the query
    let query = supabaseAdmin
      .from("orders")
      .select(`
        *,
        customers (id, name, email)
      `)
      .order("created_at", { ascending: false })

    // Apply status filter if provided
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    // Apply search if provided
    if (search) {
      query = query.or(`customers.name.ilike.%${search}%,customers.email.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute the query
    const { data, error, count } = await query

    if (error) throw error

    // Get total count for pagination
    const { count: totalCount } = await supabaseAdmin.from("orders").select("*", { count: "exact" })

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return {
      success: false,
      error: "Failed to fetch orders",
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    }
  }
}

// Get order details with items and customer
export async function getOrderDetails(orderId: string) {
  try {
    // Check if the current user is an admin
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if supabaseAdmin is properly initialized
    if (!supabaseAdmin || typeof supabaseAdmin.from !== "function") {
      console.error("supabaseAdmin client is not properly initialized")
      return { success: false, error: "Database client initialization error" }
    }

    // Get the order with related data
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        customers (*)
      `)
      .eq("id", orderId)
      .single()

    if (orderError) throw orderError

    // Get the order items
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)

    if (itemsError) throw itemsError

    return {
      success: true,
      data: {
        ...order,
        order_items: orderItems,
      },
    }
  } catch (error) {
    console.error("Error fetching order details:", error)
    return { success: false, error: "Failed to fetch order details" }
  }
}

