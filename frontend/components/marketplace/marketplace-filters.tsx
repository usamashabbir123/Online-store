"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal, Grid3X3, List, X, Search, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { useFilters } from "./filter-context"
import { apiService } from "@/lib/api"

export function MarketplaceFilters() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const { filters, updateFilters, resetFilters, isFilterActive } = useFilters()
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const ratings = [4, 4.5, 5]

  // Fetch categories and brands from API
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const categoriesData = await apiService.getCategories()
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData.map(cat => cat.name || cat))
        }
        
        // For now, set some default sizes and colors
        setSizes(["XS", "S", "M", "L", "XL", "XXL"])
        setColors(["Black", "White", "Navy", "Gray", "Blue", "Red", "Green", "Yellow", "Pink", "Purple", "Brown", "Beige"])
      } catch (error) {
        console.error('Failed to fetch filter data:', error)
        // Set fallback data
        setCategories(["Men's Clothing", "Women's Clothing", "Children's Clothing", "Accessories", "Footwear", "Activewear"])
        setBrands(["Urban Style Co", "Elegant Fashion", "Little Trendsetters", "Professional Attire", "FitWear Pro", "School Essentials"])
        setSizes(["XS", "S", "M", "L", "XL", "XXL", "2T", "3T", "4T", "5T", "6", "7", "8", "10", "12", "38R", "40R", "42R", "44R", "46R"])
        setColors(["Black", "White", "Navy", "Gray", "Blue", "Red", "Green", "Yellow", "Pink", "Purple", "Brown", "Beige"])
      }
    }

    fetchFilterData()
  }, [])

  const removeFilter = (filterType: keyof typeof filters, value: any) => {
    if (Array.isArray(filters[filterType])) {
      const currentValues = filters[filterType] as any[]
      updateFilters({ [filterType]: currentValues.filter(v => v !== value) })
    } else {
      updateFilters({ [filterType]: filterType === 'priceRange' ? [0, 500] : filterType === 'searchQuery' ? '' : 'relevance' })
    }
  }

  const toggleFilter = (filterType: keyof typeof filters, value: any) => {
    if (Array.isArray(filters[filterType])) {
      const currentValues = filters[filterType] as any[]
      if (currentValues.includes(value)) {
        updateFilters({ [filterType]: currentValues.filter(v => v !== value) })
      } else {
        updateFilters({ [filterType]: [...currentValues, value] })
      }
    }
  }

  const updatePriceRange = (min: number, max: number) => {
    updateFilters({ priceRange: [min, max] })
  }

  const updateSearchQuery = (query: string) => {
    updateFilters({ searchQuery: query })
  }

  const updateSortBy = (sortBy: string) => {
    updateFilters({ sortBy })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.searchQuery) count++
    if (filters.categories.length > 0) count++
    if (filters.brands.length > 0) count++
    if (filters.sizes.length > 0) count++
    if (filters.colors.length > 0) count++
    if (filters.ratings.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++
    if (filters.sortBy !== 'relevance') count++
    return count
  }

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={filters.searchQuery}
              onChange={(e) => updateSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Select value={filters.sortBy} onValueChange={updateSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
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
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="sm" 
            onClick={() => {
              setViewMode("grid")
              window.dispatchEvent(new CustomEvent('viewModeChange', { detail: 'grid' }))
            }}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="sm" 
            onClick={() => {
              setViewMode("list")
              window.dispatchEvent(new CustomEvent('viewModeChange', { detail: 'list' }))
            }}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-card border rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Categories */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Categories</Label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={isFilterActive('categories', category)}
                      onCheckedChange={() => toggleFilter('categories', category)}
                    />
                    <Label htmlFor={category} className="text-sm">{category}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Brands</Label>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={isFilterActive('brands', brand)}
                      onCheckedChange={() => toggleFilter('brands', brand)}
                    />
                    <Label htmlFor={brand} className="text-sm">{brand}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sizes</Label>
              <div className="space-y-2">
                {sizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={size}
                      checked={isFilterActive('sizes', size)}
                      onCheckedChange={() => toggleFilter('sizes', size)}
                    />
                    <Label htmlFor={size} className="text-sm">{size}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Colors</Label>
              <div className="space-y-2">
                {colors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={color}
                      checked={isFilterActive('colors', color)}
                      onCheckedChange={() => toggleFilter('colors', color)}
                    />
                    <Label htmlFor={color} className="text-sm">{color}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => updatePriceRange(Number(e.target.value), filters.priceRange[1])}
                className="w-24"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => updatePriceRange(filters.priceRange[0], Number(e.target.value))}
                className="w-24"
              />
            </div>
          </div>

          {/* Ratings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Minimum Rating</Label>
            <div className="flex items-center gap-4">
              {ratings.map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={isFilterActive('ratings', rating)}
                    onCheckedChange={() => toggleFilter('ratings', rating)}
                  />
                  <Label htmlFor={`rating-${rating}`} className="text-sm">{rating}+ Stars</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button onClick={resetFilters} variant="outline">
              Clear All Filters
            </Button>
            <Button onClick={() => setShowFilters(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.searchQuery}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => removeFilter('searchQuery', filters.searchQuery)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {category}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => removeFilter('categories', category)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {filters.brands.map((brand) => (
            <Badge key={brand} variant="secondary" className="gap-1">
              {brand}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => removeFilter('brands', brand)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {filters.sizes.map((size) => (
            <Badge key={size} variant="secondary" className="gap-1">
              Size: {size}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => removeFilter('sizes', size)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {filters.colors.map((color) => (
            <Badge key={color} variant="secondary" className="gap-1">
              {color}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => removeFilter('colors', color)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {filters.ratings.map((rating) => (
            <Badge key={rating} variant="secondary" className="gap-1">
              {rating}+ Stars
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => removeFilter('ratings', rating)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {(filters.priceRange[0] > 0 || filters.priceRange[1] < 500) && (
            <Badge variant="secondary" className="gap-1">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => removeFilter('priceRange', [0, 500])}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.sortBy !== 'relevance' && (
            <Badge variant="secondary" className="gap-1">
              Sort: {filters.sortBy}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => removeFilter('sortBy', 'relevance')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-primary hover:text-primary/80"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">Showing results for your search</div>
    </div>
  )
}
