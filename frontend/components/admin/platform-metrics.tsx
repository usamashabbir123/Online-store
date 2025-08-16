"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, ShoppingBag } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$387,000",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
    description: "From last month",
  },
  {
    title: "Active Users",
    value: "2,847",
    change: "+8.2%",
    changeType: "positive",
    icon: Users,
    description: "From last month",
  },
  {
    title: "Total Orders",
    value: "12,456",
    change: "+15.3%",
    changeType: "positive",
    icon: ShoppingBag,
    description: "From last month",
  },
  {
    title: "Growth Rate",
    value: "23.4%",
    change: "+2.1%",
    changeType: "positive",
    icon: TrendingUp,
    description: "From last month",
  },
]

const recentData = [
  { month: "Jan", revenue: 45000, users: 1200 },
  { month: "Feb", revenue: 52000, users: 1450 },
  { month: "Mar", revenue: 48000, users: 1680 },
  { month: "Apr", revenue: 61000, users: 1920 },
  { month: "May", revenue: 55000, users: 2150 },
  { month: "Jun", revenue: 67000, users: 2380 },
  { month: "Jul", revenue: 72000, users: 2650 },
]

export function PlatformMetrics() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="flex items-center pt-1">
                <span className="text-xs font-medium text-green-600">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-xs">
              {recentData.map((data, index) => (
                <div key={index} className="text-center">
                  <div className="font-medium text-muted-foreground">{data.month}</div>
                  <div className="text-lg font-bold">${(data.revenue / 1000).toFixed(0)}k</div>
                </div>
              ))}
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">User Growth</CardTitle>
          <CardDescription>Monthly user registration trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-xs">
              {recentData.map((data, index) => (
                <div key={index} className="text-center">
                  <div className="font-medium text-muted-foreground">{data.month}</div>
                  <div className="text-lg font-bold">{(data.users / 1000).toFixed(1)}k</div>
                </div>
              ))}
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
