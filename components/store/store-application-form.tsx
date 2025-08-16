"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, CreditCard, Store, FileText, CheckCircle } from "lucide-react"
import { useState } from "react"

export function StoreApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [documents, setDocuments] = useState<string[]>([])

  const steps = [
    { number: 1, title: "Store Information", icon: Store },
    { number: 2, title: "Business Details", icon: FileText },
    { number: 3, title: "Payment & Review", icon: CreditCard },
    { number: 4, title: "Confirmation", icon: CheckCircle },
  ]

  const nextStep = () => setCurrentStep(Math.min(4, currentStep + 1))
  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1))

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              <step.icon className="h-5 w-5" />
            </div>
            <div className="ml-3 hidden sm:block">
              <p
                className={`text-sm font-medium ${
                  currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Store Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name *</Label>
                <Input id="storeName" placeholder="Enter your store name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeUrl">Store URL *</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                    markethub.com/store/
                  </span>
                  <Input id="storeUrl" placeholder="your-store-name" className="rounded-l-none" required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description *</Label>
              <Textarea
                id="storeDescription"
                placeholder="Describe what your store sells and what makes it unique..."
                className="min-h-32"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Primary Category *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your main category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                    <SelectItem value="books">Books & Media</SelectItem>
                    <SelectItem value="beauty">Beauty & Health</SelectItem>
                    <SelectItem value="toys">Toys & Games</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Business Details */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Legal Business Name *</Label>
                <Input id="businessName" placeholder="Enter legal business name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual/Sole Proprietor</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / EIN</Label>
                <Input id="taxId" placeholder="Enter tax identification number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Business Phone *</Label>
                <Input id="phone" type="tel" placeholder="Enter business phone number" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address *</Label>
              <Textarea id="address" placeholder="Enter complete business address" required />
            </div>

            <div className="space-y-4">
              <Label>Required Documents</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Business License</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</p>
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Tax Certificate</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Bank Account Information</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input id="bankName" placeholder="Enter bank name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input id="accountNumber" placeholder="Enter account number" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number *</Label>
                  <Input id="routingNumber" placeholder="Enter routing number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountHolder">Account Holder Name *</Label>
                  <Input id="accountHolder" placeholder="Enter account holder name" required />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Payment & Review */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Store Setup Fee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading font-semibold text-lg">MarketHub Store License</h3>
                    <p className="text-sm text-muted-foreground">One-time setup fee to activate your store</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">$299</p>
                    <p className="text-sm text-muted-foreground">USD</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Store setup and approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Custom store URL and branding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Analytics and reporting tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Marketing and promotion features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>24/7 seller support</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name *</Label>
                    <Input id="cardName" placeholder="Enter name on card" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date *</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input id="cvv" placeholder="123" required />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/seller-agreement" className="text-primary hover:underline">
                    Seller Agreement
                  </a>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="commission" />
                <Label htmlFor="commission" className="text-sm">
                  I understand that MarketHub charges a 5% commission on each sale
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="policies" />
                <Label htmlFor="policies" className="text-sm">
                  I agree to follow MarketHub's{" "}
                  <a href="/seller-policies" className="text-primary hover:underline">
                    Seller Policies
                  </a>{" "}
                  and quality standards
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 4 && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-2xl font-heading font-bold mb-4">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Thank you for applying to become a MarketHub seller. We'll review your application and get back to you
              within 2-3 business days.
            </p>
            <div className="bg-muted rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-sm font-medium mb-2">Application ID: #APP-2024-001</p>
              <p className="text-sm text-muted-foreground">
                You'll receive email updates about your application status at the email address provided.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>Go to Dashboard</Button>
              <Button variant="outline">Download Receipt</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>
          <Button onClick={nextStep}>{currentStep === 3 ? "Submit Application & Pay" : "Next"}</Button>
        </div>
      )}
    </div>
  )
}
