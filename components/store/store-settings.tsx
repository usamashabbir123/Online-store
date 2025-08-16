"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Upload, Eye, Save, Palette, Settings, Bell, CreditCard } from "lucide-react"
import { useState } from "react"

export function StoreSettings() {
  const [storeData, setStoreData] = useState({
    name: "Tech Innovations Hub",
    url: "tech-innovations-hub",
    description: "Specializing in cutting-edge electronics and smart home devices",
    phone: "+1 (555) 123-4567",
    email: "contact@techinnovations.com",
    address: "123 Tech Street, Silicon Valley, CA 94000",
  })

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Store Profile</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      {/* Store Profile */}
      <TabsContent value="profile" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeData.name}
                  onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeUrl">Store URL</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                    markethub.com/store/
                  </span>
                  <Input
                    id="storeUrl"
                    value={storeData.url}
                    onChange={(e) => setStoreData({ ...storeData, url: e.target.value })}
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Store Description</Label>
              <Textarea
                id="description"
                value={storeData.description}
                onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                className="min-h-32"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={storeData.phone}
                  onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  value={storeData.email}
                  onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                value={storeData.address}
                onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Store Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <h3 className="font-medium text-green-800">Store Active</h3>
                <p className="text-sm text-green-600">Your store is live and accepting orders</p>
              </div>
              <Badge variant="default" className="bg-green-600">
                Approved
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-border rounded-lg">
                <p className="text-2xl font-bold text-foreground">4.8</p>
                <p className="text-sm text-muted-foreground">Store Rating</p>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <p className="text-2xl font-bold text-foreground">98%</p>
                <p className="text-sm text-muted-foreground">Fulfillment Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Branding */}
      <TabsContent value="branding" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Store Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Store Logo</Label>
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Upload Logo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">Recommended: 200x200px, PNG or JPG, max 2MB</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Store Banner</Label>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Upload store banner</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Recommended: 1200x300px, PNG or JPG, max 5MB</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-16 bg-primary rounded border border-border"></div>
                  <Input id="primaryColor" value="#15803d" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-16 bg-accent rounded border border-border"></div>
                  <Input id="accentColor" value="#84cc16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Store Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-primary rounded-lg"></div>
                <div>
                  <h3 className="font-heading font-semibold">{storeData.name}</h3>
                  <p className="text-sm text-muted-foreground">markethub.com/store/{storeData.url}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{storeData.description}</p>
              <Button size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications */}
      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">New Orders</h4>
                  <p className="text-sm text-muted-foreground">Get notified when you receive new orders</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Low Stock Alerts</h4>
                  <p className="text-sm text-muted-foreground">Alert when product inventory is running low</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Customer Messages</h4>
                  <p className="text-sm text-muted-foreground">Notifications for customer inquiries and messages</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Marketing Updates</h4>
                  <p className="text-sm text-muted-foreground">Tips and updates to help grow your business</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Payment Notifications</h4>
                  <p className="text-sm text-muted-foreground">Updates about payments and payouts</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Billing */}
      <TabsContent value="billing" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Store Setup Fee</h4>
                <Badge variant="default">Paid</Badge>
              </div>
              <p className="text-sm text-muted-foreground">One-time fee: $299.00 (Paid on Jan 15, 2024)</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Commission Structure</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h5 className="font-medium mb-2">Platform Commission</h5>
                  <p className="text-2xl font-bold text-foreground">5%</p>
                  <p className="text-sm text-muted-foreground">Per successful sale</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h5 className="font-medium mb-2">Payment Processing</h5>
                  <p className="text-2xl font-bold text-foreground">2.9%</p>
                  <p className="text-sm text-muted-foreground">+ $0.30 per transaction</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Payout Information</h4>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Bank Account</span>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">****1234 - Chase Bank</p>
                <p className="text-sm text-muted-foreground">Payouts every Friday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </Tabs>
  )
}
