import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Ruler, Info, HelpCircle } from "lucide-react"

export default function SizeGuidePage() {
  const sizeCharts = {
    women: {
      tops: [
        { size: "XS", bust: "30-32", waist: "24-26", hips: "34-36", us: "0-2", eu: "32-34" },
        { size: "S", bust: "32-34", waist: "26-28", hips: "36-38", us: "2-4", eu: "34-36" },
        { size: "M", bust: "34-36", waist: "28-30", hips: "38-40", us: "4-6", eu: "36-38" },
        { size: "L", bust: "36-38", waist: "30-32", hips: "40-42", us: "6-8", eu: "38-40" },
        { size: "XL", bust: "38-40", waist: "32-34", hips: "42-44", us: "8-10", eu: "40-42" },
        { size: "XXL", bust: "40-42", waist: "34-36", hips: "44-46", us: "10-12", eu: "42-44" },
      ],
      dresses: [
        { size: "XS", bust: "30-32", waist: "24-26", hips: "34-36", us: "0-2", eu: "32-34" },
        { size: "S", bust: "32-34", waist: "26-28", hips: "36-38", us: "2-4", eu: "34-36" },
        { size: "M", bust: "34-36", waist: "28-30", hips: "38-40", us: "4-6", eu: "36-38" },
        { size: "L", bust: "36-38", waist: "30-32", hips: "40-42", us: "6-8", eu: "38-40" },
        { size: "XL", bust: "38-40", waist: "32-34", hips: "42-44", us: "8-10", eu: "40-42" },
        { size: "XXL", bust: "40-42", waist: "34-36", hips: "44-46", us: "10-12", eu: "42-44" },
      ],
      pants: [
        { size: "XS", waist: "24-26", hips: "34-36", inseam: "30", us: "0-2", eu: "32-34" },
        { size: "S", waist: "26-28", hips: "36-38", inseam: "30", us: "2-4", eu: "34-36" },
        { size: "M", waist: "28-30", hips: "38-40", inseam: "31", us: "4-6", eu: "36-38" },
        { size: "L", waist: "30-32", hips: "40-42", inseam: "31", us: "6-8", eu: "38-40" },
        { size: "XL", waist: "32-34", hips: "42-44", inseam: "32", us: "8-10", eu: "40-42" },
        { size: "XXL", waist: "34-36", hips: "44-46", inseam: "32", us: "10-12", eu: "42-44" },
      ],
    },
    men: {
      tops: [
        { size: "XS", chest: "32-34", waist: "26-28", sleeve: "31", us: "XS", eu: "42-44" },
        { size: "S", chest: "34-36", waist: "28-30", sleeve: "32", us: "S", eu: "44-46" },
        { size: "M", chest: "36-38", waist: "30-32", sleeve: "33", us: "M", eu: "46-48" },
        { size: "L", chest: "38-40", waist: "32-34", sleeve: "34", us: "L", eu: "48-50" },
        { size: "XL", chest: "40-42", waist: "34-36", sleeve: "35", us: "XL", eu: "50-52" },
        { size: "XXL", chest: "42-44", waist: "36-38", sleeve: "36", us: "XXL", eu: "52-54" },
      ],
      pants: [
        { size: "XS", waist: "26-28", hips: "34-36", inseam: "30", us: "XS", eu: "42-44" },
        { size: "S", waist: "28-30", hips: "36-38", inseam: "30", us: "S", eu: "44-46" },
        { size: "M", waist: "30-32", hips: "38-40", inseam: "31", us: "M", eu: "46-48" },
        { size: "L", waist: "32-34", hips: "40-42", inseam: "31", us: "L", eu: "48-50" },
        { size: "XL", waist: "34-36", hips: "42-44", inseam: "32", us: "XL", eu: "50-52" },
        { size: "XXL", waist: "36-38", hips: "44-46", inseam: "32", us: "XXL", eu: "52-54" },
      ],
      suits: [
        { size: "XS", chest: "32-34", waist: "26-28", sleeve: "31", us: "XS", eu: "42-44" },
        { size: "S", chest: "34-36", waist: "28-30", sleeve: "32", us: "S", eu: "44-46" },
        { size: "M", chest: "36-38", waist: "30-32", sleeve: "33", us: "M", eu: "46-48" },
        { size: "L", chest: "38-40", waist: "32-34", sleeve: "34", us: "L", eu: "48-50" },
        { size: "XL", chest: "40-42", waist: "34-36", sleeve: "35", us: "XL", eu: "50-52" },
        { size: "XXL", chest: "42-44", waist: "36-38", sleeve: "36", us: "XXL", eu: "52-54" },
      ],
    },
  }

  const measuringTips = [
    {
      title: "Bust/Chest",
      description: "Measure around the fullest part of your bust/chest, keeping the tape horizontal.",
      icon: "👕",
    },
    {
      title: "Waist",
      description: "Measure around your natural waistline, keeping the tape comfortably loose.",
      icon: "📏",
    },
    {
      title: "Hips",
      description: "Measure around the fullest part of your hips, keeping the tape horizontal.",
      icon: "👖",
    },
    {
      title: "Inseam",
      description: "Measure from the crotch to the bottom of your ankle for pants length.",
      icon: "🦵",
    },
    {
      title: "Sleeve",
      description: "Measure from the shoulder to the desired sleeve length.",
      icon: "👔",
    },
  ]

  const generalTips = [
    "Always measure yourself while wearing lightweight clothing or undergarments",
    "Keep the measuring tape snug but not tight",
    "Measure yourself in front of a mirror to ensure the tape is level",
    "If you're between sizes, we recommend sizing up for a more comfortable fit",
    "Different brands may have slightly different sizing, so always check the specific brand's size chart",
    "Consider your preferred fit - some prefer a more fitted look while others prefer a relaxed fit",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Ruler className="h-3 w-3 mr-1" />
            Size Guide
          </Badge>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6">
            Find Your Perfect Fit
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive size guide helps you measure correctly and choose the right size for a 
            comfortable, flattering fit every time.
          </p>
        </div>
      </section>

      {/* Size Charts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Size Charts</h2>
            <p className="text-muted-foreground">
              Use these charts to find your size based on your measurements
            </p>
          </div>

          <Tabs defaultValue="women" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="women">Women's Sizing</TabsTrigger>
              <TabsTrigger value="men">Men's Sizing</TabsTrigger>
            </TabsList>

            <TabsContent value="women" className="space-y-8">
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tops & Dresses</CardTitle>
                    <CardDescription>Size chart for women's tops and dresses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Size</th>
                            <th className="text-left py-2">Bust</th>
                            <th className="text-left py-2">Waist</th>
                            <th className="text-left py-2">Hips</th>
                            <th className="text-left py-2">US</th>
                            <th className="text-left py-2">EU</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeCharts.women.tops.map((size) => (
                            <tr key={size.size} className="border-b">
                              <td className="py-2 font-medium">{size.size}</td>
                              <td className="py-2">{size.bust}"</td>
                              <td className="py-2">{size.waist}"</td>
                              <td className="py-2">{size.hips}"</td>
                              <td className="py-2">{size.us}</td>
                              <td className="py-2">{size.eu}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pants & Bottoms</CardTitle>
                    <CardDescription>Size chart for women's pants and bottoms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Size</th>
                            <th className="text-left py-2">Waist</th>
                            <th className="text-left py-2">Hips</th>
                            <th className="text-left py-2">Inseam</th>
                            <th className="text-left py-2">US</th>
                            <th className="text-left py-2">EU</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeCharts.women.pants.map((size) => (
                            <tr key={size.size} className="border-b">
                              <td className="py-2 font-medium">{size.size}</td>
                              <td className="py-2">{size.waist}"</td>
                              <td className="py-2">{size.hips}"</td>
                              <td className="py-2">{size.inseam}"</td>
                              <td className="py-2">{size.us}</td>
                              <td className="py-2">{size.eu}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">General Tips</CardTitle>
                    <CardDescription>Helpful advice for women's sizing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Women's sizes typically run true to size</li>
                      <li>• Consider your body shape when choosing sizes</li>
                      <li>• Dresses may fit differently than separates</li>
                      <li>• Check fabric content for stretch considerations</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="men" className="space-y-8">
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tops & Shirts</CardTitle>
                    <CardDescription>Size chart for men's tops and shirts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Size</th>
                            <th className="text-left py-2">Chest</th>
                            <th className="text-left py-2">Waist</th>
                            <th className="text-left py-2">Sleeve</th>
                            <th className="text-left py-2">US</th>
                            <th className="text-left py-2">EU</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeCharts.men.tops.map((size) => (
                            <tr key={size.size} className="border-b">
                              <td className="py-2 font-medium">{size.size}</td>
                              <td className="py-2">{size.chest}"</td>
                              <td className="py-2">{size.waist}"</td>
                              <td className="py-2">{size.sleeve}"</td>
                              <td className="py-2">{size.us}</td>
                              <td className="py-2">{size.eu}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pants & Bottoms</CardTitle>
                    <CardDescription>Size chart for men's pants and bottoms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Size</th>
                            <th className="text-left py-2">Waist</th>
                            <th className="text-left py-2">Hips</th>
                            <th className="text-left py-2">Inseam</th>
                            <th className="text-left py-2">US</th>
                            <th className="text-left py-2">EU</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeCharts.men.pants.map((size) => (
                            <tr key={size.size} className="border-b">
                              <td className="py-2 font-medium">{size.size}</td>
                              <td className="py-2">{size.waist}"</td>
                              <td className="py-2">{size.hips}"</td>
                              <td className="py-2">{size.inseam}"</td>
                              <td className="py-2">{size.us}</td>
                              <td className="py-2">{size.eu}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">General Tips</CardTitle>
                    <CardDescription>Helpful advice for men's sizing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Men's sizes are generally consistent across brands</li>
                      <li>• Consider your preferred fit (slim, regular, relaxed)</li>
                      <li>• Suit jackets may fit differently than casual jackets</li>
                      <li>• Check if pants are regular or slim fit</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Measuring Tips */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">How to Measure</h2>
            <p className="text-muted-foreground">
              Follow these steps to get accurate measurements for the perfect fit
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {measuringTips.map((tip, index) => (
              <Card key={index} className="border-0 bg-background/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-3">
                  <div className="text-4xl mb-3">{tip.icon}</div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* General Tips */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">General Sizing Tips</h2>
              <p className="text-muted-foreground">
                Additional advice to help you find the perfect fit
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {generalTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">Still Unsure About Your Size?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our customer service team is here to help you find the perfect fit. Don't hesitate to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <a href="mailto:support@fashionhub.com">Contact Support</a>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href="/contact">Get Help</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
