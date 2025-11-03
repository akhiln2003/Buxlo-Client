import React from "react";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditSubscriptionModal } from "./EditSubscriptionModal";
import { ISubscription } from "@/@types/interface/ISubscription";

type SubscriptionPlansProps = {
  plans: ISubscription[];
  setPlans: React.Dispatch<React.SetStateAction<ISubscription[]>>;
  onDeletePlan: (subscription: ISubscription) => void;
  fixedPlanTypes: string[];
};

const SubscriptionPlans = ({
  plans,
  setPlans,
  onDeletePlan,
  fixedPlanTypes,
}: SubscriptionPlansProps) => {
  return (
    <div className="grid grid-cols-1">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-700 dark:text-zinc-100">
            Subscription Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plans.map((subscription) => {
              const hasOffer = subscription.offer && subscription.offer > 0;
              const offerPrice = hasOffer
                ? (subscription.price * (1 - subscription.offer / 100)).toFixed(
                    2
                  )
                : null;
              const isFixedPlan = fixedPlanTypes.includes(subscription.type);

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

                  <div className="flex items-center gap-2">
                    <EditSubscriptionModal
                      subscription={subscription}
                      setPlans={setPlans}
                    />
                    {!isFixedPlan && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeletePlan(subscription)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;