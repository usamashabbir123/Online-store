"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Package } from "lucide-react"

export function RecentOrders() {
  const orders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      product: "Wireless Headphones",
      amount: "$89.99",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      product: "Smart Watch",
      amount: "$199.99",
      status: "processing",
      date: "2024-01-14",
    },
    {
      id: "#ORD-003",
      customer: "Mike Johnson",
      product: "Coffee Maker",
      amount: "$149.99",
      status: "shipped",
      date: "2024-01-13",
    },
    {
      id: "#ORD-004",
      customer: "Sarah Wilson",
      product: "Office Chair",
      amount: "$299.99",
      status: "delivered",
      date: "2024-01-12",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "default"
      case "shipped":
        return "outline"
      case "delivered":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading">Recent Orders</CardTitle>
        <Button variant="outline" size="sm">
          View All Orders
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">{order.id}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.customer} • {order.product}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium">{order.amount}</div>
                  <div className="text-sm text-muted-foreground">{order.date}</div>
                </div>
                <Badge variant={getStatusColor(order.status)} className="capitalize">
                  {order.status}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
