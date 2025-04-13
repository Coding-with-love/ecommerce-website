"use client"
import { ReviewList } from "./review-list"
import { ReviewStats } from "./review-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ReviewSectionProps {
  productId: string
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="stats">Rating Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Customer Reviews</h3>
          </div>

          <ReviewList productId={productId} key={`review-list-${Date.now()}`} />
        </TabsContent>

        <TabsContent value="stats">
          <ReviewStats productId={productId} key={`review-stats-${Date.now()}`} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
