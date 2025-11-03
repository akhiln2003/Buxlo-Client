import React from "react";
import { Users, DollarSign, UserCheck, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  bgColor?: string;
  textColor?: string;
};

const MetricCard = ({
  title,
  value,
  icon: Icon,
  bgColor = "bg-blue-50",
  textColor = "text-blue-600",
}: MetricCardProps) => (
  <Card
    className={`${bgColor} hover:shadow-lg transition-shadow dark:bg-zinc-900`}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-500 dark:text-zinc-400">
        {title}
      </CardTitle>
      <div className="flex items-center">
        <Icon className={`h-5 w-5 ${textColor}`} />
        <TrendingUp className="h-4 w-4 text-green-500 ml-2" />
      </div>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
    </CardContent>
  </Card>
);

type MetricsCardsProps = {
  totalUsers: number;
  totalMentors: number;
  totalIncome: number;
};

const MetricsCards = ({
  totalUsers,
  totalMentors,
  totalIncome,
}: MetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="Total Users"
        value={totalUsers}
        icon={Users}
        bgColor="bg-blue-50"
        textColor="text-blue-600"
      />
      <MetricCard
        title="Total Mentors"
        value={totalMentors}
        icon={UserCheck}
        bgColor="bg-purple-50"
        textColor="text-purple-600"
      />
      <MetricCard
        title="Total Income"
        value={`₹${totalIncome}`}
        icon={DollarSign}
        bgColor="bg-green-50"
        textColor="text-green-600"
      />
    </div>
  );
};

export default MetricsCards;