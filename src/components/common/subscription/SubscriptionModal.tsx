import React, { useEffect, useState } from "react";
import { X, Check, Star, Crown, CreditCard, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useCreateSubscriptionCheckoutSessionMutation,
  useFetchSubscriptionPlanMutation,
} from "@/services/apis/CommonApis";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";
import { useGetUser } from "@/hooks/useGetUser";

// Backend data structure
interface BackendSubscriptionPlan {
  id: string;
  price: string;
  offer: string;
  type: string; // 'Year', 'Month', 'Day'
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Frontend component structure
interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  originalPrice?: string;
  features: string[];
  popular?: boolean;
  savings?: string;
  description: string;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription?: string;
  currentSubscriptionType?: string; // Add this prop to pass current plan type
}

// Plan hierarchy: Day < Month < Year
const PLAN_HIERARCHY: { [key: string]: number } = {
  day: 1,
  month: 2,
  year: 3,
};

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentSubscription,
  currentSubscriptionType,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [rowPlans, setRowPlans] = useState<SubscriptionPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<SubscriptionPlan[]>([]);

  const [fetchPlan] = useFetchSubscriptionPlanMutation();
  const [createChecKoutSession] =
    useCreateSubscriptionCheckoutSessionMutation();
  const user = useGetUser();

  // Function to transform backend data to frontend format with percentage-based offers
  const transformBackendData = (
    backendPlans: BackendSubscriptionPlan[]
  ): SubscriptionPlan[] => {
    return backendPlans.map((backendPlan) => {
      const originalPrice = parseFloat(backendPlan.price);
      const offerPercentage = parseFloat(backendPlan.offer);
      const type = backendPlan.type.toLowerCase();

      // Calculate discounted price if there's an offer percentage
      let finalPrice = originalPrice;
      let savings = undefined;
      let originalPriceString = undefined;

      if (offerPercentage > 0 && offerPercentage <= 100) {
        // Calculate discount amount
        const discountAmount = (originalPrice * offerPercentage) / 100;
        finalPrice = originalPrice - discountAmount;

        // Set up display strings
        originalPriceString = `₹${originalPrice.toFixed(2)}`;
        savings = `Save ${offerPercentage}%`;
      }

      // Define features based on plan type
      const getFeatures = (planType: string): string[] => {
        const baseFeatures = [
          "Access to premium content",
          "Email support",
          "Mobile app access",
          "Basic analytics",
        ];

        const proFeatures = [
          "Priority support",
          "Advanced analytics",
          "Video tutorials",
          "Progress tracking",
          "Certificate of completion",
        ];

        const premiumFeatures = [
          "All Pro features",
          "1-on-1 mentoring sessions",
          "Custom learning paths",
          "API access",
          "White-label options",
          "Dedicated account manager",
        ];

        switch (planType) {
          case "day":
            return [...baseFeatures];
          case "month":
            return [...baseFeatures, ...proFeatures];
          case "year":
            return [...baseFeatures, ...proFeatures, ...premiumFeatures];
          default:
            return baseFeatures;
        }
      };

      // Define plan names and descriptions
      const getPlanInfo = (planType: string) => {
        switch (planType) {
          case "day":
            return {
              name: "Daily Plan",
              description: "Perfect for short-term access",
              period: "per day",
            };
          case "month":
            return {
              name: "Monthly Plan",
              description: "Most flexible option for regular users",
              period: "per month",
            };
          case "year":
            return {
              name: "Yearly Plan",
              description: "Best value for serious learners",
              period: "per year",
            };
          default:
            return {
              name: `${backendPlan.type} Plan`,
              description: "Subscription plan",
              period: `per ${planType}`,
            };
        }
      };

      const planInfo = getPlanInfo(type);

      return {
        id: backendPlan.id,
        name: planInfo.name,
        price: `₹${finalPrice.toFixed(2)}`,
        period: planInfo.period,
        originalPrice: originalPriceString,
        features: getFeatures(type),
        popular: type === "month",
        savings,
        description: planInfo.description,
      };
    });
  };

  // Filter plans based on current subscription
  const filterUpgradeablePlans = (
    allPlans: SubscriptionPlan[],
    currentType?: string
  ): SubscriptionPlan[] => {
    if (!currentType) {
      // No current subscription, show all plans
      return allPlans;
    }

    const currentTypeKey = currentType.toLowerCase();
    const currentHierarchy = PLAN_HIERARCHY[currentTypeKey] || 0;

    // Filter plans that are higher in hierarchy
    return allPlans.filter((plan) => {
      const planTypeKey = plan.period.split(" ").pop()?.toLowerCase() || "";
      const planHierarchy = PLAN_HIERARCHY[planTypeKey] || 0;
      return planHierarchy > currentHierarchy;
    });
  };

  const handlePurchase = async (plan: SubscriptionPlan) => {
    setIsLoading(true);
    try {
      const select = rowPlans.filter((data) => data.id == plan.id);

      const response: IAxiosResponse = await createChecKoutSession({
        userId: user?.id as string,
        data: select[0],
        type: "subscription",
      });

      if (response.data) {
        window.location.href = response.data.url;
        onClose();
      } else {
        errorTost("Error", [
          {
            message:
              response.error?.data?.error[0].message || "Booking failed.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error during booking:", error);
      errorTost("Error", [{ message: "Something went wrong while booking." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response: IAxiosResponse = await fetchPlan();

      if (response.data.data && Array.isArray(response.data.data)) {
        setRowPlans(response.data.data);
        const transformedPlans = transformBackendData(response.data.data);

        const sortedPlans = transformedPlans.sort((a, b) => {
          const priceA = parseFloat(a.price.replace("₹", ""));
          const priceB = parseFloat(b.price.replace("₹", ""));
          return priceA - priceB;
        });

        setPlans(sortedPlans);

        // Filter plans based on current subscription
        const filtered = filterUpgradeablePlans(
          sortedPlans,
          currentSubscriptionType
        );
        setFilteredPlans(filtered);
      } else {
        errorTost(
          "Something went wrong",
          response.error?.data?.error || [
            { message: `${response.error?.data} please try again later` },
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

  useEffect(() => {
    if (isOpen) {
      fetchSubscriptions();
      setSelectedPlan(""); // Reset selection when modal opens
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const plansToDisplay = filteredPlans.length > 0 ? filteredPlans : plans;
  const hasNoUpgrades = currentSubscriptionType && filteredPlans.length === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-black rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-6 flex justify-between items-center rounded-t-2xl">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Crown className="w-8 h-8 text-yellow-500" />
                {hasNoUpgrades ? "Your Plan" : "Choose Your Plan"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {hasNoUpgrades
                  ? "You already have the highest tier subscription"
                  : "Unlock premium features and accelerate your learning journey"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Current Subscription Status */}
          {currentSubscription && (
            <div className="p-6 bg-blue-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Current Plan:{" "}
                    {plans.find((p) => p.id === currentSubscription)?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {hasNoUpgrades
                      ? "You have the highest tier plan available"
                      : "Your subscription is active and renews automatically"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Plans Grid */}
          <div className="p-6">
            {plansToDisplay.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading subscription plans...
                </p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {plansToDisplay.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all flex flex-col h-full min-h-[500px] ${
                      selectedPlan === plan.id
                        ? "border-blue-500 bg-blue-50 dark:bg-gray-900"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    } ${
                      plan.popular ? "ring-2 ring-blue-500 ring-opacity-30" : ""
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                          <Star className="w-4 h-4" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Savings Badge */}
                    {plan.savings && (
                      <div className="absolute -top-4 right-4">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                          {plan.savings}
                        </span>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {plan.description}
                      </p>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {plan.price}
                        </span>
                        {plan.originalPrice && (
                          <span className="text-lg text-gray-500 line-through ml-2">
                            {plan.originalPrice}
                          </span>
                        )}
                        <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {plan.period}
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 flex-grow mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button - Fixed at bottom */}
                    <div className="mt-auto">
                      <button
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                          currentSubscription === plan.id
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                            : selectedPlan === plan.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            currentSubscription !== plan.id &&
                            !isLoading &&
                            selectedPlan === plan.id
                          ) {
                            handlePurchase(plan);
                          }
                        }}
                        disabled={
                          currentSubscription === plan.id ||
                          isLoading ||
                          selectedPlan !== plan.id
                        }
                      >
                        {isLoading && selectedPlan === plan.id ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            Processing...
                          </>
                        ) : currentSubscription === plan.id ? (
                          "Current Plan"
                        ) : selectedPlan === plan.id ? (
                          <>
                            <CreditCard className="w-4 h-4" />
                            Upgrade to {plan.name}
                          </>
                        ) : (
                          <>Select Plan</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* No Upgrades Available Message */}
            {hasNoUpgrades && (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white mb-4">
                  <Crown className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Premium Member
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  You already have the highest tier subscription. Enjoy all the
                  premium features!
                </p>
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-12 text-center">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  All plans include:
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Secure payments
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Cancel anytime
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    24/7 support
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  No hidden fees • Money-back guarantee • World-class support
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;