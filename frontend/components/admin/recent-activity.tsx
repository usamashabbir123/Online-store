"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, ShoppingCart, Store, AlertTriangle, CheckCircle, XCircle, Eye, MoreHorizontal } from "lucide-react"
import { useState } from "react"

export function RecentActivity() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "users" | "orders" | "stores" | "issues">("all")

  const activities = [
    {
      id: 1,
      type: "user" as const,
      action: "New user registration",
      description: "John Doe registered as a new buyer",
      user: "John Doe",
      avatar: "/avatars/john-doe.jpg",
      time: "2 minutes ago",
      status: "completed" as const,
      priority: "low" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 2,
      type: "order" as const,
      action: "High-value order placed",
      description: "Order #ORD-2024-001 for $1,299.99",
      user: "Sarah Wilson",
      avatar: "/avatars/sarah-wilson.jpg",
      time: "15 minutes ago",
      status: "pending" as const,
      priority: "high" as const,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      id: 3,
      type: "store" as const,
      action: "Store application submitted",
      description: "Fashion Forward Boutique applied for store approval",
      user: "Fashion Forward Boutique",
      avatar: "/avatars/store-logo.jpg",
      time: "1 hour ago",
      status: "pending" as const,
      priority: "medium" as const,
      icon: Store,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: 4,
      type: "issue" as const,
      action: "Payment dispute reported",
      description: "Customer reported payment issue with order #ORD-2024-002",
      user: "Mike Johnson",
      avatar: "/avatars/mike-johnson.jpg",
      time: "2 hours ago",
      status: "open" as const,
      priority: "high" as const,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      id: 5,
      type: "user" as const,
      action: "VIP member upgrade",
      description: "Emily Chen upgraded to VIP membership",
      user: "Emily Chen",
      avatar: "/avatars/emily-chen.jpg",
      time: "3 hours ago",
      status: "completed" as const,
      priority: "low" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 6,
      type: "order" as const,
      action: "Bulk order placed",
      description: "Corporate order for 50 units from TechCorp Inc.",
      user: "TechCorp Inc.",
      avatar: "/avatars/techcorp.jpg",
      time: "4 hours ago",
      status: "processing" as const,
      priority: "medium" as const,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      id: 7,
      type: "store" as const,
      action: "Store suspension lifted",
      description: "Urban Style Co. suspension has been lifted",
      user: "Urban Style Co.",
      avatar: "/avatars/urban-style.jpg",
      time: "5 hours ago",
      status: "completed" as const,
      priority: "medium" as const,
      icon: Store,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: 8,
      type: "issue" as const,
      action: "Refund processed",
      description: "Refund of $89.99 processed for order #ORD-2024-003",
      user: "Lisa Brown",
      avatar: "/avatars/lisa-brown.jpg",
      time: "6 hours ago",
      status: "resolved" as const,
      priority: "medium" as const,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ]

  const filters = [
    { key: "all", label: "All", count: activities.length },
    { key: "users", label: "Users", count: activities.filter(a => a.type === "user").length },
    { key: "orders", label: "Orders", count: activities.filter(a => a.type === "order").length },
    { key: "stores", label: "Stores", count: activities.filter(a => a.type === "store").length },
    { key: "issues", label: "Issues", count: activities.filter(a => a.type === "issue").length }
  ]

  const filteredActivities = selectedFilter === "all" 
    ? activities 
    : activities.filter(activity => activity.type === selectedFilter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "open":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mb-4 p-1 bg-muted rounded-lg">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={selectedFilter === filter.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedFilter(filter.key as any)}
              className="h-8 px-3 text-xs"
            >
              {filter.label}
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Activity List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity.avatar} alt={activity.user} />
                        <AvatarFallback className="text-xs">
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{activity.user}</span>
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </Badge>
                    </div>
                    
                    <h4 className="font-medium text-sm mb-1">{activity.action}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getStatusIcon(activity.status)}
                      <span className="capitalize">{activity.status}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {activities.filter(a => a.status === "completed" || a.status === "resolved").length}
              </div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {activities.filter(a => a.status === "pending" || a.status === "processing").length}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
