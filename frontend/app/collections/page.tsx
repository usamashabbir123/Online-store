import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Filter, Grid3X3, List } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CollectionsPage() {
  const collections = [
    {
      id: "business-essentials",
      name: "Business Essentials",
      description: "Professional attire for the modern workplace",
      items: 24,
      image: "/business-suit.png",
      category: "Professional",
      featured: true,
    },
    {
      id: "casual-comfort",
      name: "Casual Comfort",
      description: "Relaxed styles for everyday elegance",
      items: 36,
      image: "/cotton-tshirt.png",
      category: "Casual",
      featured: true,
    },
    {
      id: "active-lifestyle",
      name: "Active Lifestyle",
      description: "Performance wear that moves with you",
      items: 18,
      image: "/athletic-leggings.png",
      category: "Athletic",
      featured: true,
    },
    {
      id: "evening-elegance",
      name: "Evening Elegance",
      description: "Sophisticated pieces for special occasions",
      items: 15,
      image: "/floral-dress.png",
      category: "Evening",
      featured: false,
    },
    {
      id: "street-style",
      name: "Street Style",
      description: "Urban fashion with attitude",
      items: 28,
      image: "/kids-denim-jacket.png",
      category: "Street",
      featured: false,
    },
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Clean lines and timeless designs",
      items: 22,
      image: "/mens-fashion.png",
      category: "Minimalist",
      featured: false,
    },
  ]

  const categories = ["All", "Professional", "Casual", "Athletic", "Evening", "Street", "Minimalist"]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6">
            Fashion Collections
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collections, each designed to inspire and elevate your personal style
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

      {/* Collections Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Card key={collection.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {collection.featured && (
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <CardHeader className="relative -mt-16 z-10">
                  <div className="bg-background/95 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="font-heading text-lg">{collection.name}</CardTitle>
                      <Badge variant="secondary">{collection.items} pieces</Badge>
                    </div>
                    <CardDescription className="text-sm mb-4">{collection.description}</CardDescription>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {collection.category}
                      </Badge>
                      <Button variant="outline" size="sm" className="bg-transparent" asChild>
                        <Link href={`/collections/${collection.id}`}>
                          Explore
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
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
          <h2 className="text-4xl font-heading font-bold mb-6">Can't Find What You're Looking For?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our team of fashion experts is here to help you discover the perfect pieces for your style
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/marketplace">Browse All Products</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Contact Stylist
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
