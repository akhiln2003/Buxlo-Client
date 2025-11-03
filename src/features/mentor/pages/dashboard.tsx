import { useState, useEffect } from "react";
import {  DollarSign, TrendingUp, Clock, BookOpen,  TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,

} from "@/components/ui/card";
import { useGetUser } from "@/hooks/useGetUser";
import AddWalletAndBankAccount from "@/features/user/components/AddWalletAndBankAccount";
import { Areachart } from "@/components/common/charts/AreaChart";
import { Piechart } from "@/components/common/charts/PieChart ";
import { Barchart } from "@/components/common/charts/BarChart";


interface MentorStats {
  totalBookings: number;
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
  cancelledSlots: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  categoryWise?: Array<{
    category: string;
    totalDebit: number;
    totalCredit?: number;
  }>;
}

function MentorDashboard() {
  const user = useGetUser();
  const [mentorStats, setMentorStats] = useState<MentorStats>({
    totalBookings: 68,
    totalSlots: 100,
    bookedSlots: 65,
    availableSlots: 25,
    cancelledSlots: 10,
    totalIncome: 328000,
    totalExpenses: 88000,
    monthlyIncome: 67000,
    monthlyExpenses: 18000,
  });

  // Simulate fetching mentor stats
  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchMentorStats = async () => {
    //   const response = await fetch(`/api/mentor/stats/${user?.id}`);
    //   const data = await response.json();
    //   setMentorStats(data);
    // };
    // fetchMentorStats();
  }, [user?.id]);

  // Prepare data for Pie chart (Slot Distribution)
  const slotDistributionData = {
    categories: [
      { category: "Booked", totalDebit: mentorStats.bookedSlots, totalCredit: 0 },
      { category: "Available", totalDebit: mentorStats.availableSlots, totalCredit: 0 },
      { category: "Cancelled", totalDebit: mentorStats.cancelledSlots, totalCredit: 0 },
    ]
  };

  // Prepare data for Bar chart (Booking Trends)
  const bookingTrendData = [
    { category: "Week 1", totalDebit: 12, totalCredit: 0 },
    { category: "Week 2", totalDebit: 19, totalCredit: 0 },
    { category: "Week 3", totalDebit: 15, totalCredit: 0 },
    { category: "Week 4", totalDebit: 22, totalCredit: 0 },
  ];

  const netProfit = mentorStats.monthlyIncome - mentorStats.monthlyExpenses;
  const cancellationRate = ((mentorStats.cancelledSlots / mentorStats.totalSlots) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Mentor Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Welcome back! Here's your performance overview
              </p>
            </div>
            
            {/* Wallet/Bank Account Component */}
            <AddWalletAndBankAccount />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Total Bookings */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all hover:scale-105 duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Bookings</p>
                  <h3 className="text-3xl sm:text-4xl font-bold">{mentorStats.totalBookings}</h3>
                  <p className="text-blue-100 text-xs mt-2">All time sessions</p>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="h-7 w-7" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Slots */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white hover:shadow-xl transition-all hover:scale-105 duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium mb-1">Total Slots</p>
                  <h3 className="text-3xl sm:text-4xl font-bold">{mentorStats.totalSlots}</h3>
                  <p className="text-indigo-100 text-xs mt-2">
                    {mentorStats.bookedSlots} booked • {mentorStats.availableSlots} available
                  </p>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Clock className="h-7 w-7" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Income */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all hover:scale-105 duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Total Income</p>
                  <h3 className="text-3xl sm:text-4xl font-bold">₹{(mentorStats.totalIncome / 1000).toFixed(0)}k</h3>
                  <p className="text-green-100 text-xs mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% this month
                  </p>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <DollarSign className="h-7 w-7" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Expenses */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-500 to-rose-600 text-white hover:shadow-xl transition-all hover:scale-105 duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium mb-1">Total Expenses</p>
                  <h3 className="text-3xl sm:text-4xl font-bold">₹{(mentorStats.totalExpenses / 1000).toFixed(0)}k</h3>
                  <p className="text-rose-100 text-xs mt-2">Platform & fees</p>
                </div>
                <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <TrendingDown className="h-7 w-7" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Income vs Expenses Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-shadow">
            <Areachart 
              title="Income vs Expenses"
              data={{
                income: mentorStats.totalIncome,
                expenses: mentorStats.totalExpenses
              }}
            />
          </div>

          {/* Slot Distribution Pie Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-shadow">
            <Piechart 
              title="Slot Distribution"
              data={{
                categories: slotDistributionData.categories
              }}
            />
          </div>
        </div>

        {/* Booking Trends Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-shadow mb-8">
          <Barchart 
            title="Weekly Booking Trends"
            data={bookingTrendData}
          />
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">
                This Month Income
              </p>
              <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-500">
                ₹{mentorStats.monthlyIncome.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">
                This Month Expense
              </p>
              <p className="text-lg sm:text-2xl font-bold text-rose-600 dark:text-rose-500">
                ₹{mentorStats.monthlyExpenses.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">
                Net Profit
              </p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-500">
                ₹{netProfit.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">
                Cancellation Rate
              </p>
              <p className="text-lg sm:text-2xl font-bold text-amber-600 dark:text-amber-500">
                {cancellationRate}%
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MentorDashboard;