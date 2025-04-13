"use client"

import { useState } from "react"
import { Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function CollectionFilters({ productCount }: { productCount: number }) {
  const [activeFilter, setActiveFilter] = useState("All")
  
  const filters = ["All", "Abayas", "Hijabs", "Dresses", "Accessories"]
  
  return (
    <section className="py-8 border-b border-gray-100">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-olive-800" />
            <span className="text-sm font-medium">Filter By:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant="outline"
                size="sm"
                className={`rounded-full ${
                  activeFilter === filter ? "bg-olive-50 border-olive-200" : "hover:bg-olive-50"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Showing {productCount} products</span>
          </div>
        </div>
      </div>
    </section>
  )
}
