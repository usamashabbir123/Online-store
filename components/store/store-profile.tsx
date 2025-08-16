"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/marketplace/product-card"
import { Star, MapPin, Phone, Mail, Heart, Share2, MessageCircle, Shield, Truck } from "lucide-react"
import Image from "next/image"

interface StoreProfileProps {
  storeId: string
}

export function StoreProfile({ storeId }: StoreProfileProps) {
  // Mock store data - in real app, fetch based on storeId
  const store = {
    id: storeId,
    name: "Tech Innovations Hub",
    description: "Specializing in cutting-edge electronics and smart home devices with over 10 years of experience",
    rating: 4.8,
    reviewCount: 1247,
    followers: 3420,
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    email: "contact@techinnovations.com",
    banner: "/store-banner-tech.png",
    logo: "/store-logo-tech.png",
    joinDate: "2020",
    totalProducts: 156,
    totalSales: 12450,
    responseTime: "< 2 hours",
    policies: {
      shipping: "Free shipping on orders over $50",
      returns: "30-day return policy",
      warranty: "1-year manufacturer warranty",
    },
  }

  const products = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.5,
      reviewCount: 234,
      image: "/wireless-headphones.png",
      store: store.name,
      isOnSale: true,
      isFreeShipping: true,
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      price: 199.99,
      rating: 4.8,
      reviewCount: 156,
      image: "/fitness-smartwatch.png",
      store: store.name,
      isOnSale: false,
      isFreeShipping: true,
    },
    {
      id: "3",
      name: "Premium Coffee Maker",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.6,
      reviewCount: 89,
      image: "/coffee-maker.png",
      store: store.name,
      isOnSale: true,
      isFreeShipping: false,
    },
    {
      id: "4",
      name: "Ergonomic Office Chair",
      price: 299.99,
      rating: 4.7,
      reviewCount: 312,
      image: "/ergonomic-office-chair.png",
      store: store.name,
      isOnSale: false,
      isFreeShipping: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Store Header */}
      <div className="relative mb-8">
        <div className="h-64 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg overflow-hidden">
          <Image
            src={store.banner || "/placeholder.svg"}
            alt={`${store.name} banner`}
            width={1200}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute -bottom-16 left-8">
          <div className="h-32 w-32 bg-card border-4 border-background rounded-lg overflow-hidden">
            <Image
              src={store.logo || "/placeholder.svg"}
              alt={`${store.name} logo`}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="grid lg:grid-cols-3 gap-8 mt-16">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{store.name}</h1>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{store.rating}</span>
                    <span className="text-muted-foreground">({store.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{store.location}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{store.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Follow
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{store.totalProducts}</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{store.followers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{store.joinDate}</p>
                <p className="text-sm text-muted-foreground">Since</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{store.responseTime}</p>
                <p className="text-sm text-muted-foreground">Response</p>
              </div>
            </div>
          </div>

          {/* Store Products */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList>
              <TabsTrigger value="products">Products ({store.totalProducts})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({store.reviewCount})</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">Customer reviews will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-heading font-semibold mb-2">About Our Store</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {store.description} We pride ourselves on offering the latest technology products with
                        exceptional customer service and competitive prices.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-heading font-semibold mb-4">Store Policies</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Truck className="h-5 w-5 text-primary" />
                          <span className="text-sm">{store.policies.shipping}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-primary" />
                          <span className="text-sm">{store.policies.returns}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-primary" />
                          <span className="text-sm">{store.policies.warranty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-heading font-semibold mb-4">Contact Store</h3>
              <div className="space-y-3">
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{store.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-heading font-semibold mb-4">Store Badges</h3>
              <div className="space-y-2">
                <Badge variant="default" className="w-full justify-center">
                  Verified Seller
                </Badge>
                <Badge variant="secondary" className="w-full justify-center">
                  Fast Shipping
                </Badge>
                <Badge variant="outline" className="w-full justify-center">
                  Top Rated
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
