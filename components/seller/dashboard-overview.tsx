"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, ShoppingCart, TrendingUp, Eye, Users } from "lucide-react"

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,426",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "vs last month",
    },
    {
      title: "Total Orders",
      value: "156",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      description: "vs last month",
    },
    {
      title: "Products Sold",
      value: "324",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: Package,
      description: "vs last month",
    },
    {
      title: "Store Views",
      value: "2,847",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: Eye,
      description: "vs last month",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.8%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "vs last month",
    },
    {
      title: "New Customers",
      value: "89",
      change: "+22.1%",
      changeType: "positive" as const,
      icon: Users,
      description: "vs last month",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={stat.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                {stat.change}
              </Badge>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
