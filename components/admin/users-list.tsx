"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Mail, Ban, Eye } from "lucide-react"

export function UsersList() {
  const users = [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      role: "seller",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
      orders: 156,
      revenue: 12450,
      storeName: "Tech Innovations Hub",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "buyer",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "1 day ago",
      orders: 23,
      totalSpent: 1890,
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike@example.com",
      role: "seller",
      status: "active",
      joinDate: "2024-01-08",
      lastActive: "3 hours ago",
      orders: 89,
      revenue: 8750,
      storeName: "Home & Garden Plus",
    },
    {
      id: "4",
      name: "Lisa Brown",
      email: "lisa@example.com",
      role: "buyer",
      status: "suspended",
      joinDate: "2024-01-05",
      lastActive: "1 week ago",
      orders: 45,
      totalSpent: 2340,
    },
    {
      id: "5",
      name: "David Lee",
      email: "david@example.com",
      role: "admin",
      status: "active",
      joinDate: "2023-12-01",
      lastActive: "30 minutes ago",
      permissions: ["full_access"],
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "seller":
        return "default"
      case "buyer":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600"
      case "suspended":
        return "text-yellow-600"
      case "banned":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{user.name}</h3>
                    <Badge variant={getRoleColor(user.role)} className="capitalize">
                      {user.role}
                    </Badge>
                    <span className={`text-xs ${getStatusColor(user.status)}`}>● {user.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.storeName && <p className="text-sm text-muted-foreground">Store: {user.storeName}</p>}
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium">{user.joinDate}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Last Active</p>
                  <p className="text-sm font-medium">{user.lastActive}</p>
                </div>

                {user.role === "seller" && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-sm font-medium">${user.revenue?.toLocaleString()}</p>
                  </div>
                )}

                {user.role === "buyer" && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                    <p className="text-sm font-medium">${user.totalSpent?.toLocaleString()}</p>
                  </div>
                )}

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="text-sm font-medium">{user.orders}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                  {user.status === "active" && (
                    <Button variant="ghost" size="sm">
                      <Ban className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
