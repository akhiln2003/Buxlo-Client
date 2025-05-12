import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { useMoneyCategorizeMutation } from "@/services/apis/UserApis";
import { Icategory } from "../pages/dashBord";
import { errorTost, successToast } from "@/components/ui/tosastMessage";

// Sample data for chart previews
const pieData = [
  { browser: "chrome", visitors: 275, fill: "hsl(var(--chart-1))" },
  { browser: "safari", visitors: 200, fill: "hsl(var(--chart-2))" },
];
const areaData = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
];
const barData = [
  { browser: "chrome", visitors: 275, fill: "hsl(var(--chart-1))" },
  { browser: "safari", visitors: 200, fill: "hsl(var(--chart-2))" },
];

function AddCategory({
  setCategories,
}: {
  setCategories: React.Dispatch<React.SetStateAction<Icategory[]>>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);
  const [chartType, setChartType] = useState<"Pie" | "Area" | "Bar">("Pie");
  const [updateNewCategory] = useMoneyCategorizeMutation();
  const handleSubmit = async () => {
    try {
      const response: IaxiosResponse = await updateNewCategory({
        name,
        amount,
        chartType,
      });
      if (response.data) {
        setCategories((prev) => [...prev, response.data]);
        successToast("Updated", "New category added successfully");
      } else {
        errorTost(
          "Something went wrong ",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
        console.error("Error fetching categories:", response.error);
      }
      setOpen(false);
      setName("");
      setAmount(null);
      setChartType("Pie");
    } catch (error) {
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
      console.error("Error fetching categories:", error);
    }
  };
  const renderChartPreview = () => {
    switch (chartType) {
      case "Pie":
        return (
          <ChartContainer config={{}} className="h-[100px] w-full">
            <PieChart>
              <Pie data={pieData} dataKey="visitors" nameKey="browser" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        );
      case "Area":
        return (
          <ChartContainer config={{}} className="h-[100px] w-full">
            <AreaChart data={areaData}>
              <Area
                dataKey="desktop"
                type="natural"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.4}
                stroke="hsl(var(--chart-1))"
              />
              <XAxis dataKey="month" hide />
              <ChartTooltip content={<ChartTooltipContent />} />
            </AreaChart>
          </ChartContainer>
        );
      case "Bar":
        return (
          <ChartContainer config={{}} className="h-[100px] w-full">
            <BarChart data={barData} layout="vertical">
              <YAxis dataKey="browser" type="category" hide />
              <XAxis dataKey="visitors" type="number" hide />
              <Bar dataKey="visitors" radius={5} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col min-h-72 h-full">
      <CardHeader className="items-center pb-0"></CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div
              className="w-full h-full border-dotted border-2 border-zinc-400 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              role="button"
              aria-label="Add new category"
            >
              <Plus size={32} className="text-zinc-400" />
              <span className="mt-2 font-cabinet text-sm text-zinc-400">
                Add Category
              </span>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                Add New Category
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base">
                  Category Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Expenses"
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-sm sm:text-base">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount as number}
                  onChange={(e) =>
                    setAmount(e.target.value ? Number(e.target.value) : null)
                  }
                  placeholder="e.g., 1000"
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="chartType" className="text-sm sm:text-base">
                  Chart Type
                </Label>
                <Select
                  value={chartType}
                  onValueChange={(value) =>
                    setChartType(value as "Pie" | "Area" | "Bar")
                  }
                >
                  <SelectTrigger className="mt-1 text-sm sm:text-base">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pie" className="text-sm sm:text-base">
                      Pie Chart
                    </SelectItem>
                    <SelectItem value="Area" className="text-sm sm:text-base">
                      Area Chart
                    </SelectItem>
                    <SelectItem value="Bar" className="text-sm sm:text-base">
                      Bar Chart
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm sm:text-base">Chart Preview</Label>
                <div className="mt-2 border border-zinc-200 dark:border-zinc-700 rounded-md p-2">
                  {renderChartPreview()}
                </div>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!name || !amount || Number(amount) <= 0}
              className="w-full sm:w-auto"
            >
              Add Category
            </Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default AddCategory;
