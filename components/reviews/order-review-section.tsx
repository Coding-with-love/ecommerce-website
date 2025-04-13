"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { submitOrderReview, getOrderReview, type OrderReviewFormData } from "@/app/actions/order-review-actions"
import { useRouter } from "next/navigation"

interface OrderReviewSectionProps {
  orderId: string
  orderNumber: string
}

export function OrderReviewSection({ orderId, orderNumber }: OrderReviewSectionProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [existingReview, setExistingReview] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkExistingReview = async () => {
      // Validate orderId
      if (!orderId || orderId === "undefined") {
        console.error("Invalid order ID:", orderId)
        setError("Invalid order ID")
        setIsLoading(false)
        return
      }

      try {
        console.log(`Checking for existing review for order ${orderId}`)
        const result = await getOrderReview(orderId)
        if (result.success && result.data) {
          console.log(`Found existing review for order ${orderId}:`, result.data)
          setExistingReview(result.data)
          setIsSubmitted(true)
          setRating(result.data.rating)
          setComment(result.data.comment || "")
        } else {
          console.log(`No existing review found for order ${orderId}`)
        }
      } catch (error) {
        console.error("Error checking for existing review:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkExistingReview()
  }, [orderId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (rating === 0) {
      setError("Please select a rating before submitting your review.")
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      console.log(`Submitting review for order ${orderId} with rating ${rating}`)
      const formData: OrderReviewFormData = {
        orderId,
        rating,
        comment: comment.trim() || undefined,
      }

      const result = await submitOrderReview(formData)
      console.log("Review submission result:", result)

      if (result.success) {
        // Show a more prominent toast notification
        toast({
          title: "Review submitted successfully!",
          description: "Thank you for your feedback! Your review has been added to the products in your order.",
          variant: "success",
        })

        // Set state to show the confirmation UI
        setIsSubmitted(true)
        setExistingReview(result.data)

        // Force reload the page after a short delay to show the confirmation
        setTimeout(() => {
          router.refresh()
        }, 1500)
      } else if (result.warning) {
        toast({
          title: "Review partially submitted",
          description: result.warning,
          variant: "destructive",
        })
        setIsSubmitted(true)
      } else {
        if (result.error?.includes("User not authenticated")) {
          // Special handling for authentication errors
          setError("You need to be signed in to submit a review. Please sign in and try again.")
          toast({
            title: "Authentication required",
            description: "You need to be signed in to submit a review. Please sign in and try again.",
            variant: "destructive",
          })
        } else {
          setError(result.error || "Failed to submit your review. Please try again.")
          toast({
            title: "Error",
            description: result.error || "Failed to submit your review. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      console.error("Error submitting review:", error)
      setError(error?.message || "An unexpected error occurred. Please try again.")
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-olive-50 border-olive-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-800"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isSubmitted || existingReview) {
    return (
      <Card className="bg-olive-50 border-olive-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-green-100 rounded-full p-3 mb-4">
              <Star className="h-8 w-8 text-green-600 fill-green-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Thank You for Your Review!</h3>
            <p className="text-muted-foreground mb-4">We appreciate your feedback on your recent order.</p>

            <div className="flex items-center justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>

            {comment && (
              <div className="mt-4 max-w-md">
                <p className="italic text-muted-foreground">"{comment}"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-olive-50 border-olive-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          Rate Your Order Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground mb-2">
              How would you rate your experience with order #{orderNumber}?
            </p>
            <div className="flex items-center justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoverRating || rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

          <div className="space-y-2">
            <Textarea
              placeholder="Share your thoughts about your order experience (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              disabled={isSubmitting}
              className="bg-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-olive-700 hover:bg-olive-800"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Your feedback helps us improve our service and will be shared with other customers looking at these products.
      </CardFooter>
    </Card>
  )
}
