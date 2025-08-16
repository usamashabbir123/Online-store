import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter, Grid3X3, List, Star, Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NewArrivalsPage() {
  const newProducts = [
    {
      id: "1",
      name: "Premium Cotton T-Shirt",
      price: 49.99,
      originalPrice: 69.99,
      image: "/cotton-tshirt.png",
      category: "Tops",
      rating: 4.8,
      reviews: 124,
      isNew: true,
      discount: 29,
    },
    {
      id: "2",
      name: "Elegant Floral Dress",
      price: 89.99,
      originalPrice: 119.99,
      image: "/floral-dress.png",
      category: "Dresses",
      rating: 4.9,
      reviews: 89,
      isNew: true,
      discount: 25,
    },
    {
      id: "3",
      name: "Professional Business Suit",
      price: 299.99,
      originalPrice: 399.99,
      image: "/business-suit.png",
      category: "Suits",
      rating: 4.7,
      reviews: 56,
      isNew: true,
      discount: 25,
    },
    {
      id: "4",
      name: "Performance Athletic Leggings",
      price: 79.99,
      originalPrice: 99.99,
      image: "/athletic-leggings.png",
      category: "Athletic",
      rating: 4.6,
      reviews: 203,
      isNew: true,
      discount: 20,
    },
    {
      id: "5",
      name: "Classic Denim Jacket",
      price: 129.99,
      originalPrice: 159.99,
      image: "/kids-denim-jacket.png",
      category: "Outerwear",
      rating: 4.8,
      reviews: 167,
      isNew: true,
      discount: 19,
    },
    {
      id: "6",
      name: "Wireless Headphones",
      price: 199.99,
      originalPrice: 249.99,
      image: "/wireless-headphones.png",
      category: "Accessories",
      rating: 4.9,
      reviews: 342,
      isNew: true,
      discount: 20,
    },
  ]

  const categories = ["All", "Tops", "Dresses", "Suits", "Athletic", "Outerwear", "Accessories"]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            Fresh Arrivals
          </Badge>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6">
            New Arrivals
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the latest trends and newest additions to our collection, carefully curated for the fashion-forward
          </p>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.isNew && (
                      <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                        NEW
                      </Badge>
                    )}
                    {product.discount && (
                      <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                        -{product.discount}%
                      </Badge>
                    )}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0 bg-white/90 hover:bg-white">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardHeader className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="font-heading text-lg mb-1">{product.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground mb-2">
                        {product.category}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-foreground">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/product/${product.id}`}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/product/${product.id}`}>View</Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">Stay Updated with New Arrivals</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Be the first to discover our latest styles and exclusive collections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/marketplace">Browse All Products</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Subscribe to Updates
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
