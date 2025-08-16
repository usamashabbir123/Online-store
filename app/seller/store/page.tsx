import { SellerLayout } from "@/components/seller/seller-layout"
import { StoreSettings } from "@/components/store/store-settings"

export default function StoreSettingsPage() {
  return (
    <SellerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Store Settings</h1>
          <p className="text-muted-foreground">Manage your store profile and preferences</p>
        </div>
        <StoreSettings />
      </div>
    </SellerLayout>
  )
}
