"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Star, Filter } from "lucide-react"
import { useState } from "react"

export function CategorySidebar() {
  const [priceRange, setPriceRange] = useState([0, 1000])

  const categories = [
    { name: "Electronics", count: 1234 },
    { name: "Fashion", count: 856 },
    { name: "Home & Garden", count: 642 },
    { name: "Sports & Outdoors", count: 423 },
    { name: "Books & Media", count: 312 },
    { name: "Beauty & Health", count: 289 },
    { name: "Toys & Games", count: 156 },
    { name: "Automotive", count: 98 },
  ]

  const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony", "Canon", "Dell", "HP"]

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <Filter className="h-5 w-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between">
              <Label htmlFor={category.name} className="text-sm cursor-pointer hover:text-primary transition-colors">
                {category.name}
              </Label>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Ratings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Customer Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
              <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm">& Up</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox id={brand} />
              <Label htmlFor={brand} className="text-sm cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
