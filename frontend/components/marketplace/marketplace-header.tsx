"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Search, ShoppingCart, User, Heart, Menu, LogOut } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export function MarketplaceHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState<any>(null)

  const updateCartCount = () => {
    const cartData = localStorage.getItem("cart")
    if (cartData) {
      const cart = JSON.parse(cartData)
      setCartCount(cart.reduce((total: number, item: any) => total + item.quantity, 0))
    } else {
      setCartCount(0)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("cart")
    setUser(null)
    setCartCount(0)
    window.location.href = "/"
  }

  useEffect(() => {
    // Load initial data
    updateCartCount()
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    const handleCartUpdate = () => {
      updateCartCount()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-2xl font-heading font-bold text-foreground">MarketHub</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search products, stores, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-background border-2 border-border focus:border-primary"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8">Search</Button>
            </div>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Heart className="h-5 w-5 mr-2" />
              Wishlist
            </Button>

            <Button variant="ghost" size="sm" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signin">
                  <User className="h-5 w-5 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
          {["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty", "Toys", "Automotive", "Health"].map(
            (category) => (
              <Badge
                key={category}
                variant="secondary"
                className="whitespace-nowrap cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ),
          )}
        </div>
      </div>
    </header>
  )
}
