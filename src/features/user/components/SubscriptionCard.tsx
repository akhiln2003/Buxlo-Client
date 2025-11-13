import { ISubscription } from "@/@types/interface/ISubscription";
import { IUser } from "@/@types/interface/IUser";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  Gift,
  Loader2,
  Star,
  XCircle,
} from "lucide-react";

interface SubscriptionCardProps {
  users: Partial<IUser>;
  subscription: ISubscription;
  fetchSubscriptionIsloading: boolean;
  handleSubscriptionClick: () => void;
  formatDate: (dateString: string) => string;
  getPlanTypeDisplay: (type: string) => string;
  getPlanColor: (type: string) => string;
  isSubscriptionActive: () => boolean;
  getTimeRemaining: () => string | null;
  getPlanFeatures: (type: string) => string[];
}

const SubscriptionCard = ({
  users,
  subscription,
  fetchSubscriptionIsloading,
  handleSubscriptionClick,
  formatDate,
  getPlanTypeDisplay,
  getPlanColor,
  isSubscriptionActive,
  getTimeRemaining,
  getPlanFeatures,
}: SubscriptionCardProps) => {
  const getPlanDurationInDays = (type: string) => {
    switch (type) {
      case "Day":
        return 1;
      case "Month":
        return 30;
      case "Year":
        return 365;
      default:
        return 0;
    }
  };

  const getStartDate = (endDate: string, type: string) => {
    const duration = getPlanDurationInDays(type);
    const end = new Date(endDate);
    end.setDate(end.getDate() - duration);
    return end.toISOString();
  };
  if (fetchSubscriptionIsloading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-700 dark:to-zinc-600 rounded-xl p-6 shadow-md border border-indigo-100 dark:border-zinc-600">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Loading subscription details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!users.premiumId || !subscription) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-700 dark:to-zinc-600 rounded-xl p-6 shadow-md border border-indigo-100 dark:border-zinc-600">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
              <Crown className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Premium Subscription
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Unlock all premium features
              </p>
            </div>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white mb-4">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Upgrade to Premium
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm mx-auto">
              Get access to exclusive features, priority support, and advanced
              tools to enhance your experience.
            </p>
          </div>
          <button
            onClick={handleSubscriptionClick}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Choose Your Plan
          </button>
        </div>
      </div>
    );
  }

  const isActive = isSubscriptionActive();
  const timeRemaining = getTimeRemaining();
  const planFeatures = getPlanFeatures(subscription.type);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-700 dark:to-zinc-600 rounded-xl p-6 shadow-md border border-indigo-100 dark:border-zinc-600">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div
            className={`p-3 rounded-xl bg-gradient-to-r ${getPlanColor(
              subscription.type
            )} text-white shadow-lg`}
          >
            <Crown className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {getPlanTypeDisplay(subscription.type)}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isActive ? "Active Subscription" : "Expired Subscription"}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {isActive ? (
            <div className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                Active
              </span>
            </div>
          ) : (
            <div className="flex items-center px-4 py-2 bg-red-100 dark:bg-red-900 rounded-full">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                Expired
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Start Date</span>
            </div>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {formatDate(
                getStartDate(users.premiumEndDate!, subscription.type)
              )}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">End Date</span>
            </div>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {formatDate(users.premiumEndDate!)}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Plan Price
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                ₹{subscription.price}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                /{subscription.type.toLowerCase()}
              </span>
            </div>
          </div>
          {subscription.offer > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Discount Applied
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                -{subscription.offer}%
              </span>
            </div>
          )}
          {timeRemaining && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-600">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Time Remaining
                </span>
                <span
                  className={`text-sm font-semibold ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {timeRemaining}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            Plan Features
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {planFeatures.map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
        
         <button
            onClick={handleSubscriptionClick}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Upgrade Your Plan
          </button>
        
      </div>
    </div>
  );
};

export default SubscriptionCard;
