import { AdminLayout } from "@/components/admin/admin-layout"
import { StoreApprovalsHeader } from "@/components/admin/store-approvals-header"
import { StoreApprovalsList } from "@/components/admin/store-approvals-list"

export default function StoreApprovalsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <StoreApprovalsHeader />
        <StoreApprovalsList />
      </div>
    </AdminLayout>
  )
}
