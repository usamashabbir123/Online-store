import { StoreApplicationForm } from "@/components/store/store-application-form"
import { MarketplaceHeader } from "@/components/marketplace/marketplace-header"

export default function StoreApplicationPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Start Your Store</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of successful sellers on MarketHub. Complete your application to get started.
            </p>
          </div>
          <StoreApplicationForm />
        </div>
      </div>
    </div>
  )
}
