"use client"

import { ProductCard } from "@/components/marketplace/product-card"

const products = [
  {
    id: "1",
    name: "Men's Classic Cotton T-Shirt",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.5,
    reviewCount: 234,
    image: "/cotton-tshirt.png",
    store: "Urban Style Co",
    isOnSale: true,
    isFreeShipping: true,
    category: "Men's Clothing",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Gray"],
  },
  {
    id: "2",
    name: "Women's Summer Floral Dress",
    price: 79.99,
    rating: 4.8,
    reviewCount: 156,
    image: "/floral-dress.png",
    store: "Elegant Fashion",
    isOnSale: false,
    isFreeShipping: true,
    category: "Women's Clothing",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral Blue", "Floral Pink", "Floral Green"],
  },
  {
    id: "3",
    name: "Kids' Denim Jacket",
    price: 39.99,
    originalPrice: 54.99,
    rating: 4.6,
    reviewCount: 89,
    image: "/kids-denim-jacket.png",
    store: "Little Trendsetters",
    isOnSale: true,
    isFreeShipping: false,
    category: "Children's Clothing",
    sizes: ["2T", "3T", "4T", "5T", "6", "7", "8"],
    colors: ["Light Blue", "Dark Blue"],
  },
  {
    id: "4",
    name: "Men's Formal Business Suit",
    price: 299.99,
    rating: 4.7,
    reviewCount: 312,
    image: "/business-suit.png",
    store: "Professional Attire",
    isOnSale: false,
    isFreeShipping: true,
    category: "Men's Formal",
    sizes: ["38R", "40R", "42R", "44R", "46R"],
    colors: ["Navy", "Charcoal", "Black"],
  },
  {
    id: "5",
    name: "Women's Athletic Leggings",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.4,
    reviewCount: 178,
    image: "/athletic-leggings.png",
    store: "FitWear Pro",
    isOnSale: true,
    isFreeShipping: true,
    category: "Women's Activewear",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Purple", "Pink"],
  },
  {
    id: "6",
    name: "Children's School Uniform Set",
    price: 89.99,
    rating: 4.9,
    reviewCount: 267,
    image: "/school-uniform.png",
    store: "School Essentials",
    isOnSale: false,
    isFreeShipping: false,
    category: "Children's Uniforms",
    sizes: ["4", "5", "6", "7", "8", "10", "12"],
    colors: ["Navy/White", "Gray/White"],
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
