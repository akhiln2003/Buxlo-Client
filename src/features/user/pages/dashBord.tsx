"use client";

import { useState } from "react";
import AddWalletAndBankAccount from "../components/AddWalletAndBankAccount";
import AddCategory from "../components/AddCategory";
import { Areachart } from "../components/AreaChart";
import { Barchart } from "../components/BarChart";
import { Piechart } from "../components/PieChart ";
import { FilterSection } from "../components/FilterSection"; // Import FilterSection directly

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Icategory {
  id?: string;
  name: string;
  amount: number;
  spended: number;
  chartType: "Pie" | "Area" | "Bar";
}

function Dashboard() {
  const [categories, setCategories] = useState<Icategory[]>([]);
  const [filterType, setFilterType] = useState<"day" | "month" | "year" | "">("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  // const [ balance, setBalance] = useState<number>(1000);




  const renderChart = (category: Icategory) => {
    switch (category.chartType) {
      case "Pie":
        return <Piechart title={category.name} />;
      case "Area":
        return <Areachart title={category.name} />;
      case "Bar":
        return <Barchart title={category.name} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-zinc-100 dark:bg-zinc-950">
      {/* Header Section with Wallet/Bank */}
      <div className="w-full p-4 sm:p-6 md:p-8">
        <AddWalletAndBankAccount
        />
      </div>

      {/* Statistics Heading with Filter Button */}
      <div className="w-full px-4 sm:px-6 md:px-8 mb-2 sm:mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
            Statistics
          </h2>
          {/* Filter button positioned at the right end of the heading */}
          <FilterSection
            filterType={filterType}
            setFilterType={setFilterType}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 pt-0 sm:pt-0 md:pt-0">
        {/* Fixed Charts */}
        <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
          <Piechart title="Pie Chart - Donut" />
        </div>
        <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
          <Areachart title="Area Chart - Legend" />
        </div>
        <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
          <Barchart title="Bar Chart - Mixed" />
        </div>
        {/* Dynamic Category Charts */}
        {categories.map((category) => (
          <div key={category.id} className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
            {renderChart(category)}
          </div>
        ))}
        {/* Add Category */}
        <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
          <AddCategory  />
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full p-4 sm:p-6 md:p-8">
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <Table className="w-full bg-white dark:bg-zinc-900">
            <TableCaption className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
              A list of registered users
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left text-sm sm:text-base">User ID</TableHead>
                <TableHead className="text-left text-sm sm:text-base">Name</TableHead>
                <TableHead className="text-left text-sm sm:text-base">Email</TableHead>
                <TableHead className="text-left text-sm sm:text-base">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-sm sm:text-base">1</TableCell>
                <TableCell className="text-sm sm:text-base">John Doe</TableCell>
                <TableCell className="text-sm sm:text-base">john.doe@example.com</TableCell>
                <TableCell className="text-sm sm:text-base">Active</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-sm sm:text-base">2</TableCell>
                <TableCell className="text-sm sm:text-base">Jane Smith</TableCell>
                <TableCell className="text-sm sm:text-base">jane.smith@example.com</TableCell>
                <TableCell className="text-sm sm:text-base">Inactive</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-sm sm:text-base">3</TableCell>
                <TableCell className="text-sm sm:text-base">Bob Johnson</TableCell>
                <TableCell className="text-sm sm:text-base">bob.johnson@example.com</TableCell>
                <TableCell className="text-sm sm:text-base">Active</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;