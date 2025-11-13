import { useEffect, useState } from "react";
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
  type: string;
  duration: number; // Duration in days
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
  duration: number;
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
  currentSubscriptionDuration?: number; // Use duration instead of type
}

// Standard benefits that all plans have
const STANDARD_FEATURES = [
  "Access to premium content",
  "Email support",
  "Mobile app access",
  "Basic analytics",
  "HD video streaming",
  "Download for offline viewing",
  "Multi-device access",
  "Regular content updates",
];

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentSubscription,
  currentSubscriptionDuration,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [rowPlans, setRowPlans] = useState<BackendSubscriptionPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<SubscriptionPlan[]>([]);

  const [fetchPlan] = useFetchSubscriptionPlanMutation();
  const [createChecKoutSession] = useCreateSubscriptionCheckoutSessionMutation();
  const user = useGetUser();

  // Helper function to get plan display name based on duration
  const getPlanDisplayName = (duration: number): string => {
    if (duration === 1) return "Daily Plan";
    if (duration === 7) return "Weekly Plan";
    if (duration === 30) return "Monthly Plan";
    if (duration === 90) return "Quarterly Plan";
    if (duration === 180) return "Semi-Annual Plan";
    if (duration === 365) return "Yearly Plan";
    if (duration >= 36500) return "Lifetime Plan";
    return `${duration}-Day Plan`;
  };

  // Helper function to get period display text
  const getPeriodDisplay = (duration: number): string => {
    if (duration === 1) return "per day";
    if (duration === 7) return "per week";
    if (duration === 30) return "per month";
    if (duration === 90) return "per quarter";
    if (duration === 180) return "per 6 months";
    if (duration === 365) return "per year";
    if (duration >= 36500) return "one-time payment";
    return `for ${duration} days`;
  };

  // Helper function to get plan description
  const getPlanDescription = (duration: number): string => {
    if (duration === 1) return "Perfect for short-term access";
    if (duration === 7) return "Great for weekly learners";
    if (duration === 30) return "Most flexible option";
    if (duration === 90) return "Ideal for committed learners";
    if (duration === 180) return "Extended learning journey";
    if (duration === 365) return "Best value for serious learners";
    if (duration >= 36500) return "Unlimited lifetime access";
    return "Flexible learning duration";
  };

  // Determine which plan should be marked as popular (longest non-lifetime)
  const getPopularPlanDuration = (allPlans: BackendSubscriptionPlan[]): number => {
    const nonLifetimePlans = allPlans.filter(p => p.duration < 36500);
    if (nonLifetimePlans.length === 0) return 0;
    
    // Find the plan with maximum duration (likely yearly)
    const maxDuration = Math.max(...nonLifetimePlans.map(p => p.duration));
    // If there's a yearly plan (365 days), mark it as popular, otherwise mark the longest
    return nonLifetimePlans.some(p => p.duration === 365) ? 365 : maxDuration;
  };

  // Transform backend data to frontend format
  const transformBackendData = (
    backendPlans: BackendSubscriptionPlan[]
  ): SubscriptionPlan[] => {
    const popularDuration = getPopularPlanDuration(backendPlans);

    return backendPlans.map((backendPlan) => {
      const originalPrice = parseFloat(backendPlan.price);
      const offerPercentage = parseFloat(backendPlan.offer);
      const duration = backendPlan.duration;

      // Calculate discounted price if there's an offer percentage
      let finalPrice = originalPrice;
      let savings = undefined;
      let originalPriceString = undefined;

      if (offerPercentage > 0 && offerPercentage <= 100) {
        const discountAmount = (originalPrice * offerPercentage) / 100;
        finalPrice = originalPrice - discountAmount;
        originalPriceString = `₹${originalPrice.toFixed(2)}`;
        savings = `Save ${offerPercentage}%`;
      }

      return {
        id: backendPlan.id,
        name: getPlanDisplayName(duration),
        price: `₹${finalPrice.toFixed(2)}`,
        period: getPeriodDisplay(duration),
        duration: duration,
        originalPrice: originalPriceString,
        features: STANDARD_FEATURES,
        popular: duration === popularDuration,
        savings,
        description: getPlanDescription(duration),
      };
    });
  };

  // Filter plans based on current subscription duration
  const filterUpgradeablePlans = (
    allPlans: SubscriptionPlan[],
    currentDuration?: number
  ): SubscriptionPlan[] => {
    if (!currentDuration) {
      return allPlans;
    }

    // Filter plans with longer duration than current
    return allPlans.filter((plan) => plan.duration > currentDuration);
  };

  const handlePurchase = async (plan: SubscriptionPlan) => {
    setIsLoading(true);
    try {
      const select = rowPlans.find((data) => data.id === plan.id);

      if (!select) {
        errorTost("Error", [{ message: "Plan not found" }]);
        return;
      }

      const response: IAxiosResponse = await createChecKoutSession({
        userId: user?.id as string,
        data: select,
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
      const response: IAxiosResponse = await fetchPlan({});

      if (response.data.data && Array.isArray(response.data.data)) {
        setRowPlans(response.data.data);
        const transformedPlans = transformBackendData(response.data.data);

        // Sort plans by duration (ascending)
        const sortedPlans = transformedPlans.sort((a, b) => a.duration - b.duration);

        setPlans(sortedPlans);

        // Filter plans based on current subscription
        const filtered = filterUpgradeablePlans(
          sortedPlans,
          currentSubscriptionDuration
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
      setSelectedPlan("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const plansToDisplay = filteredPlans.length > 0 ? filteredPlans : plans;
  const hasNoUpgrades = currentSubscriptionDuration && filteredPlans.length === 0;

  // Determine grid columns based on number of plans
  const getGridColumns = (planCount: number): string => {
    if (planCount === 1) return "grid-cols-1 max-w-md mx-auto";
    if (planCount === 2) return "md:grid-cols-2 max-w-4xl mx-auto";
    if (planCount === 3) return "lg:grid-cols-3";
    if (planCount === 4) return "md:grid-cols-2 lg:grid-cols-4";
    if (planCount >= 5) return "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    return "lg:grid-cols-3";
  };

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
          className="bg-white dark:bg-black rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-6 flex justify-between items-center rounded-t-2xl sticky top-0 z-10">
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
              <div className={`grid ${getGridColumns(plansToDisplay.length)} gap-6`}>
                {plansToDisplay.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all flex flex-col ${
                      selectedPlan === plan.id
                        ? "border-blue-500 bg-blue-50 dark:bg-gray-900"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    } ${
                      plan.popular ? "ring-2 ring-blue-500 ring-opacity-30" : ""
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {/* Badges Container */}
                    <div className="absolute -top-4 left-0 right-0 flex justify-between px-4">
                      {/* Popular Badge */}
                      {plan.popular && (
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                          <Star className="w-4 h-4" />
                          Most Popular
                        </span>
                      )}
                      
                      {/* Savings Badge */}
                      {plan.savings && (
                        <span className={`bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg ${!plan.popular ? 'ml-auto' : ''}`}>
                          {plan.savings}
                        </span>
                      )}
                    </div>

                    {/* Plan Header */}
                    <div className="text-center mb-6 mt-2">
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

                    {/* Features List - Fixed height for alignment */}
                    <ul className="space-y-3 flex-grow mb-6 min-h-[280px]">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
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
                          "Select Plan"
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* No Upgrades Available Message */}
            {hasNoUpgrades && (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl mt-6">
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