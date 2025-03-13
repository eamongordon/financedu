"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { formatCurrency } from "@/lib/utils"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartData = {
  year: number,
  principal: number,
  interest: number,
  contributions: number,
}[];

export function InterestChart({ chartData, type }: { chartData: ChartData, type: "simple" | "compound" }) {
  const chartConfig = {
    principal: {
      label: "Principal",
      color: type === "compound" ? "hsl(var(--chart-1))" : "hsl(var(--chart-3))"
    },
    interest: {
      label: "Interest",
      color: type === "compound" ? "hsl(var(--primary))" : "hsl(var(--chart-4))"
    },
    contributions: {
      label: "Contributions",
      color: type === "compound" ? "hsl(var(--chart-2))" : "hsl(var(--chart-5))"
    }
  } satisfies ChartConfig
  return (
    <div>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value === 0 ? "Now" : `${value}`}
          />
          <ChartTooltip content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name, item, index) => (
                <>
                  {index === 0 && (
                    <div className="basis-full text-sm font-semibold text-foreground">
                      {item.payload.year ? `Year ${item.payload.year}` : "Now"}
                    </div>
                  )}
                  {(index !== 2 || chartData.some((obj) => obj.contributions)) && (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={
                          {
                            "--color-bg": `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                      <div className="ml-auto flex items-baseline gap-0.5 font-medium tabular-nums text-foreground">
                        {formatCurrency(Number(value))}
                      </div>
                    </>
                  )}
                  {index === 2 && (
                    <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                      Total
                      <div className="ml-auto flex items-baseline gap-0.5 font-medium tabular-nums text-foreground">
                        {formatCurrency(item.payload.principal + item.payload.interest + item.payload.contributions)}
                      </div>
                    </div>
                  )}
                </>
              )}
            />
          } />
          <ChartLegend content={<ChartLegendContent className="font-semibold text-muted-foreground" />} />
          <Bar
            dataKey="principal"
            stackId="a"
            fill="var(--color-principal)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="interest"
            stackId="a"
            fill="var(--color-interest)"
            radius={[chartData.some((obj) => obj.contributions) ? 0 : 4, chartData.some((obj) => obj.contributions) ? 0 : 4, 0, 0]}
          />
          <Bar
            dataKey="contributions"
            stackId="a"
            fill="var(--color-contributions)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
