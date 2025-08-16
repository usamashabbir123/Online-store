import { StoreProfile } from "@/components/store/store-profile"
import { MarketplaceHeader } from "@/components/marketplace/marketplace-header"

interface StorePageProps {
  params: {
    storeId: string
  }
}

export default function StorePage({ params }: StorePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <StoreProfile storeId={params.storeId} />
    </div>
  )
}
