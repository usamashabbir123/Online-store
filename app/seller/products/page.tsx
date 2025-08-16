import { SellerLayout } from "@/components/seller/seller-layout"
import { ProductsHeader } from "@/components/seller/products-header"
import { ProductsList } from "@/components/seller/products-list"

export default function SellerProductsPage() {
  return (
    <SellerLayout>
      <div className="space-y-6">
        <ProductsHeader />
        <ProductsList />
      </div>
    </SellerLayout>
  )
}
