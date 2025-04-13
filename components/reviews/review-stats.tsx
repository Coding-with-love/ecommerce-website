"use client"

import { useState, useEffect } from "react"
import { Star } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { getProductReviewStats } from "@/app/actions/review-actions"

interface ReviewStatsProps {
  productId: string
}

export function ReviewStats({ productId }: ReviewStatsProps) {
  const [stats, setStats] = useState<{
    averageRating: number
    totalReviews: number
    distribution: number[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const result = await getProductReviewStats(productId)
        if (result.success && result.data) {
          setStats(result.data)
        } else {
          setError(result.error || "Failed to load review statistics")
        }
      } catch (err) {
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [productId])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="text-center p-4 border rounded-md">
        <h3 className="font-medium mb-2">No Reviews Yet</h3>
        <p className="text-muted-foreground text-sm">Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold">{stats.averageRating.toFixed(1)}</div>
          <div className="flex justify-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(stats.averageRating)
                    ? "text-amber-400 fill-amber-400"
                    : i < stats.averageRating
                    ? "text-amber-400 fill-amber-400 opacity-50"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{stats.totalReviews} reviews</div>
        </div>
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star - 1]
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
            
            return (
              <div key={star} className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground w-8">{star} star</div>
                <Progress value={percentage} className="h-2 flex-1" />
                <div className="text-sm text-muted-foreground w-8 text-right">{count}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
