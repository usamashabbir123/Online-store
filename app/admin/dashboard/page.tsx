import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminOverview } from "@/components/admin/admin-overview"
import { PlatformMetrics } from "@/components/admin/platform-metrics"
import { RecentActivity } from "@/components/admin/recent-activity"

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management tools</p>
        </div>

        <AdminOverview />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PlatformMetrics />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
