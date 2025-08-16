"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Eye } from "lucide-react"

export function PendingApprovals() {
  const pendingStores = [
    {
      id: "1",
      storeName: "Tech Innovations Hub",
      ownerName: "John Smith",
      category: "Electronics",
      submittedDate: "2024-01-15",
      paymentStatus: "paid",
    },
    {
      id: "2",
      storeName: "Fashion Forward Co",
      ownerName: "Sarah Johnson",
      category: "Fashion",
      submittedDate: "2024-01-14",
      paymentStatus: "paid",
    },
    {
      id: "3",
      storeName: "Home & Garden Plus",
      ownerName: "Mike Wilson",
      category: "Home & Garden",
      submittedDate: "2024-01-13",
      paymentStatus: "paid",
    },
    {
      id: "4",
      storeName: "Sports Equipment Pro",
      ownerName: "Lisa Brown",
      category: "Sports",
      submittedDate: "2024-01-12",
      paymentStatus: "pending",
    },
    {
      id: "5",
      storeName: "Book Haven",
      ownerName: "David Lee",
      category: "Books",
      submittedDate: "2024-01-11",
      paymentStatus: "paid",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading">Pending Store Approvals</CardTitle>
        <Badge variant="secondary">{pendingStores.length}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingStores.map((store) => (
          <div key={store.id} className="p-4 border border-border rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm">{store.storeName}</h4>
                <p className="text-xs text-muted-foreground">by {store.ownerName}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {store.category}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Submitted: {store.submittedDate}</span>
              <Badge variant={store.paymentStatus === "paid" ? "default" : "secondary"} className="text-xs">
                {store.paymentStatus}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" className="flex-1">
                <Check className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="destructive" size="sm">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full bg-transparent">
          View All Pending Approvals
        </Button>
      </CardContent>
    </Card>
  )
}
