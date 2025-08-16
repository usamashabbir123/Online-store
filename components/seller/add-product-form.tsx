"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, Plus } from "lucide-react"
import { useState } from "react"

export function AddProductForm() {
  const [images, setImages] = useState<string[]>([])
  const [variants, setVariants] = useState([{ name: "", values: [""] }])

  const addVariant = () => {
    setVariants([...variants, { name: "", values: [""] }])
  }

  const addVariantValue = (variantIndex: number) => {
    const newVariants = [...variants]
    newVariants[variantIndex].values.push("")
    setVariants(newVariants)
  }

  return (
    <form className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input id="productName" placeholder="Enter product name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" placeholder="Auto-generated if empty" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" placeholder="Describe your product in detail..." className="min-h-32" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="sports">Sports & Outdoors</SelectItem>
                  <SelectItem value="books">Books & Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" placeholder="Enter brand name" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Inventory */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Pricing & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input id="price" type="number" step="0.01" placeholder="0.00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comparePrice">Compare at Price</Label>
              <Input id="comparePrice" type="number" step="0.01" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost per Item</Label>
              <Input id="cost" type="number" step="0.01" placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input id="stock" type="number" placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStock">Low Stock Threshold</Label>
              <Input id="lowStock" type="number" placeholder="5" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="trackQuantity" />
            <Label htmlFor="trackQuantity">Track quantity</Label>
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Product Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Upload Image</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload up to 10 images. First image will be the main product image.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading">Product Variants</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="space-y-4 p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Variant name (e.g., Size, Color)"
                  value={variant.name}
                  onChange={(e) => {
                    const newVariants = [...variants]
                    newVariants[variantIndex].name = e.target.value
                    setVariants(newVariants)
                  }}
                />
                {variants.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setVariants(variants.filter((_, i) => i !== variantIndex))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {variant.values.map((value, valueIndex) => (
                  <div key={valueIndex} className="flex items-center gap-2">
                    <Input
                      placeholder="Variant value"
                      value={value}
                      onChange={(e) => {
                        const newVariants = [...variants]
                        newVariants[variantIndex].values[valueIndex] = e.target.value
                        setVariants(newVariants)
                      }}
                    />
                    {variant.values.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newVariants = [...variants]
                          newVariants[variantIndex].values = newVariants[variantIndex].values.filter(
                            (_, i) => i !== valueIndex,
                          )
                          setVariants(newVariants)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addVariantValue(variantIndex)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Shipping */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Shipping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" step="0.01" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length (cm)</Label>
              <Input id="length" type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width (cm)</Label>
              <Input id="width" type="number" placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingClass">Shipping Class</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="overnight">Overnight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" size="lg">
          Create Product
        </Button>
        <Button type="button" variant="outline" size="lg">
          Save as Draft
        </Button>
        <Button type="button" variant="ghost" size="lg">
          Cancel
        </Button>
      </div>
    </form>
  )
}
