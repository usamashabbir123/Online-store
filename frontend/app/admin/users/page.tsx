import { AdminLayout } from "@/components/admin/admin-layout"
import { UsersHeader } from "@/components/admin/users-header"
import { UsersList } from "@/components/admin/users-list"

export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <UsersHeader />
        <UsersList />
      </div>
    </AdminLayout>
  )
}
