"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Add Product",
      description: "List a new product in your store",
      icon: Plus,
      href: "/seller/products/new",
      variant: "default" as const,
    },
    {
      title: "Manage Inventory",
      description: "Update stock levels and variants",
      icon: Package,
      href: "/seller/products",
      variant: "outline" as const,
    },
    {
      title: "View Analytics",
      description: "Check detailed sales reports",
      icon: BarChart3,
      href: "/seller/analytics",
      variant: "outline" as const,
    },
    {
      title: "Store Settings",
      description: "Update your store information",
      icon: Settings,
      href: "/seller/store",
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Button variant={action.variant} className="w-full justify-start h-auto p-4">
              <action.icon className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
