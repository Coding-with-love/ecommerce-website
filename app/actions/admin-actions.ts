"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

// Helper function to check if supabaseAdmin is properly initialized
function isSupabaseAdminInitialized() {
  // Check if we have a real supabaseAdmin client or the dummy one
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return false
  }
  return true
}

// Get all customers
export async function getCustomers(page = 1, limit = 10, search?: string) {
  if (!isSupabaseAdminInitialized()) {
    return {
      success: false,
      error: "Supabase Admin Client not properly initialized. Please check your environment variables.",
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    }
  }

  try {
    // Build the base query
    let query = supabaseAdmin.from("customers").select("*", { count: "exact" })

    // Apply search if provided
    if (search && search.trim() !== "") {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
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
        error: "Failed to fetch customers",
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
      error: "Failed to fetch customers",
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

// Get customer by ID
export async function getCustomerById(id: string) {
  if (!isSupabaseAdminInitialized()) {
    return {
      success: false,
      error: "Supabase Admin Client not properly initialized. Please check your environment variables.",
      data: null,
    }
  }

  try {
    const { data, error } = await supabaseAdmin.from("customers").select("*").eq("id", id).single()

    if (error) {
      return { success: false, error: "Failed to fetch customer", data: null }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: "An unexpected error occurred", data: null }
  }
}

// Create a new customer
export async function createCustomer(customerData: any) {
  if (!isSupabaseAdminInitialized()) {
    return {
      success: false,
      error: "Supabase Admin Client not properly initialized. Please check your environment variables.",
    }
  }

  try {
    const { data, error } = await supabaseAdmin.from("customers").insert(customerData).select().single()

    if (error) {
      return { success: false, error: "Failed to create customer" }
    }

    revalidatePath("/admin/customers")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Update an existing customer
export async function updateCustomer(id: string, customerData: any) {
  if (!isSupabaseAdminInitialized()) {
    return {
      success: false,
      error: "Supabase Admin Client not properly initialized. Please check your environment variables.",
    }
  }

  try {
    const { data, error } = await supabaseAdmin.from("customers").update(customerData).eq("id", id).select().single()

    if (error) {
      return { success: false, error: "Failed to update customer" }
    }

    revalidatePath("/admin/customers")
    revalidatePath(`/admin/customers/${id}`)
    return { success: true, data }
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Delete a customer
export async function deleteCustomer(id: string) {
  if (!isSupabaseAdminInitialized()) {
    return {
      success: false,
      error: "Supabase Admin Client not properly initialized. Please check your environment variables.",
    }
  }

  try {
    const { error } = await supabaseAdmin.from("customers").delete().eq("id", id)

    if (error) {
      return { success: false, error: "Failed to delete customer" }
    }

    revalidatePath("/admin/customers")
    return { success: true }
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Export customers to CSV
export async function exportCustomersToCSV() {
  if (!isSupabaseAdminInitialized()) {
    return {
      success: false,
      error: "Supabase Admin Client not properly initialized. Please check your environment variables.",
    }
  }

  try {
    // Fetch all customers
    const { data, error } = await supabaseAdmin.from("customers").select("*").order("created_at", { ascending: false })

    if (error) {
      return { success: false, error: "Failed to fetch customers for export" }
    }

    // Convert to CSV format
    const headers = ["ID", "Name", "Email", "Phone", "Created At", "Updated At"]
    const csvRows = [
      headers.join(","),
      ...data.map((customer) =>
        [
          customer.id,
          `"${customer.name || ""}"`,
          `"${customer.email || ""}"`,
          `"${customer.phone || ""}"`,
          customer.created_at,
          customer.updated_at,
        ].join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")

    // Create a Blob and return a URL
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    return { success: true, url }
  } catch (error) {
    return { success: false, error: "An unexpected error occurred during export" }
  }
}

// Make sure the getOrdersWithCustomers function is properly defined and exported

// Add this function if it's missing or update it if it exists
export async function getOrdersWithCustomers(page = 1, limit = 10, status?: string, search?: string) {
  if (!isSupabaseAdminInitialized()) {
    return {
      success: false,
      error: "Supabase Admin Client not properly initialized. Please check your environment variables.",
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    }
  }

  try {
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
