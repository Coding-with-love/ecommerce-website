"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getProductReviews } from "@/app/actions/review-actions"
import { formatDistanceToNow } from "date-fns"

interface ReviewListProps {
  productId: string
}

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        console.log("Fetching reviews for product:", productId)
        const result = await getProductReviews(productId)
        if (result.success) {
          console.log("Reviews fetched successfully:", result.data)
          setReviews(result.data)
        } else {
          console.error("Error fetching reviews:", result.error)
          setError(result.error || "Failed to load reviews")
        }
      } catch (err) {
        console.error("Unexpected error fetching reviews:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()

    // Set up a refresh interval to check for new reviews
    const intervalId = setInterval(fetchReviews, 10000) // Refresh every 10 seconds

    return () => clearInterval(intervalId)
  }, [productId])

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (reviews.length === 0) {
    return <div className="text-muted-foreground">No reviews yet. Be the first to review this product!</div>
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-olive-100 flex items-center justify-center text-olive-800 font-medium">
                  {review.user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium">{review.user.name}</h4>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Verified Purchase</div>
          </div>
          <p className="text-muted-foreground mt-2">{review.comment}</p>
          <div className="flex items-center gap-4 mt-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
              <ThumbsUp className="h-3 w-3 mr-1" />
              Helpful
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
              <Flag className="h-3 w-3 mr-1" />
              Report
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
