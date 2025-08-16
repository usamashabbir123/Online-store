"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const revenueData = [
  { name: "Jan", revenue: 45000, commission: 4500 },
  { name: "Feb", revenue: 52000, commission: 5200 },
  { name: "Mar", revenue: 48000, commission: 4800 },
  { name: "Apr", revenue: 61000, commission: 6100 },
  { name: "May", revenue: 55000, commission: 5500 },
  { name: "Jun", revenue: 67000, commission: 6700 },
  { name: "Jul", revenue: 72000, commission: 7200 },
]

const userGrowthData = [
  { name: "Jan", buyers: 1200, sellers: 180 },
  { name: "Feb", buyers: 1450, sellers: 220 },
  { name: "Mar", buyers: 1680, sellers: 280 },
  { name: "Apr", buyers: 1920, sellers: 340 },
  { name: "May", buyers: 2150, sellers: 420 },
  { name: "Jun", buyers: 2380, sellers: 480 },
  { name: "Jul", buyers: 2650, sellers: 560 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  commission: {
    label: "Commission",
    color: "hsl(var(--chart-2))",
  },
  buyers: {
    label: "Buyers",
    color: "hsl(var(--chart-1))",
  },
  sellers: {
    label: "Sellers",
    color: "hsl(var(--chart-2))",
  },
}

export function PlatformMetrics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Revenue & Commission</CardTitle>
          <CardDescription>Platform revenue and commission earnings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-chart-1)" />
                <Bar dataKey="commission" fill="var(--color-chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">User Growth</CardTitle>
          <CardDescription>New user registrations by type</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="buyers"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-chart-1)" }}
                />
                <Line
                  type="monotone"
                  dataKey="sellers"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-chart-2)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
