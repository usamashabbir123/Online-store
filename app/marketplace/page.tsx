import { Suspense } from "react"
import { MarketplaceHeader } from "@/components/marketplace/marketplace-header"
import { ProductGrid } from "@/components/marketplace/product-grid"
import { CategorySidebar } from "@/components/marketplace/category-sidebar"
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters"

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <CategorySidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <MarketplaceFilters />
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductGrid />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
