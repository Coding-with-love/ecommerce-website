"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ReviewForm } from "./review-form"
import { checkUserCanReview } from "@/app/actions/review-actions"
import { useToast } from "@/components/ui/use-toast"
import { Star } from 'lucide-react'

interface OrderItemReviewProps {
  productId: string
  orderId: string
  productName: string
  autoOpen?: boolean
}

export function OrderItemReview({ productId, orderId, productName, autoOpen = false }: OrderItemReviewProps) {
  const [canReview, setCanReview] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!productId) {
        setIsLoading(false)
        setError("Missing product ID")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        console.log(`Checking review eligibility for product ${productId}`)
        const result = await checkUserCanReview(productId)

        if (result.success) {
          setCanReview(result.canReview)
          setHasReviewed(result.hasReviewed || false)
          console.log(`Review eligibility: canReview=${result.canReview}, hasReviewed=${result.hasReviewed}`)
        } else {
          console.error("Error checking review eligibility:", result.error)
          setError(result.error || "Failed to check review eligibility")
          setCanReview(false)

          // Show toast with error
          toast({
            title: "Error",
            description: result.error || "Failed to check if you can review this product",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        console.error("Unexpected error checking review eligibility:", error)
        setError(error?.message || "An unexpected error occurred")
        setCanReview(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (productId && orderId) {
      checkReviewEligibility()
    } else {
      setIsLoading(false)
      setError("Missing product or order information")
      setCanReview(false)
    }
  }, [productId, orderId, toast])

  useEffect(() => {
    // Only auto-open if explicitly requested, the user can review, hasn't already reviewed, and loading is complete
    if (autoOpen && canReview && !hasReviewed && !isLoading && !error) {
      setIsDialogOpen(true);
    }
  }, [autoOpen, canReview, hasReviewed, isLoading, error]);

  const handleReviewSuccess = () => {
    setIsDialogOpen(false)
    setCanReview(false)
    setHasReviewed(true)
    toast({
      title: "Review submitted",
      description: "Thank you for your review!",
    })
  }

  if (isLoading) {
    return <Button disabled>Loading...</Button>
  }

  if (error) {
    return (
      <Button variant="outline" disabled className="text-red-500">
        Error: Unable to review
      </Button>
    )
  }

  if (hasReviewed) {
    return (
      <Button variant="outline" disabled>
        Already Reviewed
      </Button>
    )
  }

  if (canReview) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-olive-700 hover:bg-olive-800">
            <Star className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review: {productName}</DialogTitle>
          </DialogHeader>
          <ReviewForm productId={productId} orders={[{ id: orderId }]} onSuccess={handleReviewSuccess} />
        </DialogContent>
      </Dialog>
    );
  }

  return null
}
