import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Label as RechartsLabel,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DialogTrigger } from "@radix-ui/react-dialog";

// Sample data for small chart previews
const pieData = [
  { name: "A", value: 400, fill: "hsl(var(--chart-1))" },
  { name: "B", value: 300, fill: "hsl(var(--chart-2))" },
  { name: "C", value: 200, fill: "hsl(var(--chart-3))" },
];

const areaData = [
  { month: "Jan", value: 186 },
  { month: "Feb", value: 305 },
  { month: "Mar", value: 237 },
];

const barData = [
  { name: "A", value: 275, fill: "hsl(var(--chart-1))" },
  { name: "B", value: 200, fill: "hsl(var(--chart-2))" },
  { name: "C", value: 187, fill: "hsl(var(--chart-3))" },
];

interface SavedChart {
  id: string;
  categoryName: string;
  chartType: "Pie" | "Area" | "Bar";
}

interface AddCategoryProps {
  onAddChart: (chart: SavedChart) => void;
  availableCategories: string[];
}

function AddCategory({
  onAddChart,
  availableCategories = [],
}: AddCategoryProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [chartType, setChartType] = useState<"Pie" | "Area" | "Bar">("Pie");

  const handleSubmit = () => {
    if (!selectedCategory || !chartType) {
      alert("Please select both category and chart type");
      return;
    }

    // Create new chart object
    const newChart: SavedChart = {
      id: `${selectedCategory}-${chartType}-${Date.now()}`,
      categoryName: selectedCategory,
      chartType: chartType,
    };

    // Add to parent state
    onAddChart(newChart);
    
    // Close dialog and reset form
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedCategory("");
    setChartType("Pie");
  };

  const renderChartPreview = () => {
    const chartConfig = {};
    
    switch (chartType) {
      case "Pie":
        return (
          <ChartContainer config={chartConfig} className="h-[100px] w-full">
            <PieChart>
              <Pie 
                data={pieData} 
                dataKey="value" 
                nameKey="name"
                innerRadius={25}
                outerRadius={40}
                strokeWidth={1}
              >
                <RechartsLabel
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
                            className="fill-foreground text-sm font-bold"
                          >
                            100
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        );
      case "Area":
        return (
          <ChartContainer config={chartConfig} className="h-[100px] w-full">
            <AreaChart data={areaData}>
              <XAxis dataKey="month" hide />
              <Area
                dataKey="value"
                type="monotone"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.4}
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </AreaChart>
          </ChartContainer>
        );
      case "Bar":
        return (
          <ChartContainer config={chartConfig} className="h-[100px] w-full">
            <BarChart data={barData} layout="vertical">
              <YAxis dataKey="name" type="category" hide />
              <XAxis dataKey="value" type="number" hide />
              <Bar dataKey="value" radius={4} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  const getChartDescription = () => {
    switch (chartType) {
      case "Pie":
        return "Best for showing proportions of debit vs credit";
      case "Area":
        return "Best for showing trends over time";
      case "Bar":
        return "Best for comparing debit and credit amounts";
      default:
        return "";
    }
  };

  return (
    <Card className="flex flex-col min-h-72 h-full">
      <CardHeader className="items-center pb-0"></CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div
              className="w-full h-full border-dotted border-2 border-zinc-400 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
              role="button"
              aria-label="Add new chart"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                <Plus size={28} className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <span className="mt-3 font-medium text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                Add New Chart
              </span>
            </div>
          </DialogTrigger>
          
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Add New Chart
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Select a category and chart type to visualize your data
              </p>
            </DialogHeader>
            
            <div className="space-y-5 py-4">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.length > 0 ? (
                      availableCategories.map((category) => (
                        <SelectItem 
                          key={category} 
                          value={category}
                          className="cursor-pointer"
                        >
                          {category}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Categories from your transaction data
                </p>
              </div>

              {/* Chart Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="chartType" className="text-sm font-medium">
                  Chart Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={chartType}
                  onValueChange={(value) =>
                    setChartType(value as "Pie" | "Area" | "Bar")
                  }
                >
                  <SelectTrigger id="chartType" className="w-full">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pie" className="cursor-pointer">
                      Pie Chart
                    </SelectItem>
                    <SelectItem value="Area" className="cursor-pointer">
                      Area Chart
                    </SelectItem>
                    <SelectItem value="Bar" className="cursor-pointer">
                      Bar Chart
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {getChartDescription()}
                </p>
              </div>

              {/* Small Chart Preview */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Preview</Label>
                <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900/50">
                  {renderChartPreview()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedCategory || !chartType}
                className="min-w-[100px] bg-blue-600 hover:bg-blue-700"
              >
                Add Chart
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default AddCategory;