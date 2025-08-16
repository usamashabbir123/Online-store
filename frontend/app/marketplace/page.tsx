import { Suspense } from "react"
import { MarketplaceHeader } from "@/components/marketplace/marketplace-header"
import { ProductGrid } from "@/components/marketplace/product-grid"
import { CategorySidebar } from "@/components/marketplace/category-sidebar"
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters"
import { FilterProvider } from "@/components/marketplace/filter-context"

export default function ShopPage() {
  return (
    <FilterProvider>
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />

        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">Shop Our Collection</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover premium fashion pieces carefully curated for style, quality, and comfort
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 hidden lg:block">
              <CategorySidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <MarketplaceFilters />
              <Suspense fallback={<div className="text-center py-12">Loading our latest fashion...</div>}>
                <ProductGrid />
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </FilterProvider>
  )
}
