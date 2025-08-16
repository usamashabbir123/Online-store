import { SellerLayout } from "@/components/seller/seller-layout"
import { AddProductForm } from "@/components/seller/add-product-form"

export default function NewProductPage() {
  return (
    <SellerLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product listing for your store</p>
        </div>
        <AddProductForm />
      </div>
    </SellerLayout>
  )
}
