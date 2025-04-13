"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function setupAdminUser(email: string, password: string) {
  try {
    // Check if we have admin access
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Missing service role key" }
    }

    // Create a new user or update existing one
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "admin" },
    })

    if (userError) {
      console.error("Error creating admin user:", userError)
      return { success: false, error: userError.message }
    }

    return { success: true, data: userData }
  } catch (error: any) {
    console.error("Unexpected error setting up admin:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
