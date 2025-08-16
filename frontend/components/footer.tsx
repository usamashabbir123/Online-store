import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function Footer() {
  const footerLinks = {
    shop: [
      { href: "/marketplace", label: "All Products" },
      { href: "/collections", label: "Collections" },
      { href: "/new-arrivals", label: "New Arrivals" },
    ],
    customerCare: [
      { href: "/size-guide", label: "Size Guide" },
      { href: "/returns", label: "Returns & Exchanges" },
      { href: "/shipping", label: "Shipping Info" },
    ],
    connect: [
      { href: "/contact", label: "Contact Us" },
      { href: "/about", label: "About Us" },
      { href: "/careers", label: "Careers" },
    ],
  }

  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="text-lg font-heading font-bold">FashionHub</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your destination for premium fashion. Curating the finest clothing for every style and occasion.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-heading font-semibold mb-6">Shop</h3>
            <ul className="space-y-3 text-muted-foreground">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-heading font-semibold mb-6">Customer Care</h3>
            <ul className="space-y-3 text-muted-foreground">
              {footerLinks.customerCare.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-heading font-semibold mb-6">Connect</h3>
            <ul className="space-y-3 text-muted-foreground">
              {footerLinks.connect.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 FashionHub. All rights reserved. Crafted with passion for fashion.</p>
        </div>
      </div>
    </footer>
  )
}
