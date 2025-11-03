import { useEffect, useState } from "react";
import {
  useAddSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useFetchIncomSummeryMutation,
  useFetchMentorSummeryMutation,
  useFetchUserSummeryMutation,
} from "@/services/apis/AdminApis";
import { ISubscription } from "@/@types/interface/ISubscription";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { useFetchSubscriptionPlanMutation } from "@/services/apis/CommonApis";
import MetricsCards from "../components/MetricCard";
import GrowthCharts from "../components/GrowthCharts";

const Dashboard = () => {
  const [plans, setPlans] = useState<ISubscription[]>([]);
  const [fetchPlan] = useFetchSubscriptionPlanMutation();
  const [addPlans] = useAddSubscriptionPlanMutation();
  const [deletePlan] = useDeleteSubscriptionPlanMutation();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalMentors: 0,
    totalIncome: 0,
    userGrowth: [
      { month: "Jan", count: 0 },
      { month: "Feb", count: 0 },
      { month: "Mar", count: 0 },
      { month: "Apr", count: 0 },
      { month: "May", count: 0 },
    ],
    mentorGrowth: [
      { month: "Jan", count: 0 },
      { month: "Feb", count: 0 },
      { month: "Mar", count: 0 },
      { month: "Apr", count: 0 },
      { month: "May", count: 0 },
    ],
    incomeData: [
      { month: "Jan", income: 0 },
      { month: "Feb", income: 0 },
      { month: "Mar", income: 0 },
      { month: "Apr", income: 0 },
      { month: "May", income: 0 },
    ],
  });
  const [fetchUserSummery] = useFetchUserSummeryMutation();
  const [fetchMentorSummery] = useFetchMentorSummeryMutation();
  const [fetchIncomeSummery] = useFetchIncomSummeryMutation();

  const fixedPlanTypes = ["Day", "Month", "Year"];

  const checkPlans = async () => {
    const allPlans = [
      { price: 1999, offer: 0, type: "Year" },
      { price: 599, offer: 0, type: "Month" },
      { price: 199, offer: 0, type: "Day" },
    ];

    const filteredPlans = allPlans.filter(
      (plan) => !plans.some((p) => p.type === plan.type)
    );

    if (filteredPlans.length) {
      try {
        const planResponse: IAxiosResponse = await addPlans(filteredPlans);
        if (planResponse.data.newPlans) {
          setPlans(planResponse.data.newPlans);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        errorTost("Failed to add new subscription plan", [
          { message: "Unable to add subscription plans" },
        ]);
      }
    }
  };

  const handleDeletePlan = async (subscription: ISubscription) => {
    if (fixedPlanTypes.includes(subscription.type)) {
      errorTost("Cannot Delete", [
        { message: "Day, Month, and Year plans cannot be deleted" },
      ]);
      return;
    }

    try {
      const response: IAxiosResponse = await deletePlan(subscription.id);
      if (response.data) {
        setPlans(plans.filter((p) => p.id !== subscription.id));
        successToast("Deleted plan", "Plan deleted successfully");
      } else {
        errorTost(
          "Something went wrong",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
      }
    } catch (err) {
      console.error("Error deleting plan:", err);
      errorTost("Failed to delete plan", [
        { message: "Unable to delete subscription plan" },
      ]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const planResponse: IAxiosResponse = await fetchPlan();
        const newPlans = planResponse.data.data;
        if (planResponse.data.data) {
          setPlans(planResponse.data.data);
        }
        if (newPlans.length < 3) {
          checkPlans();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: IAxiosResponse = await fetchUserSummery();
        if (response.data) {
          const { totalUsers, userGrowth } = response.data;

          setDashboardData((prev) => ({
            ...prev,
            totalUsers,
            userGrowth,
          }));
        } else {
          errorTost(
            "Something went wrong",
            response.error.data.error || [
              { message: `${response.error.data} please try again later` },
            ]
          );
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: IAxiosResponse = await fetchMentorSummery();
        if (response.data) {
          const { totalMentors, mentorGrowth } = response.data;
          setDashboardData((prev) => ({
            ...prev,
            totalMentors,
            mentorGrowth,
          }));
        } else {
          errorTost(
            "Something went wrong",
            response.error.data.error || [
              { message: `${response.error.data} please try again later` },
            ]
          );
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: IAxiosResponse = await fetchIncomeSummery();
        if (response.data) {
          const { totalIncome, incomeData } = response.data;
          setDashboardData((prev) => ({
            ...prev,
            totalIncome,
            incomeData,
          }));
        } else {
          errorTost(
            "Something went wrong",
            response.error.data.error || [
              { message: `${response.error.data} please try again later` },
            ]
          );
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

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-black min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-zinc-100">
          Admin Dashboard
        </h1>
      </div>

      <MetricsCards
        totalUsers={dashboardData.totalUsers}
        totalMentors={dashboardData.totalMentors}
        totalIncome={dashboardData.totalIncome}
      />

      <GrowthCharts
        userGrowth={dashboardData.userGrowth}
        mentorGrowth={dashboardData.mentorGrowth}
        incomeData={dashboardData.incomeData}
        plans={plans}
        setPlans={setPlans}
        onDeletePlan={handleDeletePlan}
        fixedPlanTypes={fixedPlanTypes}
      />
    </div>
  );
};

export default Dashboard;
