import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditSubscriptionModal } from "./EditSubscriptionModal";
import { AddSubscriptionModal } from "./AddSubscriptionModal";
import { ISubscription } from "@/@types/interface/ISubscription";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

type GrowthData = {
  month: string;
  count: number;
};

type IncomeData = {
  month: string;
  income: number;
};

type GrowthChartsProps = {
  userGrowth: GrowthData[];
  mentorGrowth: GrowthData[];
  incomeData: IncomeData[];
  plans: ISubscription[];
  setPlans: React.Dispatch<React.SetStateAction<ISubscription[]>>;
  onDeletePlan: (subscription: ISubscription) => void;
  fixedPlanTypes: string[];
};

const tooltipStyle = {
  backgroundColor: "#333",
  color: "white",
  borderRadius: "8px",
};

const GrowthCharts = ({
  userGrowth,
  mentorGrowth,
  incomeData,
  plans,
  setPlans,
  onDeletePlan,
  fixedPlanTypes,
}: GrowthChartsProps) => {
  return (
    <div className="space-y-8 mb-8">
      {/* First Row - User and Mentor Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-zinc-100">
              User Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-zinc-100">
              Mentor Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mentorGrowth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  name="Mentors"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Monthly Revenue and Subscription Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-zinc-100">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="income" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-700 dark:text-zinc-100">
              Subscription Plans
            </CardTitle>
            <AddSubscriptionModal plans={plans} setPlans={setPlans} />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {plans.map((subscription) => {
                const hasOffer = subscription.offer && subscription.offer > 0;
                const offerPrice = hasOffer
                  ? (subscription.price * (1 - subscription.offer / 100)).toFixed(2)
                  : null;
                const isFixedPlan = fixedPlanTypes.includes(subscription.type);

                return (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div>
                      <h3 className="font-cabinet font-semibold text-gray-800 dark:text-zinc-100 text-sm">
                        {subscription.type}
                      </h3>
                      <div className="text-xs text-gray-600 dark:text-zinc-300">
                        {hasOffer ? (
                          <>
                            <div className="flex items-center space-x-2">
                              <span className="line-through text-red-500 font-semibold">
                                ₹{subscription.price}
                              </span>
                              <span className="text-green-600 font-semibold">
                                ({subscription.offer}% OFF)
                              </span>
                            </div>
                            <div className="text-black dark:text-white font-semibold">
                              ₹{offerPrice}
                            </div>
                          </>
                        ) : (
                          <div className="text-black dark:text-white font-semibold">
                            ₹{subscription.price}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <EditSubscriptionModal
                        subscription={subscription}
                        setPlans={setPlans}
                      />
                      <DeleteConfirmationModal
                        subscription={subscription}
                        onDeleteConfirm={onDeletePlan}
                        isFixedPlan={isFixedPlan}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrowthCharts;