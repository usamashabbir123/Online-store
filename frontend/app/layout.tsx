import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["400", "700"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "FashionHub - Premium Fashion Destination",
  description:
    "Discover the latest trends in men's, women's, and children's fashion with our curated collection of premium clothing",
  keywords: ["fashion", "clothing", "style", "ecommerce", "shopping"],
  authors: [{ name: "FashionHub Team" }],
  creator: "FashionHub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fashionhub.com",
    title: "FashionHub - Premium Fashion Destination",
    description: "Discover the latest trends in men's, women's, and children's fashion",
    siteName: "FashionHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "FashionHub - Premium Fashion Destination",
    description: "Discover the latest trends in men's, women's, and children's fashion",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
