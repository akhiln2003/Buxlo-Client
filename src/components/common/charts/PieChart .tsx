import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PiechartProps {
  title?: string;
  data?: {
    credit?: number;
    debit?: number;
    categories?: Array<{
      category: string;
      totalDebit: number;
    }>;
  };
}

export function Piechart({ 
  title = "Transaction Summary", 
  data = { credit: 0, debit: 0, categories: [] } 
}: PiechartProps) {
  // Check if this is the main transaction summary or category-specific
  const isMainSummary = data.categories && data.categories.length > 0;
  
  let chartData;
  let chartConfig: ChartConfig;
  
  if (isMainSummary) {
    // Main transaction summary - show all categories + income
    const categoryData = data.categories!
      .filter(cat => cat.category !== 'Credit' && cat.category !== 'Debit')
      .map((cat, index) => ({
        name: cat.category,
        value: Math.abs(cat.totalDebit),
        fill: `hsl(var(--chart-${(index % 5) + 1}))`,
      }));
    
    // Add income as a separate slice
    chartData = [
      {
        name: "Income",
        value: data.credit || 0,
        fill: "hsl(142, 76%, 36%)", // Green for income
      },
      ...categoryData,
    ];
    
    chartConfig = {
      value: { label: "Amount" },
      income: { label: "Income", color: "hsl(142, 76%, 36%)" },
    } satisfies ChartConfig;
  } else {
    // Category-specific - show credit vs debit
    chartData = [
      { 
        name: "Credit", 
        value: data.credit || 0, 
        fill: "hsl(var(--chart-2))" 
      },
      { 
        name: "Debit", 
        value: data.debit || 0, 
        fill: "hsl(var(--chart-1))" 
      },
    ];
    
    chartConfig = {
      value: { label: "Amount" },
      credit: { label: "Credit", color: "hsl(var(--chart-2))" },
      debit: { label: "Debit", color: "hsl(var(--chart-1))" },
    } satisfies ChartConfig;
  }

  const totalAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">
          {isMainSummary ? "All Transactions Breakdown" : "Credit vs Debit Distribution"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] sm:max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl sm:text-3xl font-bold"
                        >
                          ₹{totalAmount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs sm:text-sm"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {isMainSummary ? (
          <div className="text-center space-y-1">
            <div className="font-medium">Income: ₹{(data.credit || 0).toLocaleString()}</div>
            <div className="font-medium">Expenses: ₹{Math.abs(data.debit || 0).toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {data.categories?.length || 0} categories
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 font-medium leading-none">
            Credit: ₹{(data.credit || 0).toLocaleString()} | Debit: ₹{(data.debit || 0).toLocaleString()}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}