import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for Supabase tables
export type Customer = {
  id?: string
  name: string
  email: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  phone?: string
  created_at?: string
}

export type Order = {
  id?: string
  customer_id: string
  stripe_session_id: string
  stripe_payment_intent_id?: string
  status: "pending" | "paid" | "fulfilled" | "cancelled"
  total: number
  currency: string
  shipping_address?: {
    name?: string
    address?: {
      line1?: string
      line2?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
  }
  billing_address?: {
    name?: string
    address?: {
      line1?: string
      line2?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
  }
  created_at?: string
}

export type OrderItem = {
  id?: string
  order_id: string
  product_id: string
  product_name: string
  price: number
  quantity: number
  created_at?: string
}

