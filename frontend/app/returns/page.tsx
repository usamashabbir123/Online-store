import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RefreshCw, Package, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: 1,
      title: "Initiate Return",
      description: "Log into your account and select the items you want to return",
      icon: RefreshCw,
    },
    {
      step: 2,
      title: "Print Label",
      description: "Download and print your prepaid return shipping label",
      icon: Package,
    },
    {
      step: 3,
      title: "Package & Ship",
      description: "Securely package your items and drop off at any shipping location",
      icon: Package,
    },
    {
      step: 4,
      title: "Refund Processed",
      description: "Receive your refund within 5-7 business days after we receive your return",
      icon: CheckCircle,
    },
  ]

  const returnPolicies = [
    {
      title: "30-Day Return Window",
      description: "Returns must be initiated within 30 days of delivery",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Free Returns",
      description: "Free returns on orders over $50, $5.99 for orders under $50",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Original Condition",
      description: "Items must be unworn, unwashed, and with all original tags attached",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Final Sale Items",
      description: "Sale items marked as final sale cannot be returned",
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  const nonReturnableItems = [
    "Personal care items (for hygiene reasons)",
    "Sale items marked as final sale",
    "Gift cards",
    "Custom or personalized items",
    "Items that have been worn, washed, or altered",
    "Items missing original tags or packaging",
  ]

  const refundMethods = [
    {
      method: "Original Payment Method",
      timeframe: "5-7 business days",
      description: "Refunds are processed back to your original payment method",
    },
    {
      method: "Store Credit",
      timeframe: "Immediate",
      description: "Choose store credit for instant access to your refund amount",
    },
    {
      method: "Exchange",
      timeframe: "Varies",
      description: "Exchange for a different size, color, or item of equal value",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            <RefreshCw className="h-3 w-3 mr-1" />
            Returns & Exchanges
          </Badge>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6">
            Easy Returns & Exchanges
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We want you to love every purchase. If something isn't quite right, our hassle-free 
            return process makes it easy to get what you need.
          </p>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">How Returns Work</h2>
            <p className="text-muted-foreground">
              Our simple 4-step process makes returns quick and easy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((step) => (
              <Card key={step.step} className="border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 text-center">
                <CardHeader className="p-6">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-3">Step {step.step}</Badge>
                  </div>
                  <CardTitle className="font-heading text-lg mb-3">{step.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Return Policies */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Return Policies</h2>
            <p className="text-muted-foreground">
              Understanding our return policies helps ensure a smooth process
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {returnPolicies.map((policy, index) => (
              <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <policy.icon className={`h-6 w-6 ${policy.color}`} />
                    <CardTitle className="text-lg">{policy.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{policy.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Non-Returnable Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Non-Returnable Items</h2>
              <p className="text-muted-foreground">
                Some items cannot be returned for safety, hygiene, or other reasons
              </p>
            </div>

            <Card className="border-0 bg-red-50 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-400">Items That Cannot Be Returned</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {nonReturnableItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
                      <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Refund Methods */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Refund Options</h2>
            <p className="text-muted-foreground">
              Choose the refund method that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {refundMethods.map((method, index) => (
              <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{method.method}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {method.timeframe}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{method.description}</p>
                </CardContent>
              </Card>
            ))}
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
                Common questions about our return process
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">How long do I have to return an item?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You have 30 days from the date of delivery to initiate a return. After 30 days, 
                    items cannot be returned unless there's a manufacturing defect.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">What if my item arrives damaged?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    If your item arrives damaged, please contact our customer service team within 48 hours 
                    of delivery. We'll arrange for a replacement or refund at no cost to you.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Can I exchange an item for a different size?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can exchange an item for a different size, color, or even a completely 
                    different item of equal value. Exchanges are processed the same way as returns.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">How long does it take to process my refund?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Once we receive your return, refunds are typically processed within 2-3 business days. 
                    The time it takes for the refund to appear in your account depends on your bank or 
                    payment provider, usually 5-7 business days.
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
          <h2 className="text-4xl font-heading font-bold mb-6">Ready to Start Your Return?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Log into your account to begin the return process, or contact our team if you need assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/auth/signin">Start Return</Link>
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
