import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Heart, Zap, ArrowRight, MapPin, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

export default function CareersPage() {
  const values = [
    {
      icon: Heart,
      title: "Passion-Driven",
      description: "We're passionate about fashion and creating meaningful experiences for our customers.",
    },
    {
      icon: Users,
      title: "Collaborative",
      description: "Great ideas come from great teams working together towards common goals.",
    },
    {
      icon: Zap,
      title: "Innovative",
      description: "We encourage creativity and out-of-the-box thinking in everything we do.",
    },
    {
      icon: Building2,
      title: "Growth-Focused",
      description: "Personal and professional development is at the core of our culture.",
    },
  ]

  const benefits = [
    "Competitive salary and equity packages",
    "Comprehensive health, dental, and vision coverage",
    "Flexible work arrangements and remote options",
    "Professional development and learning opportunities",
    "Generous paid time off and holidays",
    "Employee discount on FashionHub products",
    "Modern office spaces with great amenities",
    "Team events and social activities",
  ]

  const openPositions = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote / San Francisco, CA",
      type: "Full-time",
      salary: "$120K - $180K",
      description: "Join our engineering team to build beautiful, responsive user experiences for our e-commerce platform.",
      requirements: [
        "5+ years of experience with React/Next.js",
        "Strong TypeScript skills",
        "Experience with modern CSS and design systems",
        "Passion for user experience and performance",
      ],
    },
    {
      id: "2",
      title: "Fashion Buyer",
      department: "Merchandising",
      location: "New York, NY",
      type: "Full-time",
      salary: "$80K - $120K",
      description: "Curate our product selection and build relationships with top fashion brands and designers.",
      requirements: [
        "3+ years in fashion buying or merchandising",
        "Strong understanding of fashion trends",
        "Excellent negotiation and relationship skills",
        "Bachelor's degree in Fashion Merchandising or related field",
      ],
    },
    {
      id: "3",
      title: "Customer Experience Manager",
      department: "Customer Success",
      location: "Remote / Austin, TX",
      type: "Full-time",
      salary: "$70K - $100K",
      description: "Lead our customer experience initiatives and ensure exceptional service across all touchpoints.",
      requirements: [
        "4+ years in customer experience or service",
        "Experience with CRM systems and analytics",
        "Strong leadership and communication skills",
        "Passion for customer satisfaction",
      ],
    },
    {
      id: "4",
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$60K - $90K",
      description: "Develop and execute marketing campaigns that drive brand awareness and customer engagement.",
      requirements: [
        "2+ years in digital marketing",
        "Experience with social media and content creation",
        "Analytical mindset and data-driven approach",
        "Creative thinking and storytelling skills",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            Join Our Team
          </Badge>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6">
            Build the Future of Fashion
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join our passionate team of innovators, creators, and fashion enthusiasts who are redefining the 
            shopping experience for millions of customers worldwide.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="#open-positions">
                View Open Positions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-6">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our work and shape our culture
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

      {/* Benefits Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-6">Why Work at FashionHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We believe in taking care of our team so they can do their best work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-muted-foreground leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-6">Open Positions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to join our team? Explore our current opportunities below
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {openPositions.map((position) => (
              <Card key={position.id} className="border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <CardTitle className="font-heading text-xl mb-2">{position.title}</CardTitle>
                      <CardDescription className="text-primary font-medium mb-2">
                        {position.department}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{position.type}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{position.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{position.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>{position.salary}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {position.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Requirements:</h4>
                    <ul className="space-y-2">
                      {position.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link href={`/careers/${position.id}`}>
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">Don't See the Right Role?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and we'll 
            keep you in mind for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:careers@fashionhub.com">Send Resume</a>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
