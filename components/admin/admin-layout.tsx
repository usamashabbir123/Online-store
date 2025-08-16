"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ShoppingBag,
  LayoutDashboard,
  Store,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Shield,
  AlertTriangle,
  FileText,
  Bell,
  Search,
  Menu,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, current: true },
    { name: "Store Approvals", href: "/admin/stores", icon: Store, current: false, badge: "5" },
    { name: "Users", href: "/admin/users", icon: Users, current: false },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart, current: false },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3, current: false },
    { name: "Content Moderation", href: "/admin/moderation", icon: Shield, current: false, badge: "2" },
    { name: "Reports", href: "/admin/reports", icon: FileText, current: false },
    { name: "System Settings", href: "/admin/settings", icon: Settings, current: false },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <div>
                <span className="text-xl font-heading font-bold text-foreground">MarketHub</span>
                <Badge variant="destructive" className="ml-2 text-xs">
                  Admin
                </Badge>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search users, stores, orders..."
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <Button variant="ghost" size="sm" className="relative">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
              >
                7
              </Badge>
            </Button>

            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
              >
                12
              </Badge>
            </Button>

            <Button variant="ghost" size="sm">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex flex-col h-full pt-20 lg:pt-0">
            <div className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>

            <Separator />

            <div className="p-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-heading font-semibold text-sm mb-2">System Status</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">All Systems Operational</span>
                </div>
                <p className="text-xs text-muted-foreground">Platform running smoothly</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
