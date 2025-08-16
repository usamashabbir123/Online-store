"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", sales: 4000, orders: 24 },
  { name: "Feb", sales: 3000, orders: 18 },
  { name: "Mar", sales: 5000, orders: 32 },
  { name: "Apr", sales: 4500, orders: 28 },
  { name: "May", sales: 6000, orders: 38 },
  { name: "Jun", sales: 5500, orders: 35 },
  { name: "Jul", sales: 7000, orders: 42 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
}

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Sales Overview</CardTitle>
        <CardDescription>Your sales performance over the last 7 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="sales"
                stackId="1"
                stroke="var(--color-chart-1)"
                fill="var(--color-chart-1)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stackId="2"
                stroke="var(--color-chart-2)"
                fill="var(--color-chart-2)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
