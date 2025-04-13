"use server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Order review schema for validation
const orderReviewSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
})

export type OrderReviewFormData = z.infer<typeof orderReviewSchema>

// Submit an order review and create product reviews for all products in the order
export async function submitOrderReview(formData: OrderReviewFormData) {
  try {
    console.log(`Submitting review for order ${formData.orderId}`)

    // Validate orderId
    if (!formData.orderId || formData.orderId === "undefined") {
      console.error("Invalid order ID:", formData.orderId)
      return { success: false, error: "Invalid order ID" }
    }

    // Validate form data
    const validatedData = orderReviewSchema.parse(formData)

    // Create a server-side Supabase client with proper cookie handling
    const serverSupabase = createServerSupabaseClient()

    // Get the current user using the server client
    const {
      data: { user },
    } = await serverSupabase.auth.getUser()

    if (!user) {
      console.error("User not authenticated when submitting review")
      return { success: false, error: "User not authenticated. Please sign in again." }
    }

    console.log(`User ${user.id} submitting review for order ${validatedData.orderId}`)

    // 1. First, save the order review
    const { data: orderReviewData, error: orderReviewError } = await supabaseAdmin
      .from("order_reviews")
      .insert({
        order_id: validatedData.orderId,
        user_id: user.id,
        rating: validatedData.rating,
        comment: validatedData.comment || "",
      })
      .select()

    if (orderReviewError) {
      console.error("Error submitting order review:", orderReviewError)
      return { success: false, error: `Failed to submit order review: ${orderReviewError.message}` }
    }

    console.log("Order review saved successfully:", orderReviewData)

    // 2. Get all products from this order
    const { data: orderItems, error: orderItemsError } = await serverSupabase
      .from("order_items")
      .select("product_id")
      .eq("order_id", validatedData.orderId)
      .not("product_id", "is", null)

    if (orderItemsError) {
      console.error("Error fetching order items:", orderItemsError)
      return {
        success: true,
        warning: "Order review saved but product reviews could not be created",
        data: orderReviewData,
      }
    }

    console.log(`Found ${orderItems?.length || 0} products to review in order ${validatedData.orderId}`)

    // 3. Create product reviews for each product in the order
    if (orderItems && orderItems.length > 0) {
      console.log(`Creating reviews for ${orderItems.length} products in order ${validatedData.orderId}`)

      // Process each product review individually for better error handling
      for (const item of orderItems) {
        if (!item.product_id) {
          console.warn(`Skipping review for item without product_id in order ${validatedData.orderId}`)
          continue
        }

        console.log(`Creating review for product ${item.product_id}`)

        const productReview = {
          product_id: item.product_id,
          user_id: user.id,
          order_id: validatedData.orderId,
          rating: validatedData.rating,
          comment: validatedData.comment || `Reviewed as part of order #${validatedData.orderId.slice(0, 8)}`,
        }

        try {
          const { error: productReviewError } = await supabaseAdmin.from("reviews").upsert([productReview], {
            onConflict: "product_id,user_id,order_id",
            ignoreDuplicates: false,
          })

          if (productReviewError) {
            console.error(`Error creating review for product ${item.product_id}:`, productReviewError)
          } else {
            console.log(`Successfully created review for product ${item.product_id}`)
            // Explicitly revalidate this product's page
            revalidatePath(`/product/${item.product_id}`)
          }
        } catch (error) {
          console.error(`Unexpected error creating review for product ${item.product_id}:`, error)
        }
      }
    }

    // Revalidate the order page
    revalidatePath(`/orders/${validatedData.orderId}`)

    return { success: true, data: orderReviewData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error in submitOrderReview:", error.flatten())
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.flatten().fieldErrors,
      }
    }

    console.error("Unexpected error submitting order review:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Get order review by order ID
export async function getOrderReview(orderId: string) {
  try {
    // Validate orderId
    if (!orderId || orderId === "undefined") {
      console.error("Invalid order ID in getOrderReview:", orderId)
      return { success: false, error: "Invalid order ID" }
    }

    // Create a server-side Supabase client with proper cookie handling
    const serverSupabase = createServerSupabaseClient()

    // Get the current user using the server client
    const {
      data: { user },
    } = await serverSupabase.auth.getUser()

    if (!user) {
      console.log("No authenticated user found in getOrderReview")
      return { success: false, error: "User not authenticated" }
    }

    console.log(`Checking for review by user ${user.id} for order ${orderId}`)

    const { data, error } = await serverSupabase
      .from("order_reviews")
      .select("*")
      .eq("order_id", orderId)
      .eq("user_id", user.id)
      .single()

    if (error && error.code !== "PGSQL_ERROR_NO_DATA") {
      console.error("Error fetching order review:", error)
      return { success: false, error: `Failed to fetch order review: ${error.message}` }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Unexpected error fetching order review:", error)
    return { success: false, error: `An unexpected error occurred: ${error?.message || "Unknown error"}` }
  }
}
