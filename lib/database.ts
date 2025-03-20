import type { Customer, Order, OrderItem } from "./supabase"
import { supabaseAdmin } from "./supabase-admin"

/**
 * Find or create a customer in the database
 */
export async function findOrCreateCustomer({
  name,
  email,
  address,
  city,
  state,
  postalCode,
  country,
  phone = "",
}: {
  name: string
  email: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  phone?: string
}): Promise<Customer | null> {
  try {
    // First look up customer by email - using admin client to bypass RLS
    const { data: existingCustomers, error: lookupError } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("email", email)
      .limit(1)

    if (lookupError) {
      console.error("Error looking up customer:", lookupError)
      return null
    }

    // If customer exists, update their information
    if (existingCustomers && existingCustomers.length > 0) {
      const existingCustomer = existingCustomers[0]

      // Update customer with new information - using admin client to bypass RLS
      const { data: updatedCustomer, error: updateError } = await supabaseAdmin
        .from("customers")
        .update({
          name,
          address,
          city,
          state,
          postal_code: postalCode,
          country,
          phone,
        })
        .eq("id", existingCustomer.id)
        .select()

      if (updateError) {
        console.error("Error updating customer:", updateError)
        return existingCustomer // Return existing customer if update fails
      }

      return updatedCustomer?.[0] || existingCustomer
    }

    // Create new customer if they don't exist
    // First, check if there's an existing auth user with this email
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserByEmail(email)

    let userId = authUser?.id

    // If no auth user exists, create one
    if (!userId) {
      const tempPassword = generateRandomPassword()
      const { data: newAuthUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm the email
        user_metadata: { name },
      })

      if (signUpError || !newAuthUser?.id) {
        console.error("Error creating new auth user:", signUpError)
        return null
      }

      userId = newAuthUser.id
    }

    // Create the customer record linked to the auth user - using admin client to bypass RLS
    const { data: newCustomer, error: insertError } = await supabaseAdmin
      .from("customers")
      .insert({
        id: userId,
        name,
        email,
        address,
        city,
        state,
        postal_code: postalCode,
        country,
        phone,
      })
      .select()

    if (insertError) {
      console.error("Error creating new customer:", insertError)
      return null
    }

    return newCustomer?.[0] || null
  } catch (error) {
    console.error("Unexpected error in findOrCreateCustomer:", error)
    return null
  }
}

/**
 * Create a new order in the database
 */
export async function createOrder({
  customerId,
  stripeSessionId,
  total,
  currency = "usd",
  status = "pending",
}: {
  customerId: string
  stripeSessionId: string
  total: number
  currency?: string
  status?: "pending" | "paid" | "fulfilled" | "cancelled"
}): Promise<Order | null> {
  try {
    // Use admin client to bypass RLS
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_id: customerId,
        stripe_session_id: stripeSessionId,
        status,
        total,
        currency,
      })
      .select()

    if (error) {
      console.error("Error creating order:", error)
      return null
    }

    return order?.[0] || null
  } catch (error) {
    console.error("Unexpected error in createOrder:", error)
    return null
  }
}

/**
 * Add items to an order
 */
export async function addOrderItems({
  orderId,
  items,
}: {
  orderId: string
  items: Array<{
    productId: string
    productName: string
    price: number
    quantity: number
  }>
}): Promise<OrderItem[] | null> {
  try {
    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      product_name: item.productName,
      price: item.price,
      quantity: item.quantity,
    }))

    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin.from("order_items").insert(orderItems).select()

    if (error) {
      console.error("Error adding order items:", error)
      return null
    }

    return data || null
  } catch (error) {
    console.error("Unexpected error in addOrderItems:", error)
    return null
  }
}

/**
 * Update order after payment is complete
 */
export async function updateOrderAfterPayment({
  stripeSessionId,
  paymentIntentId,
  shippingAddress,
  billingAddress,
  status = "paid",
}: {
  stripeSessionId: string
  paymentIntentId?: string
  shippingAddress?: any
  billingAddress?: any
  status?: "pending" | "paid" | "fulfilled" | "cancelled"
}): Promise<Order | null> {
  try {
    // Use admin client to bypass RLS
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update({
        stripe_payment_intent_id: paymentIntentId,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        status,
      })
      .eq("stripe_session_id", stripeSessionId)
      .select()

    if (error) {
      console.error("Error updating order after payment:", error)
      return null
    }

    return order?.[0] || null
  } catch (error) {
    console.error("Unexpected error in updateOrderAfterPayment:", error)
    return null
  }
}

/**
 * Get order by Stripe session ID
 */
export async function getOrderBySessionId(sessionId: string): Promise<{
  order: Order | null
  items: OrderItem[] | null
  customer: Customer | null
}> {
  try {
    // Use admin client to bypass RLS
    const { data: orders, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .limit(1)

    if (orderError || !orders || orders.length === 0) {
      console.error("Error fetching order:", orderError)
      return { order: null, items: null, customer: null }
    }

    const order = orders[0]

    // Get the customer
    const { data: customers, error: customerError } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("id", order.customer_id)
      .limit(1)

    if (customerError) {
      console.error("Error fetching customer:", customerError)
    }

    // Get the order items
    const { data: items, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)

    if (itemsError) {
      console.error("Error fetching order items:", itemsError)
    }

    return {
      order,
      items: items || null,
      customer: customers?.[0] || null,
    }
  } catch (error) {
    console.error("Unexpected error in getOrderBySessionId:", error)
    return { order: null, items: null, customer: null }
  }
}

/**
 * Utility function to generate a random password
 */
function generateRandomPassword(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

