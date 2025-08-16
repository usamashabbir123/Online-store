import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, MapPin, Package, Globe, CheckCircle, Info } from "lucide-react"
import Link from "next/link"

export default function ShippingPage() {
  const shippingOptions = [
    {
      name: "Standard Shipping",
      price: "Free",
      timeframe: "5-7 business days",
      description: "Free on orders over $75, $5.99 for orders under $75",
      icon: Truck,
      features: ["Tracking included", "Signature not required", "Standard handling"],
    },
    {
      name: "Express Shipping",
      price: "$12.99",
      timeframe: "2-3 business days",
      description: "Faster delivery for when you need it sooner",
      icon: Clock,
      features: ["Priority handling", "Tracking included", "Signature not required"],
    },
    {
      name: "Overnight Shipping",
      price: "$24.99",
      timeframe: "1 business day",
      description: "Next-day delivery for urgent orders",
      icon: Package,
      features: ["Priority handling", "Tracking included", "Signature required"],
    },
  ]

  const internationalShipping = [
    {
      region: "Canada",
      timeframe: "7-10 business days",
      price: "$19.99",
      restrictions: "No restrictions",
    },
    {
      region: "United Kingdom",
      timeframe: "8-12 business days",
      price: "$24.99",
      restrictions: "Duties may apply",
    },
    {
      region: "European Union",
      timeframe: "10-15 business days",
      price: "$29.99",
      restrictions: "Duties may apply",
    },
    {
      region: "Australia",
      timeframe: "12-18 business days",
      price: "$34.99",
      restrictions: "Duties may apply",
    },
  ]

  const shippingFeatures = [
    {
      title: "Free Standard Shipping",
      description: "Free shipping on all orders over $75",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Real-time Tracking",
      description: "Track your package every step of the way",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Secure Packaging",
      description: "Items are carefully packaged to prevent damage",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Worldwide Shipping",
      description: "We ship to over 50 countries worldwide",
      icon: Globe,
      color: "text-orange-600",
    },
  ]

  const shippingTips = [
    "Orders placed before 2 PM EST ship the same day",
    "Weekend and holiday orders ship the next business day",
    "International orders may be subject to customs duties and taxes",
    "Signature may be required for high-value or overnight orders",
    "Delivery times may vary during peak seasons",
    "Contact us if you need to change your shipping address",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Truck className="h-3 w-3 mr-1" />
            Shipping Information
          </Badge>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6">
            Fast & Reliable Shipping
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We offer multiple shipping options to get your fashion items to you quickly and safely, 
            with free standard shipping on orders over $75.
          </p>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Shipping Options</h2>
            <p className="text-muted-foreground">
              Choose the shipping method that best fits your timeline and budget
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {shippingOptions.map((option, index) => (
              <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300">
                <CardHeader className="text-center p-6">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <option.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-heading text-xl mb-2">{option.name}</CardTitle>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-3xl font-bold text-primary">{option.price}</span>
                    {option.price === "Free" && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Free
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-base mb-4">{option.description}</CardDescription>
                  <Badge variant="outline" className="mb-4">{option.timeframe}</Badge>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <ul className="space-y-2">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Features */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Why Choose Our Shipping?</h2>
            <p className="text-muted-foreground">
              We're committed to providing the best shipping experience possible
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingFeatures.map((feature, index) => (
              <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm text-center">
                <CardHeader className="p-6">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="font-heading text-lg mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">International Shipping</h2>
            <p className="text-muted-foreground">
              We ship to customers worldwide with competitive international rates
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {internationalShipping.map((region, index) => (
              <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{region.region}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {region.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{region.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>{region.restrictions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Tips */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Shipping Tips & Information</h2>
              <p className="text-muted-foreground">
                Helpful information to ensure smooth delivery of your order
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {shippingTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Common questions about our shipping services
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">When will my order ship?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Orders placed before 2 PM EST typically ship the same day. Weekend and holiday orders 
                    ship the next business day. You'll receive a shipping confirmation email with tracking 
                    information once your order ships.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">How can I track my order?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Once your order ships, you'll receive a tracking number via email. You can also track 
                    your order by logging into your account and visiting the orders section. All our shipping 
                    methods include tracking information.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Do you ship internationally?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, we ship to over 50 countries worldwide. International shipping rates and delivery 
                    times vary by location. Please note that international orders may be subject to customs 
                    duties and taxes, which are the responsibility of the recipient.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">What if my package is lost or damaged?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We take great care in packaging your items to prevent damage during shipping. If your 
                    package arrives damaged or is lost in transit, please contact our customer service team 
                    within 48 hours of delivery. We'll work with you to resolve the issue.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Enjoy free standard shipping on orders over $75 and multiple delivery options to suit your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/marketplace">Shop Now</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
