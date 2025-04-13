"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProductReviews } from "@/app/actions/review-actions"

interface DebugReviewsProps {
  productId: string
}

export function DebugReviews({ productId }: DebugReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const result = await getProductReviews(productId)
      if (result.success) {
        setReviews(result.data)
      } else {
        setError(result.error || "Failed to load reviews")
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (showDebug) {
      fetchReviews()
    }
  }, [showDebug, productId])

  if (!showDebug) {
    return (
      <div className="mt-4">
        <Button variant="outline" size="sm" onClick={() => setShowDebug(true)}>
          Debug Reviews
        </Button>
      </div>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Debug Reviews for Product {productId.slice(0, 8)}</span>
          <Button variant="outline" size="sm" onClick={() => setShowDebug(false)}>
            Hide
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Total Reviews: {reviews.length}</span>
            <Button variant="outline" size="sm" onClick={fetchReviews} disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {error && <div className="text-red-500">Error: {error}</div>}

          {reviews.length === 0 ? (
            <div className="text-muted-foreground">No reviews found in database</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border p-4 rounded-md">
                  <div className="font-medium">Review ID: {review.id.slice(0, 8)}</div>
                  <div>Rating: {review.rating}</div>
                  <div>Comment: {review.comment}</div>
                  <div className="text-sm text-muted-foreground">
                    By: {review.user.name} ({review.user.id.slice(0, 8)})
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(review.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
