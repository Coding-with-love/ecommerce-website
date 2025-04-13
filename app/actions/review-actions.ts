"use server"

import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Review schema for validation
const reviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  orderId: z.string().uuid("Invalid order ID"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3, "Review comment must be at least 3 characters").max(1000),
})

export type ReviewFormData = z.infer<typeof reviewSchema>

// Get reviews for a product
export async function getProductReviews(productId: string) {
  try {
    console.log(`Fetching reviews for product ${productId}`)

    // First, get the reviews for the product
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        updated_at,
        user_id,
        order_id
      `)
      .eq("product_id", productId)
      .order("created_at", { ascending: false })

    if (reviewsError) {
      console.error("Error fetching reviews:", reviewsError)
      return { success: false, error: `Failed to fetch reviews: ${reviewsError.message}`, data: [] }
    }

    console.log(`Found ${reviewsData.length} reviews for product ${productId}`)

    // If we have reviews, fetch the user information separately
    if (reviewsData && reviewsData.length > 0) {
      // Get unique user IDs
      const userIds = [...new Set(reviewsData.map((review) => review.user_id))]

      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", userIds)

      if (userError) {
        console.error("Error fetching user data:", userError)
        // Continue with limited user data
      }

      // Create a map of user data by ID
      const userMap = (userData || []).reduce((map: any, user: any) => {
        map[user.id] = user
        return map
      }, {})

      // Format the reviews with user data
      const formattedData = reviewsData.map((review) => {
        const user = userMap[review.user_id] || {}

        // Extract the user's name from email (before the @) if no name is available
        let name = user.name
        if (!name && user.email) {
          name = user.email.split("@")[0] || "Anonymous"
          name = name.charAt(0).toUpperCase() + name.slice(1) // Capitalize first letter
        } else if (!name) {
          name = "Anonymous"
        }

        return {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.created_at,
          updatedAt: review.updated_at,
          user: {
            id: review.user_id,
            name: name,
          },
          order: { id: review.order_id },
        }
      })

      return { success: true, data: formattedData }
    }

    // If no reviews, return empty array
    return { success: true, data: [] }
  } catch (error: any) {
    console.error("Unexpected error fetching reviews:", error)
    return { success: false, error: `An unexpected error occurred: ${error?.message || "Unknown error"}`, data: [] }
  }
}

// Get review statistics for a product
export async function getProductReviewStats(productId: string) {
  try {
    console.log(`Fetching review stats for product ${productId}`)

    // Get the average rating
    const { data: avgData, error: avgError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", productId)

    if (avgError) {
      console.error("Error fetching review ratings:", avgError)
      return { success: false, error: `Failed to fetch review statistics: ${avgError.message}` }
    }

    // Calculate average manually
    let averageRating = 0
    if (avgData && avgData.length > 0) {
      const sum = avgData.reduce((acc, review) => acc + review.rating, 0)
      averageRating = sum / avgData.length
    }

    // Get the count of reviews
    const totalReviews = avgData?.length || 0

    // Calculate the distribution
    const distribution = [0, 0, 0, 0, 0] // 5 elements for 1-5 stars
    avgData?.forEach((review) => {
      const rating = review.rating
      if (rating >= 1 && rating <= 5) {
        distribution[rating - 1]++
      }
    })

    return {
      success: true,
      data: {
        averageRating,
        totalReviews,
        distribution,
      },
    }
  } catch (error: any) {
    console.error("Unexpected error fetching review stats:", error)
    return { success: false, error: `An unexpected error occurred: ${error?.message || "Unknown error"}` }
  }
}

// Check if a user can review a product
export async function checkUserCanReview(productId: string) {
  try {
    console.log(`Checking if user can review product ${productId}`)

    // Get the current user
    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData.session?.user

    if (!user) {
      console.log("No authenticated user found")
      return { success: false, canReview: false, error: "User not authenticated" }
    }

    console.log(`Checking if user ${user.id} has purchased product ${productId}`)

    // Check if the user has purchased this product and the order is fulfilled
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        order_items!inner (
          product_id
        )
      `)
      .eq("customer_id", user.id)
      .eq("status", "fulfilled")
      .eq("order_items.product_id", productId)

    if (error) {
      console.error("Error checking if user can review:", error)
      return { success: false, canReview: false, error: `Failed to check review eligibility: ${error.message}` }
    }

    console.log(`Found ${data.length} fulfilled orders with this product`)

    // Check if the user has already reviewed this product
    const { data: existingReviews, error: reviewError } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)

    if (reviewError) {
      console.error("Error checking existing reviews:", reviewError)
      return { success: false, canReview: false, error: `Failed to check existing reviews: ${reviewError.message}` }
    }

    console.log(`User has ${existingReviews.length} existing reviews for this product`)

    // User can review if they have a fulfilled order with this product and haven't already reviewed it
    const canReview = data.length > 0 && existingReviews.length === 0

    return {
      success: true,
      canReview,
      orders: data,
      hasReviewed: existingReviews.length > 0,
    }
  } catch (error: any) {
    console.error("Unexpected error checking if user can review:", error)
    return {
      success: false,
      canReview: false,
      error: `An unexpected error occurred: ${error?.message || "Unknown error"}`,
    }
  }
}

// Submit a review
export async function submitProductReview(formData: ReviewFormData) {
  try {
    console.log(`Submitting review for product ${formData.productId}`)

    // Validate form data
    const validatedData = reviewSchema.parse(formData)

    // Get the current user
    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData.session?.user

    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    // Verify that the user can review this product
    const { success, canReview, orders } = await checkUserCanReview(validatedData.productId)

    if (!success || !canReview) {
      return { success: false, error: "You are not eligible to review this product" }
    }

    // Verify that the order ID belongs to the user and contains this product
    const validOrder = orders.some((order) => order.id === validatedData.orderId)

    if (!validOrder) {
      return { success: false, error: "Invalid order ID" }
    }

    // Insert the review
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        product_id: validatedData.productId,
        user_id: user.id,
        order_id: validatedData.orderId,
        rating: validatedData.rating,
        comment: validatedData.comment,
      })
      .select()

    if (error) {
      console.error("Error submitting review:", error)
      return { success: false, error: `Failed to submit review: ${error.message}` }
    }

    // Revalidate the product page to show the new review
    revalidatePath(`/collection/${validatedData.productId}`)

    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.flatten().fieldErrors,
      }
    }

    console.error("Unexpected error submitting review:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
