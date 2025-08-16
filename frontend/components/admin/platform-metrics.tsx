"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye, MousePointer, CreditCard } from "lucide-react"
import { useState } from "react"

export function PlatformMetrics() {
  const [selectedMetric, setSelectedMetric] = useState("revenue")
  const [timeRange, setTimeRange] = useState("30d")

  const metrics = {
    revenue: {
      title: "Revenue Analytics",
      current: "$124,789",
      change: "+18.2%",
      changeType: "positive" as const,
      data: [
        { month: "Jan", value: 45000, target: 50000 },
        { month: "Feb", value: 52000, target: 50000 },
        { month: "Mar", value: 48000, target: 50000 },
        { month: "Apr", value: 55000, target: 50000 },
        { month: "May", value: 62000, target: 50000 },
        { month: "Jun", value: 58000, target: 50000 },
        { month: "Jul", value: 65000, target: 50000 },
        { month: "Aug", value: 72000, target: 50000 },
        { month: "Sep", value: 68000, target: 50000 },
        { month: "Oct", value: 75000, target: 50000 },
        { month: "Nov", value: 82000, target: 50000 },
        { month: "Dec", value: 124789, target: 50000 },
      ]
    },
    users: {
      title: "User Growth",
      current: "45,231",
      change: "+12.5%",
      changeType: "positive" as const,
      data: [
        { month: "Jan", value: 32000, target: 35000 },
        { month: "Feb", value: 35000, target: 35000 },
        { month: "Mar", value: 33000, target: 35000 },
        { month: "Apr", value: 37000, target: 35000 },
        { month: "May", value: 40000, target: 35000 },
        { month: "Jun", value: 38000, target: 35000 },
        { month: "Jul", value: 42000, target: 35000 },
        { month: "Aug", value: 45000, target: 35000 },
        { month: "Sep", value: 43000, target: 35000 },
        { month: "Oct", value: 46000, target: 35000 },
        { month: "Nov", value: 48000, target: 35000 },
        { month: "Dec", value: 45231, target: 35000 },
      ]
    },
    orders: {
      title: "Order Volume",
      current: "18,456",
      change: "+15.7%",
      changeType: "positive" as const,
      data: [
        { month: "Jan", value: 12000, target: 15000 },
        { month: "Feb", value: 14000, target: 15000 },
        { month: "Mar", value: 13000, target: 15000 },
        { month: "Apr", value: 15000, target: 15000 },
        { month: "May", value: 16000, target: 15000 },
        { month: "Jun", value: 15500, target: 15000 },
        { month: "Jul", value: 17000, target: 15000 },
        { month: "Aug", value: 18000, target: 15000 },
        { month: "Sep", value: 17500, target: 15000 },
        { month: "Oct", value: 18500, target: 15000 },
        { month: "Nov", value: 19000, target: 15000 },
        { month: "Dec", value: 18456, target: 15000 },
      ]
    }
  }

  const kpiCards = [
    {
      title: "Total Revenue",
      value: "$1,247,890",
      change: "+18.2%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Users",
      value: "45,231",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Orders",
      value: "18,456",
      change: "+15.7%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: "+0.12%",
      changeType: "positive" as const,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  const renderChart = (data: any[]) => {
    const maxValue = Math.max(...data.map(d => d.value), ...data.map(d => d.target))
    const minValue = Math.min(...data.map(d => d.value), ...data.map(d => d.target))
    const range = maxValue - minValue

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted rounded-full"></div>
              <span className="text-sm text-muted-foreground">Target</span>
            </div>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between gap-1">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                {/* Target line */}
                <div 
                  className="w-full bg-muted rounded-t"
                  style={{ 
                    height: `${((item.target - minValue) / range) * 100}%`,
                    minHeight: '2px'
                  }}
                ></div>
                
                {/* Actual bar */}
                <div 
                  className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                  style={{ 
                    height: `${((item.value - minValue) / range) * 100}%`,
                    minHeight: '2px'
                  }}
                ></div>
                
                {/* Month label */}
                <span className="text-xs text-muted-foreground -rotate-45 origin-top-left">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Platform Metrics</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <MousePointer className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          {Object.entries(metrics).map(([key, metric]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{metric.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold">{metric.current}</span>
                    <Badge variant={metric.changeType === "positive" ? "default" : "destructive"}>
                      {metric.changeType === "positive" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {metric.change}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {renderChart(metric.data)}
            </TabsContent>
          ))}
        </Tabs>

        {/* KPI Summary Cards */}
        <div className="mt-8 pt-6 border-t">
          <h4 className="text-lg font-semibold mb-4">Key Performance Indicators</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((kpi) => (
              <div key={kpi.title} className="text-center p-4 rounded-lg border">
                <div className={`w-12 h-12 ${kpi.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <h5 className="text-sm font-medium text-muted-foreground mb-1">{kpi.title}</h5>
                <div className="text-xl font-bold mb-1">{kpi.value}</div>
                <Badge variant={kpi.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                  {kpi.change}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
