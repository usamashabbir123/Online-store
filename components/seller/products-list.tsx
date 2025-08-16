"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import Image from "next/image"

export function ProductsList() {
  const products = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      sku: "WBH-001",
      price: 89.99,
      stock: 25,
      status: "active",
      image: "/wireless-headphones.png",
      sales: 156,
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      sku: "SFW-002",
      price: 199.99,
      stock: 12,
      status: "active",
      image: "/fitness-smartwatch.png",
      sales: 89,
    },
    {
      id: "3",
      name: "Premium Coffee Maker",
      sku: "PCM-003",
      price: 149.99,
      stock: 0,
      status: "out-of-stock",
      image: "/coffee-maker.png",
      sales: 67,
    },
    {
      id: "4",
      name: "Ergonomic Office Chair",
      sku: "EOC-004",
      price: 299.99,
      stock: 8,
      status: "active",
      image: "/ergonomic-office-chair.png",
      sales: 34,
    },
    {
      id: "5",
      name: "Portable Bluetooth Speaker",
      sku: "PBS-005",
      price: 59.99,
      stock: 45,
      status: "active",
      image: "/portable-bluetooth-speaker.png",
      sales: 123,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "secondary"
      case "out-of-stock":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-600" }
    if (stock < 10) return { text: "Low Stock", color: "text-yellow-600" }
    return { text: "In Stock", color: "text-green-600" }
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const stockStatus = getStockStatus(product.stock)
        return (
          <Card key={product.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <Badge variant={getStatusColor(product.status)} className="capitalize">
                      {product.status.replace("-", " ")}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="font-medium">${product.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Stock</p>
                      <p className={`font-medium ${stockStatus.color}`}>{product.stock} units</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Sales</p>
                      <p className="font-medium">{product.sales} sold</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="font-medium">${(product.price * product.sales).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
