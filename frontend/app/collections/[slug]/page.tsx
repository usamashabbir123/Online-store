import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, ShoppingCart, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock collection data - in a real app, this would come from an API
const collections = {
  "casual-comfort": {
    name: "Casual Comfort",
    description: "Relaxed styles for everyday elegance. Perfect for those who value both comfort and style in their daily wear.",
    image: "/cotton-tshirt.png",
    items: 36,
    category: "Casual Wear",
    featured: true,
    products: [
      {
        id: 1,
        name: "Premium Cotton T-Shirt",
        price: 24.99,
        originalPrice: 34.99,
        rating: 4.5,
        reviewCount: 234,
        image: "/cotton-tshirt.png",
        isOnSale: true,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Navy", "Gray"]
      },
      {
        id: 2,
        name: "Relaxed Fit Jeans",
        price: 59.99,
        rating: 4.7,
        reviewCount: 189,
        image: "/kids-denim-jacket.png",
        isOnSale: false,
        sizes: ["30", "32", "34", "36", "38"],
        colors: ["Blue", "Black", "Gray"]
      },
      {
        id: 3,
        name: "Casual Hoodie",
        price: 44.99,
        originalPrice: 54.99,
        rating: 4.6,
        reviewCount: 156,
        image: "/athletic-leggings.png",
        isOnSale: true,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Navy", "Gray", "Black", "Burgundy"]
      }
    ]
  },
  "business-essentials": {
    name: "Business Essentials",
    description: "Professional attire for the modern workplace. Timeless pieces that combine sophistication with contemporary style.",
    image: "/business-suit.png",
    items: 24,
    category: "Professional",
    featured: true,
    products: [
      {
        id: 4,
        name: "Classic Business Suit",
        price: 299.99,
        rating: 4.8,
        reviewCount: 312,
        image: "/business-suit.png",
        isOnSale: false,
        sizes: ["38R", "40R", "42R", "44R", "46R"],
        colors: ["Navy", "Charcoal", "Black"]
      },
      {
        id: 5,
        name: "Professional Blouse",
        price: 79.99,
        rating: 4.6,
        reviewCount: 198,
        image: "/floral-dress.png",
        isOnSale: false,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["White", "Light Blue", "Pink", "Cream"]
      }
    ]
  },
  "summer": {
    name: "Summer Collection",
    description: "Light and breezy styles perfect for warm weather. Stay cool and fashionable all summer long.",
    image: "/womens-fashion.png",
    items: 28,
    category: "Seasonal",
    featured: true,
    products: [
      {
        id: 6,
        name: "Summer Floral Dress",
        price: 79.99,
        rating: 4.8,
        reviewCount: 156,
        image: "/floral-dress.png",
        isOnSale: false,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Floral Blue", "Floral Pink", "Floral Green"]
      }
    ]
  },
  "active-lifestyle": {
    name: "Active Lifestyle",
    description: "Performance wear that moves with you. High-quality athletic clothing for every workout and adventure.",
    image: "/athletic-leggings.png",
    items: 18,
    category: "Athletic",
    featured: true,
    products: [
      {
        id: 7,
        name: "Athletic Leggings",
        price: 49.99,
        originalPrice: 69.99,
        rating: 4.4,
        reviewCount: 178,
        image: "/athletic-leggings.png",
        isOnSale: true,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Navy", "Purple", "Pink"]
      },
      {
        id: 8,
        name: "Performance Tank Top",
        price: 29.99,
        rating: 4.6,
        reviewCount: 145,
        image: "/cotton-tshirt.png",
        isOnSale: false,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["White", "Black", "Gray", "Blue"]
      }
    ]
  }
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = collections[params.slug as keyof typeof collections]

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Collection Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">The collection you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/collections">View All Collections</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Collection Header */}
      <section className="relative py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/collections">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Collections
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
                {collection.category}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
                {collection.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {collection.description}
              </p>
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">4.8</span>
                  <span className="text-muted-foreground">(2.4k reviews)</span>
                </div>
                <div className="text-lg font-semibold text-primary">
                  {collection.items} items
                </div>
              </div>
              <div className="flex gap-4">
                <Button size="lg" className="px-8">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Shop Collection
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Featured Products
            </h2>
            <Button variant="outline" asChild>
              <Link href="/marketplace">View All Products</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collection.products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.isOnSale && (
                    <Badge variant="destructive" className="absolute top-3 left-3">
                      Sale
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                    </div>
                  </div>
                  <CardTitle className="font-heading text-lg leading-tight">{product.name}</CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-muted-foreground">Sizes:</span>
                    <div className="flex gap-1">
                      {product.sizes.map((size) => (
                        <Badge key={size} variant="outline" className="text-xs">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full group-hover:bg-primary/90 transition-colors">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
