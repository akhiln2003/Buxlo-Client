import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  DollarSign,
  Activity,
  Zap,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditSubscriptionModal } from "../components/EditSubscriptionModal";
import { useFetchSubscriptionPlanMutation } from "@/services/apis/AdminApis";
import { Isubscription } from "@/@types/interface/Isubscription";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";

const Dashboard = () => {
  const [plans, setPlans] = useState<Isubscription[]>([]);
  const [fetchPlan] = useFetchSubscriptionPlanMutation();

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 5420,
    totalIncome: 254300,
    activeUsers: 3210,
    newUsers: 420,
    userGrowth: [
      { month: "Jan", users: 3000 },
      { month: "Feb", users: 3500 },
      { month: "Mar", users: 4000 },
      { month: "Apr", users: 4500 },
      { month: "May", users: 5000 },
    ],
    incomeData: [
      { month: "Jan", income: 50000 },
      { month: "Feb", income: 60000 },
      { month: "Mar", income: 75000 },
      { month: "Apr", income: 90000 },
      { month: "May", income: 110000 },
    ],
    subscriptionBreakdown: [
      { name: "Basic", value: 2000 },
      { name: "Pro", value: 2500 },
      { name: "Enterprise", value: 920 },
    ],
  });

  const COLORS = ["#3B82F6", "#10B981", "#F43F5E", "#8B5CF6"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const planResponse: IaxiosResponse = await fetchPlan();

        if (planResponse.data.data) {
          setPlans(planResponse.data.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        errorTost("Fetch Failed", [
          { message: "Unable to load subscription plans" },
        ]);
      }
    };

    fetchData();
  }, []);

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    bgColor = "bg-blue-50",
    textColor = "text-blue-600",
    trend = "up",
  }) => (
    <Card
      className={`${bgColor} hover:shadow-lg transition-shadow dark:bg-zinc-900`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${textColor}`} />
          {trend === "up" && (
            <TrendingUp className="h-4 w-4 text-green-500 ml-2" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-black min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-zinc-100">
          Admin Dashboard
        </h1>
        <Button variant="outline" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" /> Billing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon={Users}
        />
        <MetricCard
          title="Total Income"
          value={`₹${dashboardData.totalIncome}`}
          icon={DollarSign}
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        <MetricCard
          title="Active Users"
          value={dashboardData.activeUsers}
          icon={Activity}
          bgColor="bg-red-50 "
          textColor="text-red-600"
        />
        <MetricCard
          title="New Users"
          value={dashboardData.newUsers}
          icon={Zap}
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              User Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.userGrowth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    color: "white",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.incomeData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    color: "white",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="income" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Subscription Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plans.map((subscription) => {
                const hasOffer = subscription.offer && subscription.offer > 0;
                const offerPrice = hasOffer
                  ? Math.round(
                      subscription.price * (1 - subscription.offer / 100)
                    )
                  : null;

                return (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div>
                      <h3 className="font-cabinet font-semibold text-gray-800 dark:text-zinc-100">
                        {subscription.type}
                      </h3>

                      <div className="text-sm text-gray-600 dark:text-zinc-300">
                        {hasOffer ? (
                          <>
                            <div className="flex items-center space-x-2">
                              <span className="line-through text-red-500 font-semibold">
                              price : ₹{subscription.price}
                              </span>
                              <span className="text-green-600 font-semibold">
                                ({subscription.offer}% OFF)
                              </span>
                            </div>
                            <div className="text-black dark:text-white font-semibold">
                              OfferPrice : ₹{offerPrice}
                            </div>
                          </>
                        ) : (
                          <div className="text-black dark:text-white font-semibold">
                           price : ₹{subscription.price}
                          </div>
                        )}
                      </div>
                    </div>

                    <EditSubscriptionModal
                      subscription={subscription}
                      setPlans={setPlans}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Subscription Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.subscriptionBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelStyle={{ fill: "white", fontSize: "12px" }}
                >
                  {dashboardData.subscriptionBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#333",
                    color: "white",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
