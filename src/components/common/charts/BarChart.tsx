import { Bar, BarChart, XAxis, YAxis } from "recharts";
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

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig;

interface BarchartProps {
  title?: string;
  data?: Array<{
    category: string;
    totalDebit: number;
  }> | {
    credit?: number;
    debit?: number;
  };
}

export function Barchart({ 
  title = "Top Categories", 
  data = [] 
}: BarchartProps) {
  // Check if data is for top categories or single category debit/credit
  const isTopCategories = Array.isArray(data);
  
  let chartData;
  
  if (isTopCategories) {
    // Top 3 categories
    chartData = data.map((cat, index) => ({
      name: cat.category,
      amount: Math.abs(cat.totalDebit),
      fill: `hsl(var(--chart-${(index % 5) + 1}))`,
    }));
  } else {
    // Single category credit/debit
    chartData = [
      { 
        name: "Credit", 
        amount: (data).credit || 0, 
        fill: "hsl(var(--chart-2))" 
      },
      { 
        name: "Debit", 
        amount: (data ).debit || 0, 
        fill: "hsl(var(--chart-1))" 
      },
    ];
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">
          {isTopCategories ? "Top spending categories" : "Credit vs Debit"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs sm:text-sm"
            />
            <XAxis dataKey="amount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="amount" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground text-center">
          {isTopCategories ? "Based on spending amount" : "Category breakdown"}
        </div>
      </CardFooter>
    </Card>
  );
}