"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { submitProductReview } from "@/app/actions/review-actions"
import type { ReviewFormData } from "@/app/actions/review-actions"

interface ReviewFormProps {
  productId: string
  orders: Array<{ id: string }>
  onSuccess?: () => void
}

export function ReviewForm({ productId, orders, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Use the first order by default
  const orderId = orders[0]?.id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Validate form
    const newErrors: Record<string, string> = {}
    if (rating === 0) {
      newErrors.rating = "Please select a rating"
    }
    if (!comment.trim()) {
      newErrors.comment = "Please enter a review comment"
    } else if (comment.length < 3) {
      newErrors.comment = "Review comment must be at least 3 characters"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const formData: ReviewFormData = {
        productId,
        orderId,
        rating,
        comment,
      }

      const result = await submitProductReview(formData)

      if (result.success) {
        toast({
          title: "Review submitted",
          description: "Thank you for your review!",
        })
        setRating(0)
        setComment("")
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit review",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rating">Your Rating</Label>
        <div className="flex items-center">
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
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-300"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        {errors.rating && <p className="text-sm text-red-500">{errors.rating}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Your Review</Label>
        <Textarea
          id="comment"
          placeholder="Share your experience with this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          disabled={isSubmitting}
        />
        {errors.comment && <p className="text-sm text-red-500">{errors.comment}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
