import { SellerLayout } from "@/components/seller/seller-layout"
import { DashboardOverview } from "@/components/seller/dashboard-overview"
import { RecentOrders } from "@/components/seller/recent-orders"
import { SalesChart } from "@/components/seller/sales-chart"
import { QuickActions } from "@/components/seller/quick-actions"

export default function SellerDashboardPage() {
  return (
    <SellerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
        </div>

        <DashboardOverview />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        <RecentOrders />
      </div>
    </SellerLayout>
  )
}
