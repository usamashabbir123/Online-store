import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, User, Shield, Store, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const demoUsers = [
    {
      role: "Admin",
      email: "admin@markethub.com",
      password: "admin123",
      description: "Full platform access, can approve stores and manage users",
      icon: Shield,
      redirectTo: "/admin/dashboard",
      color: "destructive" as const,
    },
    {
      role: "Seller",
      email: "seller@example.com",
      password: "seller123",
      description: "Store owner with approved store, can manage products and orders",
      icon: Store,
      redirectTo: "/seller/dashboard",
      color: "default" as const,
    },
    {
      role: "Customer",
      email: "customer@example.com",
      password: "customer123",
      description: "Regular customer, can shop and request to open a store",
      icon: User,
      redirectTo: "/marketplace",
      color: "secondary" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-heading font-bold">MarketHub</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold mb-4">Demo Credentials</h1>
            <p className="text-xl text-muted-foreground">
              Use these test accounts to explore different user roles and functionality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {demoUsers.map((user) => {
              const IconComponent = user.icon
              return (
                <Card key={user.role} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="text-center">
                    <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="font-heading flex items-center justify-center gap-2">
                      {user.role}
                      <Badge variant={user.color}>{user.role}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">{user.description}</p>

                    <div className="space-y-2">
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium">Email:</p>
                        <p className="text-sm font-mono">{user.email}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium">Password:</p>
                        <p className="text-sm font-mono">{user.password}</p>
                      </div>
                    </div>

                    <Button className="w-full" asChild>
                      <Link href="/auth/signin">Sign In as {user.role}</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="font-heading">How to Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Customer Flow:</h3>
                  <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                    <li>Sign up as a new customer (any email)</li>
                    <li>Browse marketplace and add items to cart</li>
                    <li>Complete checkout process</li>
                    <li>View profile and order history</li>
                    <li>Request to open a store</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Admin Flow:</h3>
                  <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                    <li>Sign in as admin</li>
                    <li>View platform analytics</li>
                    <li>Approve/reject store applications</li>
                    <li>Manage users and stores</li>
                    <li>Monitor platform activity</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
