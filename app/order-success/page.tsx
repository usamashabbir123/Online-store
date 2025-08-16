import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function OrderSuccessPage() {
  const orderNumber = "MH" + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-heading font-bold">MarketHub</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />

          <h1 className="text-4xl font-heading font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Order Number:</span>
                <span className="font-mono text-primary">{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Delivery:</span>
                <span>3-5 business days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Status:</span>
                <span className="text-green-600 font-medium">Processing</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Order Processing</h3>
                <p className="text-sm text-muted-foreground">We're preparing your items for shipment</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Track Your Order</h3>
                <p className="text-sm text-muted-foreground">You'll receive tracking info via email</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/marketplace">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile/orders">View Order History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
