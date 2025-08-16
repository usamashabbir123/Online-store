"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, Store, ShoppingCart, TrendingUp, AlertTriangle, Eye, MousePointer, CreditCard, Package, Star, TrendingDown } from "lucide-react"
import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"

export function AdminOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">("30d")
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await apiService.getAdminStats()
        
        // Transform API data to match our stats format
        const transformedStats = [
          {
            title: "Total Revenue",
            value: data.totalRevenue || "$0",
            change: data.revenueChange || "+0%",
            changeType: (data.revenueChange || "+0%").includes("+") ? "positive" as const : "negative" as const,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50",
            progress: data.revenueProgress || 0
          },
          {
            title: "Active Users",
            value: data.activeUsers || "0",
            change: data.usersChange || "+0%",
            changeType: (data.usersChange || "+0%").includes("+") ? "positive" as const : "negative" as const,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            progress: data.usersProgress || 0
          },
          {
            title: "Total Orders",
            value: data.totalOrders || "0",
            change: data.ordersChange || "+0%",
            changeType: (data.ordersChange || "+0%").includes("+") ? "positive" as const : "negative" as const,
            icon: ShoppingCart,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            progress: data.ordersProgress || 0
          },
          {
            title: "Conversion Rate",
            value: data.conversionRate || "0%",
            change: data.conversionChange || "+0%",
            changeType: (data.conversionChange || "+0%").includes("+") ? "positive" as const : "negative" as const,
            icon: MousePointer,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            progress: data.conversionProgress || 0
          },
          {
            title: "Customer Satisfaction",
            value: data.satisfaction || "0/5",
            change: data.satisfactionChange || "+0%",
            changeType: (data.satisfactionChange || "+0%").includes("+") ? "positive" as const : "negative" as const,
            icon: Star,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            progress: data.satisfactionProgress || 0
          },
          {
            title: "Return Rate",
            value: data.returnRate || "0%",
            change: data.returnChange || "+0%",
            changeType: (data.returnChange || "+0%").includes("+") ? "negative" as const : "positive" as const,
            icon: Package,
            color: "text-red-600",
            bgColor: "bg-red-50",
            progress: data.returnProgress || 0
          }
        ]
        
        setStats(transformedStats)
      } catch (error) {
        console.error('Failed to fetch admin stats:', error)
        // Set fallback data
        setStats([
          {
            title: "Total Revenue",
            value: "$0",
            change: "+0%",
            changeType: "positive" as const,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50",
            progress: 0
          },
          {
            title: "Active Users",
            value: "0",
            change: "+0%",
            changeType: "positive" as const,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            progress: 0
          },
          {
            title: "Total Orders",
            value: "0",
            change: "+0%",
            changeType: "positive" as const,
            icon: ShoppingCart,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            progress: 0
          },
          {
            title: "Conversion Rate",
            value: "0%",
            change: "+0%",
            changeType: "positive" as const,
            icon: MousePointer,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            progress: 0
          },
          {
            title: "Customer Satisfaction",
            value: "0/5",
            change: "+0%",
            changeType: "positive" as const,
            icon: Star,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            progress: 0
          },
          {
            title: "Return Rate",
            value: "0%",
            change: "+0%",
            changeType: "positive" as const,
            icon: Package,
            color: "text-red-600",
            bgColor: "bg-red-50",
            progress: 0
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [selectedPeriod])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-4">Loading admin stats...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Platform Overview</h2>
          <p className="text-muted-foreground">Monitor your platform performance and key metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          {(["7d", "30d", "90d"] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="h-8 px-3"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="group hover:shadow-lg transition-all duration-300">
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
                <p className="text-xs text-muted-foreground">vs last period</p>
              </div>
              <div className="mt-3">
                <Progress value={stat.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Store className="h-6 w-6" />
              <span className="text-sm">View Stores</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="text-sm">Process Orders</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
