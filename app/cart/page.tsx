"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Load cart and user data
    const cartData = localStorage.getItem("cart")
    const userData = localStorage.getItem("user")

    if (cartData) {
      setCart(JSON.parse(cartData))
    }
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }

    const newCart = cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter((item) => item.id !== productId)
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleCheckout = () => {
    if (!user) {
      router.push("/auth/signin?redirect=/checkout")
      return
    }
    router.push("/checkout")
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link href="/marketplace" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="text-xl font-heading font-bold">MarketHub</span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-heading font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild>
            <Link href="/marketplace">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/marketplace" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-heading font-bold">MarketHub</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-muted-foreground text-sm">by {item.store}</p>
                      <Badge variant="secondary" className="mt-1">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${item.price}</p>
                      {item.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">${item.originalPrice}</p>
                      )}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                        min="1"
                      />
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}

                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>

                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/marketplace">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
