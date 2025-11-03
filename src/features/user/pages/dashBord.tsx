import { useCallback, useEffect, useState } from "react";
import AddWalletAndBankAccount from "../components/AddWalletAndBankAccount";
import AddCategory from "../components/AddCategory";
import { Areachart } from "../../../components/common/charts/AreaChart";
import { Barchart } from "../../../components/common/charts/BarChart";
import { FilterSection } from "../components/FilterSection";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { useGetUser } from "@/hooks/useGetUser";
import { useFetchPaymentHistorySummaryMutation } from "@/services/apis/UserApis";
import { Piechart } from "../../../components/common/charts/PieChart ";
import { Button } from "@/components/ui/button";
import { errorTost, successToast } from "@/components/ui/tosastMessage";

export interface Icategory {
  id?: string;
  name: string;
  amount: number;
  spended: number;
  chartType: "Pie" | "Area" | "Bar";
}

interface BackendPaymentSummary {
  totalCredit: number;
  totalDebit: number;
  categoryWise: Array<{
    category: string;
    totalDebit: number;
    totalCredit?: number;
  }>;
}

interface SavedChart {
  id: string;
  categoryName: string;
  chartType: "Pie" | "Area" | "Bar";
}

// Storage Helper Functions
const STORAGE_KEY_PREFIX = "dashboard-charts-";

const loadChartsFromStorage = (userId: string): SavedChart[] => {
  try {
    const storageKey = STORAGE_KEY_PREFIX + userId;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      const charts = JSON.parse(stored);
      console.log("✅ Loaded charts from localStorage:", charts);
      return charts;
    }

    console.log("ℹ️ No charts found in localStorage");
    return [];
  } catch (error) {
    console.error("❌ Error loading charts from localStorage:", error);
    return [];
  }
};

const saveChartsToStorage = (userId: string, charts: SavedChart[]): void => {
  try {
    const storageKey = STORAGE_KEY_PREFIX + userId;
    localStorage.setItem(storageKey, JSON.stringify(charts));
    console.log("💾 Saved charts to localStorage:", charts);
  } catch (error) {
    console.error("❌ Error saving charts to localStorage:", error);
  }
};

