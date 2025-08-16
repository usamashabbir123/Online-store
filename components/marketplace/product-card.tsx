"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  store: string
  isOnSale: boolean
  isFreeShipping: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isOnSale && (
            <Badge variant="destructive" className="text-xs">
              -{discountPercentage}%
            </Badge>
          )}
          {product.isFreeShipping && (
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Truck className="h-3 w-3" />
              Free Ship
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Store Name */}
          <p className="text-xs text-muted-foreground">{product.store}</p>

          {/* Product Name */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg text-foreground">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button className="w-full mt-3" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
