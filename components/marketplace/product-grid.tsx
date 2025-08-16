"use client"

import { ProductCard } from "@/components/marketplace/product-card"

// Mock product data
const products = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviewCount: 234,
    image: "/wireless-headphones.png",
    store: "TechStore Pro",
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
    store: "FitTech Solutions",
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
    store: "Kitchen Essentials",
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
    store: "Office Comfort Co",
    isOnSale: false,
    isFreeShipping: true,
  },
  {
    id: "5",
    name: "Portable Bluetooth Speaker",
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.4,
    reviewCount: 178,
    image: "/portable-bluetooth-speaker.png",
    store: "Audio World",
    isOnSale: true,
    isFreeShipping: true,
  },
  {
    id: "6",
    name: "Gaming Mechanical Keyboard",
    price: 129.99,
    rating: 4.9,
    reviewCount: 267,
    image: "/placeholder-8yk8h.png",
    store: "Gamer's Paradise",
    isOnSale: false,
    isFreeShipping: false,
  },
]

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
