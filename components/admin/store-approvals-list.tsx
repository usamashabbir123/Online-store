"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, X, Eye, MessageSquare, DollarSign, Calendar, Store } from "lucide-react"

export function StoreApprovalsList() {
  const applications = [
    {
      id: "1",
      storeName: "Tech Innovations Hub",
      ownerName: "John Smith",
      ownerEmail: "john@techinnovations.com",
      category: "Electronics",
      submittedDate: "2024-01-15",
      paymentStatus: "paid",
      paymentAmount: 299,
      status: "pending",
      description: "Specializing in cutting-edge electronics and smart home devices",
      documents: ["business_license.pdf", "tax_certificate.pdf"],
    },
    {
      id: "2",
      storeName: "Fashion Forward Co",
      ownerName: "Sarah Johnson",
      ownerEmail: "sarah@fashionforward.com",
      category: "Fashion",
      submittedDate: "2024-01-14",
      paymentStatus: "paid",
      paymentAmount: 299,
      status: "pending",
      description: "Contemporary fashion for modern professionals",
      documents: ["business_license.pdf", "brand_authorization.pdf"],
    },
    {
      id: "3",
      storeName: "Home & Garden Plus",
      ownerName: "Mike Wilson",
      ownerEmail: "mike@homegardenplus.com",
      category: "Home & Garden",
      submittedDate: "2024-01-13",
      paymentStatus: "paid",
      paymentAmount: 299,
      status: "approved",
      description: "Quality home improvement and gardening supplies",
      documents: ["business_license.pdf", "supplier_agreements.pdf"],
    },
    {
      id: "4",
      storeName: "Sports Equipment Pro",
      ownerName: "Lisa Brown",
      ownerEmail: "lisa@sportsequipmentpro.com",
      category: "Sports",
      submittedDate: "2024-01-12",
      paymentStatus: "pending",
      paymentAmount: 299,
      status: "payment-pending",
      description: "Professional sports equipment and athletic gear",
      documents: ["business_license.pdf"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "payment-pending":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600"
      case "pending":
        return "text-yellow-600"
      case "failed":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id}>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {app.ownerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">{app.storeName}</h3>
                    <p className="text-sm text-muted-foreground">{app.ownerName}</p>
                    <p className="text-sm text-muted-foreground">{app.ownerEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(app.status)} className="capitalize">
                    {app.status.replace("-", " ")}
                  </Badge>
                  <Badge variant="outline">{app.category}</Badge>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground">{app.description}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="text-sm font-medium">{app.submittedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Setup Fee</p>
                    <p className={`text-sm font-medium ${getPaymentStatusColor(app.paymentStatus)}`}>
                      ${app.paymentAmount} ({app.paymentStatus})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Documents</p>
                    <p className="text-sm font-medium">{app.documents.length} files</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Owner
                  </Button>
                </div>

                {app.status === "pending" && app.paymentStatus === "paid" && (
                  <div className="flex items-center gap-2">
                    <Button variant="destructive" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button size="sm">
                      <Check className="h-4 w-4 mr-2" />
                      Approve Store
                    </Button>
                  </div>
                )}

                {app.status === "payment-pending" && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Send Payment Reminder
                    </Button>
                  </div>
                )}

                {app.status === "approved" && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Store is Live
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
