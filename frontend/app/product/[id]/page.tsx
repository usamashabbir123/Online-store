"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, MessageCircle, Share2, ChevronLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock product data - in a real app, this would come from an API
const products = {
  "1": {
    id: "1",
    name: "Men's Classic Cotton T-Shirt",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.5,
    reviewCount: 234,
    image: "/cotton-tshirt.png",
    store: "Urban Style Co",
    isOnSale: true,
    isFreeShipping: true,
    category: "Men's Clothing",
    brand: "Urban Style Co",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Gray"],
    description: "Premium cotton t-shirt with a classic fit. Made from 100% organic cotton for ultimate comfort and breathability. Perfect for everyday wear and casual occasions.",
    features: [
      "100% Organic Cotton",
      "Classic fit",
      "Machine washable",
      "Pre-shrunk fabric",
      "Reinforced stitching"
    ],
    specifications: {
      "Material": "100% Organic Cotton",
      "Weight": "180 GSM",
      "Fit": "Classic",
      "Care": "Machine wash cold, tumble dry low",
      "Origin": "Made in Bangladesh"
    },
    reviews: [
      {
        id: 1,
        user: "John D.",
        rating: 5,
        date: "2 days ago",
        comment: "Great quality t-shirt! The fabric is soft and comfortable. Fits perfectly as expected."
      },
      {
        id: 2,
        user: "Mike S.",
        rating: 4,
        date: "1 week ago",
        comment: "Good t-shirt, nice material. Slightly larger than expected but still fits well."
      },
      {
        id: 3,
        user: "Alex R.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Excellent quality! I've bought several of these and they're all great."
      }
    ]
  },
  "2": {
    id: "2",
    name: "Women's Summer Floral Dress",
    price: 79.99,
    rating: 4.8,
    reviewCount: 156,
    image: "/floral-dress.png",
    store: "Elegant Fashion",
    isOnSale: false,
    isFreeShipping: true,
    category: "Women's Clothing",
    brand: "Elegant Fashion",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral Blue", "Floral Pink", "Floral Green"],
    description: "Beautiful summer dress with a stunning floral pattern. Made from lightweight, breathable fabric perfect for warm weather. Features an adjustable waist and flattering silhouette.",
    features: [
      "Lightweight fabric",
      "Adjustable waist",
      "Floral pattern",
      "Breathable material",
      "Perfect for summer"
    ],
    specifications: {
      "Material": "Polyester Blend",
      "Weight": "120 GSM",
      "Fit": "Regular",
      "Care": "Hand wash cold, line dry",
      "Origin": "Made in India"
    },
    reviews: [
      {
        id: 1,
        user: "Sarah W.",
        rating: 5,
        date: "1 day ago",
        comment: "Absolutely beautiful dress! The pattern is gorgeous and it fits perfectly."
      },
      {
        id: 2,
        user: "Emma L.",
        rating: 4,
        date: "3 days ago",
        comment: "Lovely dress, very comfortable. The fabric is nice and light for summer."
      }
    ]
  }
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const product = products[params.id as keyof typeof products]

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const addToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select both size and color")
      return
    }

    const cartData = localStorage.getItem("cart")
    const cart = cartData ? JSON.parse(cartData) : []

    const existingItem = cart.find((item: any) => 
      item.id === product.id && item.size === selectedSize && item.color === selectedColor
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        store: product.store,
        category: product.category,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
    alert("Added to cart!")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/marketplace" className="hover:text-foreground">Marketplace</Link>
          <ChevronLeft className="h-4 w-4" />
          <Link href={`/collections/${product.category.toLowerCase().replace(' ', '-')}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 rounded-lg border bg-muted overflow-hidden">
                  <Image
                    src={product.image}
                    alt={`${product.name} ${i}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">{product.brand}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                    <Badge variant="destructive" className="text-sm">
                      -{discountPercentage}%
                    </Badge>
                  </>
                )}
              </div>
              {product.isFreeShipping && (
                <div className="flex items-center gap-2 text-green-600">
                  <Truck className="h-4 w-4" />
                  <span className="text-sm">Free shipping</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Color</Label>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <RadioGroupItem value={color} id={color} />
                      <Label htmlFor={color} className="text-sm">{color}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Size</Label>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className="w-12 h-12"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quantity</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10"
                >
                  -
                </Button>
                <span className="w-16 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={addToCart}
                disabled={!selectedSize || !selectedColor}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? "bg-red-50 border-red-200 text-red-600" : ""}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`} />
              </Button>
            </div>

            {/* Store Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Sold by {product.store}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Verified Seller</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RotateCcw className="h-4 w-4 text-orange-600" />
                  <span>Easy Returns</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b last:border-b-0 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.user}</span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
