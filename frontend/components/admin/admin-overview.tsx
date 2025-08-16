"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, Store, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react"

export function AdminOverview() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$1,247,890",
      change: "+18.2%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Platform commission",
    },
    {
      title: "Active Users",
      value: "45,231",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Users,
      description: "Buyers & Sellers",
    },
    {
      title: "Active Stores",
      value: "2,847",
      change: "+8.3%",
      changeType: "positive" as const,
      icon: Store,
      description: "Approved stores",
    },
    {
      title: "Total Orders",
      value: "18,456",
      change: "+15.7%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      description: "This month",
    },
    {
      title: "Platform Growth",
      value: "23.4%",
      change: "+3.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Monthly growth",
    },
    {
      title: "Pending Issues",
      value: "7",
      change: "-2",
      changeType: "positive" as const,
      icon: AlertTriangle,
      description: "Require attention",
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