function Dashboard() {
  const user = useGetUser();
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [paymentData, setPaymentData] = useState<BackendPaymentSummary | null>(
    null
  );
  const [filterType, setFilterType] = useState<"day" | "month" | "year" | "">(
    ""
  );
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [fetchPaymentSummery] = useFetchPaymentHistorySummaryMutation();

  // Summary statistics state
  const [summaryStats, setSummaryStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    monthlyChange: 0,
  });

  // Load charts from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const loadedCharts = loadChartsFromStorage(user.id);
      setSavedCharts(loadedCharts);
    }
  }, [user?.id]);

  // Get available categories from backend data
  const availableCategories =
    paymentData?.categoryWise
      .filter((cat) => cat.category !== "Credit" && cat.category !== "Debit")
      .map((cat) => cat.category) || [];

  // Transform backend data to frontend format
  const transformPaymentData = (data: BackendPaymentSummary) => {
    const totalIncome = data.totalCredit || 0;
    const totalExpenses = Math.abs(data.totalDebit || 0);
    const totalSavings = totalIncome - totalExpenses;
    const monthlyChange = 0;

    return {
      totalIncome,
      totalExpenses,
      totalSavings,
      monthlyChange,
    };
  };

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const queryParams: {
        userId: string;
        year?: number;
        startMonth?: string;
        endMonth?: string;
        startDate?: string;
        endDate?: string;
      } = {
        userId: user.id,
      };

      if (filterType === "year" && selectedYear) {
        queryParams.year = parseInt(selectedYear);
      } else if (filterType === "month" && selectedMonth && selectedYear) {
        queryParams.year = parseInt(selectedYear);
        queryParams.startMonth = selectedMonth;
        queryParams.endMonth = selectedMonth;
      } else if (filterType === "day" && startDate && endDate) {
        queryParams.startDate = startDate;
        queryParams.endDate = endDate;
      }

      console.log("📊 Fetching payment data with params:", queryParams);

      const response: IAxiosResponse = await fetchPaymentSummery(queryParams);

      if (response.data) {
        // Store the raw backend data
        setPaymentData(response.data as BackendPaymentSummary);

        // Transform the backend data
        const transformed = transformPaymentData(
          response.data as BackendPaymentSummary
        );

        // Update summary stats
        setSummaryStats({
          totalIncome: transformed.totalIncome,
          totalExpenses: transformed.totalExpenses,
          totalSavings: transformed.totalSavings,
          monthlyChange: transformed.monthlyChange,
        });
      } else {
        console.error("Payment history error:", response.error);
        errorTost("Booking Load Failed", [
          { message: response.error.data?.error || "Please try again later" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      errorTost("Fetch Paymets Failed", [
        { message: "Failed to fetch payment summery. Please try again." },
      ]);
    }
  }, [
    fetchPaymentSummery,
    user?.id,
    filterType,
    selectedYear,
    selectedMonth,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id, fetchData]);

  const handleApplyFilter = () => {
    fetchData();
  };

  const handleClearFilter = () => {
    setFilterType("");
    setSelectedYear("");
    setSelectedMonth("");
    setStartDate("");
    setEndDate("");
    setTimeout(() => {
      fetchData();
    }, 0);
  };

  const handleAddChart = (chart: SavedChart) => {
    if (!user?.id) {
      console.error("❌ No user ID available");
      return;
    }

    console.log("➕ Adding new chart:", chart);

    // Check for duplicates
    const isDuplicate = savedCharts.some(
      (c) =>
        c.categoryName === chart.categoryName && c.chartType === chart.chartType
    );

    if (isDuplicate) {
      console.log("⚠️ Chart already exists");
      errorTost("Chart already exists", [
        { message: "This category chart alredy exists" },
      ]);
      return;
    }

    // Add to array
    const updatedCharts = [...savedCharts, chart];

    // Update state
    setSavedCharts(updatedCharts);

    // Save to localStorage immediately
    saveChartsToStorage(user.id, updatedCharts);
    successToast("Chart added", "Successfully new chart added");
  };

  const handleRemoveChart = (chartId: string) => {
    if (!user?.id) {
      console.error("❌ No user ID available");
      return;
    }

    console.log("🗑️ Removing chart:", chartId);

    // Filter out the removed chart
    const updatedCharts = savedCharts.filter((chart) => chart.id !== chartId);

    // Update state
    setSavedCharts(updatedCharts);

    // Save to localStorage immediately
    saveChartsToStorage(user.id, updatedCharts);
  };

  const renderChart = (chart: SavedChart) => {
    // Find category data from backend
    const categoryData = paymentData?.categoryWise.find(
      (cat) => cat.category === chart.categoryName
    );

    const categoryDebit = Math.abs(categoryData?.totalDebit || 0);
    const categoryCredit =
      categoryData?.totalCredit || paymentData?.totalCredit || 0;

    switch (chart.chartType) {
      case "Pie":
        return (
          <Piechart
            title={chart.categoryName}
            data={{
              debit: categoryDebit,
              credit: categoryCredit,
            }}
          />
        );
      case "Area":
        return (
          <Areachart
            title={chart.categoryName}
            data={{
              debit: categoryDebit,
              credit: categoryCredit,
            }}
          />
        );
      case "Bar":
        return (
          <Barchart
            title={chart.categoryName}
            data={{
              debit: categoryDebit,
              credit: categoryCredit,
            }}
          />
        );
      default:
        return null;
    }
  };

  // Get top 3 categories by spending
  const getTop3Categories = () => {
    if (!paymentData?.categoryWise) return [];

    return paymentData.categoryWise
      .filter((cat) => cat.category !== "Credit" && cat.category !== "Debit")
      .sort((a, b) => Math.abs(b.totalDebit) - Math.abs(a.totalDebit))
      .slice(0, 3);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header Section */}
      <div className="w-full p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Track your finances and manage your budget
          </p>
        </div>

        <AddWalletAndBankAccount />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* Total Income */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Total Income
                </p>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                  ₹{summaryStats.totalIncome.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <TrendingUp
                  className="text-green-600 dark:text-green-400"
                  size={24}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm">
              <TrendingUp size={16} className="text-green-600" />
              <span className="text-green-600 font-medium">
                +{summaryStats.monthlyChange}%
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                vs last period
              </span>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Total Expenses
                </p>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                  ₹{summaryStats.totalExpenses.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <TrendingDown
                  className="text-red-600 dark:text-red-400"
                  size={24}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm">
              <TrendingDown size={16} className="text-red-600" />
              <span className="text-red-600 font-medium">+2.3%</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                vs last period
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section with Filter */}
      <div className="w-full px-4 sm:px-6 md:px-8 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
              Category Analytics
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Monitor your spending across different categories
            </p>
          </div>
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
            onApplyFilter={handleApplyFilter}
            onClearFilter={handleClearFilter}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="w-full px-4 sm:px-6 md:px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Fixed Overview Charts */}

              {/* 1. All Transactions Summary (Pie) */}
              <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <Piechart
                  title="All Transactions"
                  data={{
                    credit: paymentData?.totalCredit || 0,
                    debit: Math.abs(paymentData?.totalDebit || 0),
                    categories: paymentData?.categoryWise || [],
                  }}
                />
              </div>

              {/* 2. Income vs Expenses (Area) */}
              <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <Areachart
                  title="Income vs Expenses"
                  data={{
                    income: paymentData?.totalCredit || 0,
                    expenses: Math.abs(paymentData?.totalDebit || 0),
                  }}
                />
              </div>

              {/* 3. Top 3 Categories (Bar) */}
              <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <Barchart title="Top 3 Categories" data={getTop3Categories()} />
              </div>

              {/* Dynamic Category Charts */}
              {savedCharts.map((chart) => (
                <div
                  key={chart.id}
                  className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden relative group"
                >
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => handleRemoveChart(chart.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {renderChart(chart)}
                </div>
              ))}

              {/* Add Category Card */}
              <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <AddCategory
                  onAddChart={handleAddChart}
                  availableCategories={availableCategories}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
