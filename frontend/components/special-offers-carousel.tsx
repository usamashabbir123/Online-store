"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { ArrowRight, Clock, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

const specialOffers = [
  {
    id: 1,
    title: "Summer Collection Launch",
    description: "Get 40% off on all summer essentials",
    discount: "40% OFF",
    originalPrice: "$299",
    salePrice: "$179",
    image: "/womens-fashion.png",
    badge: "Limited Time",
    rating: 4.8,
    timeLeft: "2 days left",
    category: "New Arrivals",
    link: "/collections"
  },
  {
    id: 2,
    title: "Flash Sale - Premium Denim",
    description: "Premium denim collection at unbeatable prices",
    discount: "60% OFF",
    originalPrice: "$199",
    salePrice: "$79",
    image: "/kids-denim-jacket.png",
    badge: "Flash Sale",
    rating: 4.9,
    timeLeft: "6 hours left",
    category: "Hot Deals",
    link: "/collections"
  },
  {
    id: 3,
    title: "Weekend Special - Accessories",
    description: "Complete your look with premium accessories",
    discount: "50% OFF",
    originalPrice: "$149",
    salePrice: "$74",
    image: "/leather-wallet.png",
    badge: "Weekend Special",
    rating: 4.7,
    timeLeft: "1 day left",
    category: "Accessories",
    link: "/collections"
  },
  {
    id: 4,
    title: "VIP Member Exclusive",
    description: "Exclusive deals for our VIP members only",
    discount: "70% OFF",
    originalPrice: "$399",
    salePrice: "$119",
    image: "/business-suit.png",
    badge: "VIP Only",
    rating: 4.9,
    timeLeft: "3 days left",
    category: "Exclusive",
    link: "/collections"
  },
  {
    id: 5,
    title: "Clearance Event",
    description: "Last chance to grab amazing deals",
    discount: "80% OFF",
    originalPrice: "$249",
    salePrice: "$49",
    image: "/athletic-leggings.png",
    badge: "Clearance",
    rating: 4.6,
    timeLeft: "5 days left",
    category: "Clearance",
    link: "/collections"
  }
]

export function SpecialOffersCarousel() {
  const [api, setApi] = useState<CarouselApi>()

  // Auto-scroll effect
  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 4000) // Auto-scroll every 4 seconds

    return () => clearInterval(interval)
  }, [api])

  return (
    <section className="relative -mt-8 py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-primary to-accent text-white border-0 px-6 py-2 text-base font-semibold">
            <TrendingUp className="h-4 w-4 mr-2" />
            Limited Time Offers
          </Badge>
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
            Exclusive Deals
            <span className="text-primary block">Don't Miss Out!</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover incredible savings on premium fashion items. These offers won't last long!
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <Carousel
            opts={{
              align: "center",
              loop: true,
              skipSnaps: false,
            }}
            className="w-full"
            setApi={setApi}
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {specialOffers.map((offer) => (
                <CarouselItem key={offer.id} className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 bg-background/80 backdrop-blur-md h-[600px] relative">
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={offer.image}
                        alt={offer.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge variant="destructive" className="font-bold text-sm px-4 py-2 bg-red-500 hover:bg-red-600">
                          {offer.badge}
                        </Badge>
                      </div>

                      {/* Discount */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl px-4 py-2 border-0">
                          {offer.discount}
                        </Badge>
                      </div>

                      {/* Rating */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 rounded-full px-3 py-2 backdrop-blur-sm">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-semibold">{offer.rating}</span>
                      </div>

                      {/* Time Left */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-red-500/90 rounded-full px-3 py-2 backdrop-blur-sm">
                        <Clock className="h-4 w-4 text-white" />
                        <span className="text-white text-sm font-semibold">{offer.timeLeft}</span>
                      </div>
                    </div>

                    <CardHeader className="pb-4 pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                          {offer.category}
                        </Badge>
                      </div>
                      <CardTitle className="font-heading text-2xl leading-tight mb-3">{offer.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed text-muted-foreground">
                        {offer.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-primary">{offer.salePrice}</span>
                          <span className="text-lg text-muted-foreground line-through">{offer.originalPrice}</span>
                        </div>
                      </div>
                      
                      <Button className="w-full h-12 text-lg font-semibold group-hover:bg-primary/90 transition-all duration-300 transform group-hover:scale-105" asChild>
                        <Link href={offer.link}>
                          Shop Now
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="hidden md:flex h-12 w-12 -left-16" />
            <CarouselNext className="hidden md:flex h-12 w-12 -right-16" />
          </Carousel>
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="text-lg px-10 py-4 border-2 hover:bg-primary hover:text-white transition-all duration-300" asChild>
            <Link href="/collections">
              View All Offers
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
