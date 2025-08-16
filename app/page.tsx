import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Truck, Shield, Heart, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-heading font-bold text-foreground">FashionHub</h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/marketplace"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Shop
              </Link>
              <Link
                href="/collections"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Collections
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                About
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Join Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative">
          <Badge variant="secondary" className="mb-8 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="h-3 w-3 mr-1" />
            New Collection Available
          </Badge>

          <h1 className="text-6xl md:text-7xl font-heading font-bold text-foreground mb-8 leading-tight">
            Fashion
            <span className="text-primary block">Redefined</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover premium clothing for the whole family. From timeless classics to cutting-edge trends, we curate the
            finest fashion pieces for every style and occasion.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="text-lg px-10 py-4 rounded-full" asChild>
              <Link href="/marketplace">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-4 rounded-full bg-transparent" asChild>
              <Link href="/collections">View Lookbook</Link>
            </Button>
          </div>

          {/* Hero Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="relative h-64 rounded-2xl overflow-hidden group">
              <Image
                src="/mens-fashion.png"
                alt="Men's Fashion"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-heading font-bold text-lg">Men's</h3>
                <p className="text-sm opacity-90">Sophisticated Style</p>
              </div>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden group">
              <Image
                src="/floral-dress.png"
                alt="Women's Fashion"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-heading font-bold text-lg">Women's</h3>
                <p className="text-sm opacity-90">Elegant Designs</p>
              </div>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden group">
              <Image
                src="/kids-denim-jacket.png"
                alt="Children's Fashion"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-heading font-bold text-lg">Kids</h3>
                <p className="text-sm opacity-90">Playful & Comfortable</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-6">The FashionHub Promise</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to delivering exceptional quality and service with every purchase
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group">
              <CardHeader className="text-center p-8">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl mb-4">Premium Quality</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Every piece is carefully selected and quality-tested to ensure you receive only the finest clothing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group">
              <CardHeader className="text-center p-8">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl mb-4">Fast & Free Shipping</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Enjoy complimentary shipping on all orders over $75 with express delivery options available
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group">
              <CardHeader className="text-center p-8">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl mb-4">Customer Love</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Join thousands of satisfied customers who trust us for their fashion needs and style inspiration
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-6">Featured Collections</h2>
            <p className="text-xl text-muted-foreground">
              Discover our most popular styles, loved by fashion enthusiasts worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Business Essentials",
                description: "Professional attire for the modern workplace",
                items: "24 pieces",
                image: "/business-suit.png",
              },
              {
                name: "Casual Comfort",
                description: "Relaxed styles for everyday elegance",
                items: "36 pieces",
                image: "/cotton-tshirt.png",
              },
              {
                name: "Active Lifestyle",
                description: "Performance wear that moves with you",
                items: "18 pieces",
                image: "/athletic-leggings.png",
              },
            ].map((collection, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <CardHeader className="relative -mt-16 z-10">
                  <div className="bg-background/95 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="font-heading text-lg">{collection.name}</CardTitle>
                      <Badge variant="secondary">{collection.items}</Badge>
                    </div>
                    <CardDescription className="text-sm mb-4">{collection.description}</CardDescription>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Explore Collection
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-accent text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-5xl font-heading font-bold mb-6">Ready to Elevate Your Style?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join our fashion community and discover your perfect style with curated collections and personalized
            recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="secondary" size="lg" className="text-lg px-10 py-4 rounded-full" asChild>
              <Link href="/marketplace">Start Shopping</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              asChild
            >
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-sm border-t border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <span className="text-lg font-heading font-bold">FashionHub</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your destination for premium fashion. Curating the finest clothing for every style and occasion.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-semibold mb-6">Shop</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/marketplace" className="hover:text-primary transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/collections" className="hover:text-primary transition-colors">
                    Collections
                  </Link>
                </li>
                <li>
                  <Link href="/new-arrivals" className="hover:text-primary transition-colors">
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold mb-6">Customer Care</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/size-guide" className="hover:text-primary transition-colors">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-primary transition-colors">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-primary transition-colors">
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold mb-6">Connect</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 FashionHub. All rights reserved. Crafted with passion for fashion.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
