import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Award, Globe, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Passion for Fashion",
      description: "We believe fashion is more than clothing—it's self-expression, confidence, and creativity.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a community of fashion enthusiasts who inspire and support each other.",
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "Curating only the finest pieces that meet our high standards of quality and style.",
    },
    {
      icon: Globe,
      title: "Global Inspiration",
      description: "Drawing inspiration from cultures worldwide to create diverse, inclusive fashion.",
    },
  ]

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "1000+", label: "Curated Products" },
    { number: "25+", label: "Designer Brands" },
    { number: "98%", label: "Satisfaction Rate" },
  ]

  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & Creative Director",
      image: "/placeholder-user.jpg",
      bio: "Former fashion editor with 15+ years in the industry, passionate about sustainable fashion.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Design",
      image: "/placeholder-user.jpg",
      bio: "Award-winning designer known for innovative cuts and sustainable materials.",
    },
    {
      name: "Emma Thompson",
      role: "Brand Partnerships",
      image: "/placeholder-user.jpg",
      bio: "Expert in curating exclusive partnerships with emerging and established designers.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            Our Story
          </Badge>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6">
            About FashionHub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're on a mission to democratize fashion, making premium style accessible to everyone while promoting
            sustainability and ethical practices in the industry.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold text-foreground mb-6">Our Journey</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2020, FashionHub began as a small boutique with a big vision: to create a fashion platform
                  that celebrates individuality while promoting sustainable practices.
                </p>
                <p>
                  What started as a local store has grown into a global community of fashion enthusiasts, designers, and
                  conscious consumers who believe in the power of style to transform lives.
                </p>
                <p>
                  Today, we're proud to partner with over 25 designer brands and serve customers worldwide, all while
                  maintaining our commitment to quality, sustainability, and community.
                </p>
              </div>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/marketplace">
                    Explore Our Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="/business-suit.png"
                      alt="Fashion Collection"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src="/floral-dress.png"
                      alt="Fashion Collection"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src="/cotton-tshirt.png"
                      alt="Fashion Collection"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src="/athletic-leggings.png"
                      alt="Fashion Collection"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-6">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at FashionHub
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group text-center">
                <CardHeader className="p-6">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-heading text-xl mb-4">{value.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-6">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind FashionHub's success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group text-center">
                <CardHeader className="p-6">
                  <div className="relative h-32 w-32 rounded-full overflow-hidden mx-auto mb-6">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardTitle className="font-heading text-xl mb-2">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium mb-4">{member.role}</CardDescription>
                  <CardDescription className="text-sm leading-relaxed">
                    {member.bio}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">Join the FashionHub Community</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Be part of a movement that's redefining fashion for the modern world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/marketplace">Start Shopping</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
