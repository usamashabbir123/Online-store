import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SpecialOffersCarousel } from "@/components/special-offers-carousel"
import { Truck, Shield, Heart, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const heroImages = [
    {
      src: "/mens-fashion.png",
      alt: "Men's Fashion",
      title: "Men's",
      subtitle: "Sophisticated Style",
      category: "Luxury",
      price: "From $89"
    },
    {
      src: "/womens-fashion.png",
      alt: "Women's Fashion",
      title: "Women's",
      subtitle: "Elegant Designs",
      category: "Premium",
      price: "From $79"
    },
    {
      src: "/kids-fashion.png",
      alt: "Children's Fashion",
      title: "Kids",
      subtitle: "Playful & Comfortable",
      category: "Comfort",
      price: "From $49"
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Premium Quality",
      description: "Every piece is carefully selected and quality-tested to ensure you receive only the finest clothing",
      highlight: "100% Quality Guaranteed"
    },
    {
      icon: Truck,
      title: "Fast & Free Shipping",
      description: "Enjoy complimentary shipping on all orders over $75 with express delivery options available",
      highlight: "Free Shipping Over $75"
    },
    {
      icon: Heart,
      title: "Customer Love",
      description: "Join thousands of satisfied customers who trust us for their fashion needs and style inspiration",
      highlight: "50K+ Happy Customers"
    },
  ]

  const collections = [
    {
      name: "Business Essentials",
      description: "Professional attire for the modern workplace",
      items: "24 pieces",
      image: "/business-suit.png",
      slug: "business-essentials",
      badge: "Trending",
      discount: "20% OFF"
    },
    {
      name: "Casual Comfort",
      description: "Relaxed styles for everyday elegance",
      items: "36 pieces",
      image: "/cotton-tshirt.png",
      slug: "casual-comfort",
      badge: "New",
      discount: "15% OFF"
    },
    {
      name: "Active Lifestyle",
      description: "Performance wear that moves with you",
      items: "18 pieces",
      image: "/athletic-leggings.png",
      slug: "active-lifestyle",
      badge: "Hot",
      discount: "25% OFF"
    },
  ]

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "100K+", label: "Products Sold" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Customer Support" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Special Offers Carousel - Moved to top */}
      <SpecialOffersCarousel />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
            </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-8 bg-gradient-to-r from-primary to-accent text-white border-0 px-6 py-3 text-base font-semibold animate-pulse">
            <Sparkles className="h-4 w-4 mr-2" />
            New Collection Available
          </Badge>

          <h1 className="text-7xl md:text-8xl lg:text-9xl font-heading font-bold text-foreground mb-8 leading-none">
            Fashion
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent block">Redefined</span>
          </h1>

          <p className="text-2xl md:text-3xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Discover premium clothing for the whole family. From timeless classics to cutting-edge trends, we curate the
            finest fashion pieces for every style and occasion.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
            <Button size="lg" className="text-xl px-12 py-6 rounded-full text-lg font-semibold shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105" asChild>
              <Link href="/marketplace">
                Shop Collection
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-xl px-12 py-6 rounded-full bg-transparent border-2 hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105" asChild>
              <Link href="/collections">View Lookbook</Link>
            </Button>
          </div>

          {/* Hero Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {heroImages.map((image, index) => (
              <div key={index} className="relative h-80 rounded-3xl overflow-hidden group shadow-2xl hover:shadow-primary/25 transition-all duration-500">
              <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0">
                    {image.category}
                  </Badge>
              </div>

                {/* Price */}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-primary text-white border-0 font-semibold">
                    {image.price}
                  </Badge>
            </div>

                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="font-heading font-bold text-2xl mb-2">{image.title}</h3>
                  <p className="text-lg opacity-90 font-light">{image.subtitle}</p>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-br from-card/50 to-background relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2">
              Why Choose Us
            </Badge>
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-8 leading-tight">
              The FashionHub
              <span className="text-primary block">Promise</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're committed to delivering exceptional quality and service with every purchase
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-background/80 backdrop-blur-md hover:bg-background shadow-xl hover:shadow-2xl transition-all duration-500 group transform hover:-translate-y-2">
                <CardHeader className="text-center p-10">
                  <div className="h-20 w-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-500 transform group-hover:scale-110">
                    <feature.icon className="h-10 w-10 text-primary" />
                </div>
                  <CardTitle className="font-heading text-2xl mb-4">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed mb-6 text-muted-foreground">
                    {feature.description}
                </CardDescription>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-semibold">
                    {feature.highlight}
                  </Badge>
              </CardHeader>
            </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-32 bg-gradient-to-br from-background to-card/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-6 bg-accent/10 text-accent border-accent/20 px-4 py-2">
              Trending Now
            </Badge>
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-8 leading-tight">
              Featured
              <span className="text-accent block">Collections</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our most popular styles, loved by fashion enthusiasts worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {collections.map((collection, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 bg-background/80 backdrop-blur-md transform hover:-translate-y-4">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0 font-semibold">
                      {collection.badge}
                    </Badge>
                  </div>

                  {/* Discount */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive" className="bg-red-500 text-white border-0 font-bold">
                      {collection.discount}
                    </Badge>
                  </div>

                  {/* Items count */}
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm text-white border-0">
                      {collection.items}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="relative -mt-20 z-10">
                  <div className="bg-background/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <CardTitle className="font-heading text-2xl">{collection.name}</CardTitle>
                    </div>
                    <CardDescription className="text-base mb-6 leading-relaxed text-muted-foreground">{collection.description}</CardDescription>
                    <Button variant="outline" size="lg" className="w-full bg-transparent border-2 hover:bg-primary hover:text-white transition-all duration-300 transform group-hover:scale-105" asChild>
                      <Link href={`/collections/${collection.slug}`}>
                      Explore Collection
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-6xl md:text-7xl font-heading font-bold mb-8 leading-tight">
            Ready to Elevate
            <span className="block">Your Style?</span>
          </h2>
          <p className="text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed font-light">
            Join our fashion community and discover your perfect style with curated collections and personalized
            recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Button variant="secondary" size="lg" className="text-xl px-12 py-6 rounded-full shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105" asChild>
              <Link href="/marketplace">Start Shopping</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-xl px-12 py-6 rounded-full border-2 border-white/30 text-white hover:bg-white hover:text-primary bg-transparent transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
