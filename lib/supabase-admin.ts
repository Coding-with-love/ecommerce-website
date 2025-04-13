import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if we're in a development environment
const isDevelopment = process.env.NODE_ENV === 'development'

// Initialize supabaseAdmin
let supabaseAdmin: any

// Improved error handling with more specific messages
if (!supabaseUrl || !supabaseServiceKey) {
  // Only show detailed error messages in development
  if (isDevelopment) {
    console.error("⚠️ Supabase Admin Client Error:")
    if (!supabaseUrl) console.error("  - NEXT_PUBLIC_SUPABASE_URL is missing")
    if (!supabaseServiceKey) console.error("  - SUPABASE_SERVICE_ROLE_KEY is missing")
    console.error("\nPlease add these environment variables to your .env.local file:")
    console.error(`
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
    `)
    console.error("\nYou can find these values in your Supabase project settings.")
  } else {
    console.error("Supabase Admin Client Error: Missing environment variables")
  }

  // Create a dummy client that logs errors when used
  supabaseAdmin = {
    from: () => ({
      select: () => {
        if (isDevelopment) console.error("⚠️ Supabase admin client was called but environment variables are missing")
        return { data: null, error: new Error("Supabase admin client not properly initialized") }
      },
      update: () => ({ error: new Error("Supabase admin client not properly initialized") }),
      insert: () => ({ error: new Error("Supabase admin client not properly initialized") }),
      delete: () => ({ error: new Error("Supabase admin client not properly initialized") }),
      eq: () => ({ error: new Error("Supabase admin client not properly initialized") }),
    }),
    auth: {
      getSession: () => ({ data: { session: null }, error: null }),
      admin: {
        updateUserById: () => ({ error: new Error("Supabase admin client not properly initialized") }),
        listUsers: () => ({ data: { users: [] }, error: new Error("Supabase admin client not properly initialized") }),
        getUserByEmail: () => ({ data: null, error: new Error("Supabase admin client not properly initialized") }),
        createUser: () => ({ data: null, error: new Error("Supabase admin client not properly initialized") }),
      },
    },
    storage: {
      from: () => ({
        upload: () => ({ error: new Error("Supabase admin client not properly initialized") }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  }
} else {
  // Create the real client if we have the required variables
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Disable email confirmation requirement for a user
 * This should only be used in controlled environments
 */
export async function confirmUserEmail(userId: string) {
  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { email_confirm: true })

    if (error) {
      console.error("Error confirming user email:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error confirming user email:", error)
    return { success: false, error }
  }
}

/**
 * Get user by email - admin function
 */
export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error("Error listing users:", error)
      return null
    }

    const user = data.users.find((u) => u.email === email)
    return user || null
  } catch (error) {
    console.error("Unexpected error getting user by email:", error)
    return null
  }
}

export { supabaseAdmin }
