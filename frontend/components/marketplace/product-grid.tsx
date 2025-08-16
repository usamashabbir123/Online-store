"use client"

import { ProductCard } from "@/components/marketplace/product-card"
import { useFilters } from "./filter-context"
import { useState, useEffect, useMemo } from "react"
import { apiService } from "@/lib/api"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  category: string
  brand: string
  sizes: string[]
  colors: string[]
  isFreeShipping: boolean
}

export function ProductGrid() {
  const { filters } = useFilters()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await apiService.getProducts({
          search: filters.searchQuery,
          category: filters.categories[0], // For now, use first category if multiple
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          sortBy: filters.sortBy
        })
        
        if (response && response.products) {
          // Transform API response to match our Product interface
          const transformedProducts = response.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.comparePrice,
            image: product.images?.[0] || '/placeholder-product.jpg',
            rating: product.rating || 0,
            reviewCount: product.reviewCount || 0,
            category: product.category || 'Unknown',
            brand: product.brand || 'Unknown',
            sizes: product.sizes || [],
            colors: product.colors || [],
            isFreeShipping: product.isFreeShipping || false
          }))
          setProducts(transformedProducts)
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
        setError('Failed to load products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters.searchQuery, filters.categories, filters.priceRange, filters.sortBy])

  // Apply additional filters to products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product =>
        filters.brands.includes(product.brand)
      )
    }

    // Size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some(size => filters.sizes.includes(size))
      )
    }

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors.some(color => filters.colors.includes(color))
      )
    }

    // Rating filter
    if (filters.ratings.length > 0) {
      const minRating = Math.min(...filters.ratings)
      filtered = filtered.filter(product => product.rating >= minRating)
    }

    return filtered
  }, [products, filters.brands, filters.sizes, filters.colors, filters.ratings])

  // Get view mode from parent component
  useEffect(() => {
    const handleViewModeChange = (event: CustomEvent) => {
      setViewMode(event.detail)
    }
    
    window.addEventListener('viewModeChange', handleViewModeChange as EventListener)
    return () => window.removeEventListener('viewModeChange', handleViewModeChange as EventListener)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-4">Loading products...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-lg mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-4">No products found</div>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="font-semibold text-lg">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                  <span className="text-sm text-muted-foreground">Rating: {product.rating}/5</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
                  Add to Cart
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
