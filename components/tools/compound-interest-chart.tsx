"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  principal: {
    label: "Principal",
    color: "hsl(var(--chart-1))",
  },
  interest: {
    label: "Interest",
    color: "hsl(var(--primary))",
  },
  contributions: {
    label: "Contributions",
    color: "hsl(var(--chart-2))"
  }
} satisfies ChartConfig

type ChartData = {
  year: number,
  principal: number,
  interest: number,
  contributions: number,
}[];

export function CompoundInterestChart({ chartData }: { chartData: ChartData }) {
  return (
    <div>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name, item, index) => (
                <>
                  {index === 0 && (
                    <div className="basis-full text-sm font-semibold text-foreground">
                      Year {item.payload.year}
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
                        <span className="font-normal text-muted-foreground">
                          $
                        </span>
                        {Number(value).toFixed(2)}
                      </div>
                    </>
                  )}
                  {/* Add this after the last item */}
                  {index === 2 && (
                    <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                      Total
                      <div className="ml-auto flex items-baseline gap-0.5 font-medium tabular-nums text-foreground">
                        <span className="font-normal text-muted-foreground">
                          $
                        </span>
                        {(item.payload.principal + item.payload.interest + item.payload.contributions).toFixed(2)}
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
