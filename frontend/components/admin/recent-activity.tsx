"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Store, User, ShoppingCart, AlertTriangle, CheckCircle } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: "1",
      type: "store_approved",
      title: "Store Approved",
      description: "Tech Innovations Hub has been approved and is now live",
      user: "Admin",
      timestamp: "2 minutes ago",
      icon: CheckCircle,
      iconColor: "text-green-600",
    },
    {
      id: "2",
      type: "new_store_application",
      title: "New Store Application",
      description: "Fashion Forward Co submitted store application",
      user: "Sarah Johnson",
      timestamp: "15 minutes ago",
      icon: Store,
      iconColor: "text-blue-600",
    },
    {
      id: "3",
      type: "user_registered",
      title: "New User Registration",
      description: "New buyer account created",
      user: "Mike Wilson",
      timestamp: "32 minutes ago",
      icon: User,
      iconColor: "text-primary",
    },
    {
      id: "4",
      type: "large_order",
      title: "Large Order Placed",
      description: "Order #ORD-1234 for $2,450 requires review",
      user: "Lisa Brown",
      timestamp: "1 hour ago",
      icon: ShoppingCart,
      iconColor: "text-orange-600",
    },
    {
      id: "5",
      type: "content_reported",
      title: "Content Reported",
      description: "Product listing flagged for review",
      user: "System",
      timestamp: "2 hours ago",
      icon: AlertTriangle,
      iconColor: "text-red-600",
    },
    {
      id: "6",
      type: "store_approved",
      title: "Store Approved",
      description: "Home & Garden Plus has been approved",
      user: "Admin",
      timestamp: "3 hours ago",
      icon: CheckCircle,
      iconColor: "text-green-600",
    },
  ]

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "store_approved":
        return <Badge variant="default">Approved</Badge>
      case "new_store_application":
        return <Badge variant="secondary">Pending</Badge>
      case "user_registered":
        return <Badge variant="outline">New User</Badge>
      case "large_order":
        return <Badge variant="secondary">Review</Badge>
      case "content_reported":
        return <Badge variant="destructive">Flagged</Badge>
      default:
        return <Badge variant="secondary">Activity</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
              <div className={`p-2 rounded-full bg-muted ${activity.iconColor}`}>
                <activity.icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Avatar className="h-4 w-4">
                    <AvatarFallback className="text-xs">{activity.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
