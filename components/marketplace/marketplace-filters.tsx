"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal, Grid3X3, List, X } from "lucide-react"
import { useState } from "react"

export function MarketplaceFilters() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeFilters, setActiveFilters] = useState(["Electronics", "Under $500", "4+ Stars"])

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <Select defaultValue="relevance">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="bestselling">Best Selling</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">View:</span>
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => removeFilter(filter)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilters([])}
            className="text-primary hover:text-primary/80"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">Showing 1,234 results for your search</div>
    </div>
  )
}
