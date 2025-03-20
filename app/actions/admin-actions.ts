"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

// Get all orders with customer information
export async function getOrdersWithCustomers(page = 1, limit = 10, status?: string, search?: string) {
  try {
    // Check if supabaseAdmin is properly initialized
    if (!supabaseAdmin || typeof supabaseAdmin.from !== "function") {
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

    // Build the base query
    let query = supabaseAdmin.from("orders").select(
      `
        *,
        customers (id, name, email)
      `,
      { count: "exact" },
    )

    // Apply status filter if provided
    if (status) {
      query = query.eq("status", status)
    }

    // Apply search if provided
    if (search && search.trim() !== "") {
      query = query.or(`customers.name.ilike.%${search}%,customers.email.ilike.%${search}%`)
    }

    // Get total count before pagination
    const { count: totalCount } = await query

    // Apply sorting and pagination to the main query
    query = query.order("created_at", { ascending: false }).range((page - 1) * limit, page * limit - 1)

    // Execute the main query
    const { data, error } = await query

    if (error) {
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

    return {
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
      },
    }
  } catch (error) {
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

// Update order status
export async function updateOrderStatus(orderId: string, status: "pending" | "paid" | "fulfilled" | "cancelled") {
  try {
    // Check if supabaseAdmin is properly initialized
    if (!supabaseAdmin || typeof supabaseAdmin.from !== "function") {
      return { success: false, error: "Database client initialization error" }
    }

    const { error } = await supabaseAdmin.from("orders").update({ status }).eq("id", orderId)

    if (error) {
      console.error("Error updating order status:", error)
      return { success: false, error: "Failed to update order status" }
    }

    revalidatePath("/admin/orders")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating order status:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Get order details by ID
export async function getOrderDetails(orderId: string) {
  try {
    // Check if supabaseAdmin is properly initialized
    if (!supabaseAdmin || typeof supabaseAdmin.from !== "function") {
      return { success: false, error: "Database client initialization error", data: null }
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        customers (id, name, email, phone),
        order_items (*)
      `)
      .eq("id", orderId)
      .single()

    if (error) {
      console.error("Error fetching order details:", error)
      return { success: false, error: "Failed to fetch order details", data: null }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error fetching order details:", error)
    return { success: false, error: "An unexpected error occurred", data: null }
  }
}

