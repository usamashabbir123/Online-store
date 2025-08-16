import { ProductDetail } from "@/components/marketplace/product-detail"
import { MarketplaceHeader } from "@/components/marketplace/marketplace-header"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <ProductDetail productId={params.id} />
    </div>
  )
}
