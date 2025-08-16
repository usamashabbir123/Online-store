import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ShoppingBag, Shield, Users, TrendingUp, Star, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
              </div>
              <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                StyleHub
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/marketplace" className="text-foreground hover:text-primary transition-colors font-medium">
                Shop
              </Link>
              <Link href="/demo" className="text-foreground hover:text-primary transition-colors font-medium">
                Demo
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">
                About
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-primary/20 hover:border-primary bg-transparent"
                asChild
              >
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-card/50 via-background to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(22,78,99,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(234,88,12,0.1),transparent_50%)] pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative">
          <Badge variant="secondary" className="mb-8 bg-card/80 backdrop-blur-sm border border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Trusted by 50,000+ fashion lovers worldwide
          </Badge>

          <h1 className="text-6xl md:text-7xl font-heading font-bold text-foreground mb-8 leading-tight">
            Fashion That
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent block">
              Defines You
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover premium clothing collections for men, women, and children. Experience fashion-forward designs
            curated by our expert team in the most modern shopping destination.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="text-lg px-10 py-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
              asChild
            >
              <Link href="/marketplace">
                Explore Fashion
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 border-2 border-primary/20 hover:border-primary bg-white/80 backdrop-blur-sm"
              asChild
            >
              <Link href="/auth/signup">Join StyleHub</Link>
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto relative">
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-primary/10 shadow-xl">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
              <Input
                placeholder="Search for clothing, brands, or styles..."
                className="pl-16 pr-32 py-6 text-lg bg-transparent border-0 focus:ring-0 rounded-2xl"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary to-accent">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-heading font-bold text-foreground mb-6">Why Choose StyleHub?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of fashion shopping with our premium platform designed for style enthusiasts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <Card className="border-0 bg-gradient-to-br from-card/80 to-white/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-heading text-2xl mb-4">Premium Quality</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Every item is carefully curated and quality-checked to ensure you receive only the finest fashion
                  pieces
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card/80 to-white/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-heading text-2xl mb-4">Style Community</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Join a vibrant community of fashion enthusiasts and discover your unique style with expert guidance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-card/80 to-white/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-heading text-2xl mb-4">Latest Trends</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Stay ahead of fashion trends with our AI-powered recommendations and expert styling insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 bg-gradient-to-br from-muted/30 to-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-heading font-bold text-foreground mb-6">Featured Collections</h2>
            <p className="text-xl text-muted-foreground">
              Discover our handpicked fashion collections for every style and occasion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Men's Essentials",
                category: "Classic & Contemporary",
                rating: 4.9,
                items: 156,
                gradient: "from-blue-500/20 to-cyan-500/20",
              },
              {
                name: "Women's Luxury",
                category: "Premium Fashion",
                rating: 4.8,
                items: 289,
                gradient: "from-pink-500/20 to-rose-500/20",
              },
              {
                name: "Kids' Collection",
                category: "Playful & Comfortable",
                rating: 4.9,
                items: 134,
                gradient: "from-yellow-500/20 to-orange-500/20",
              },
            ].map((collection, index) => (
              <Card
                key={index}
                className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm"
              >
                <div className={`h-56 bg-gradient-to-br ${collection.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
                </div>
                <CardHeader className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="font-heading text-2xl">{collection.name}</CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {collection.category}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-6 text-lg">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{collection.rating}</span>
                    </div>
                    <span className="text-muted-foreground">{collection.items} items</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary via-accent to-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-5xl font-heading font-bold mb-6">Ready to Elevate Your Style?</h2>
          <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of fashion enthusiasts who trust StyleHub for their wardrobe essentials and statement pieces
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="text-lg px-10 py-4 bg-white text-primary hover:bg-white/90 shadow-lg"
              asChild
            >
              <Link href="/marketplace">Start Shopping</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent shadow-lg"
              asChild
            >
              <Link href="/auth/signup">Join StyleHub Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                  <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
                </div>
                <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  StyleHub
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The ultimate fashion destination where style meets innovation. Discover your perfect look with our
                curated collections.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg mb-6">Shop Fashion</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/marketplace" className="hover:text-primary transition-colors">
                    Browse Collections
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-primary transition-colors">
                    Fashion Categories
                  </Link>
                </li>
                <li>
                  <Link href="/deals" className="hover:text-primary transition-colors">
                    Special Offers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg mb-6">Customer Care</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/profile" className="hover:text-primary transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="/profile/orders" className="hover:text-primary transition-colors">
                    Order History
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="hover:text-primary transition-colors">
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg mb-6">Support</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-primary transition-colors">
                    Returns & Exchanges
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 StyleHub. All rights reserved. Crafted with ❤️ for fashion enthusiasts.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
