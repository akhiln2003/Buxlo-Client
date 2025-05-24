import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IndianRupee, Info, Loader, Percent, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Isubscription } from "@/@types/interface/Isubscription";
import { useEffect, RefObject, useState } from "react";
import { subscriptionSchema } from "../zodeSchema/subscriptionSchema";
import { useUpdateSubscriptionPlanMutation } from "@/services/apis/AdminApis";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { errorTost, successToast } from "@/components/ui/tosastMessage";

const EditSubscriptionForm = ({
  subscription,
  setPlans,
  offerInputRef,
  setIsOpen,
}: {
  subscription: Isubscription;
  setPlans: React.Dispatch<React.SetStateAction<Isubscription[]>>;
  offerInputRef?: RefObject<HTMLInputElement>;
  setIsOpen: (setIsOpen: boolean) => void;
}) => {
  const [updatePlan, { isLoading }] = useUpdateSubscriptionPlanMutation();

  const form = useForm({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      type: subscription.type,
      price: subscription.price,
      offer: subscription.offer,
    },
    mode: "onChange",
  });

  const [liveOfferAmount, setLiveOfferAmount] = useState<string>("0.00");

  useEffect(() => {
    if (offerInputRef?.current) {
      offerInputRef.current.focus();
    }

    const subscription = form.watch((values) => {
      const price = Number(values.price);
      const offer = Number(values.offer);

      if (!isNaN(price) && !isNaN(offer)) {
        const discountAmount = (price * (offer / 100)).toFixed(2);
        setLiveOfferAmount(discountAmount);
      }
    });

    return () => subscription.unsubscribe();
  }, [offerInputRef, form]);

  const onSubmit = async (data: {
    type: string;
    price: number;
    offer: number;
  }) => {
    try {
      const updatedData = { offer: data.offer };
      const id = subscription.id;

      const response: IaxiosResponse = await updatePlan({ id, updatedData });
      if (response.data.updatedData) {
        setPlans((prev: Isubscription[]) =>
          prev.map((sub: Isubscription) =>
            sub.type == data.type ? {...response.data.updatedData} : sub
          )
        )
        setIsOpen(false);
        successToast("succesfull", "Subscription plan updated succefully");
      } else {
        errorTost(
          "Somthing when wrong ",
          response.error.data.error || [
            { message: `${response.error.data} please try again laiter` },
          ]
        );
      }
    } catch (error) {
      console.error(error);
      errorTost("Somthing when wrong ", [
        { message: `Somthing when wrong please try again laiter` },
      ]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-zinc-500">
                <Tag className="w-4 h-4 text-gray-600 dark:text-zinc-500" />
                Subscription Type
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Input
                    placeholder="Enter subscription type"
                    {...field}
                    readOnly
                    className="pr-8 cursor-not-allowed"
                  />
                  <div
                    className="absolute right-2 top-1/2 -translate-y-1/2 
                                        text-gray-500 dark:text-zinc-100 group-hover:text-gray-700 
                                        cursor-not-allowed"
                  >
                    <Info
                      size={15}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <span
                      className="absolute z-10 hidden group-hover:block 
                                            bg-black dark:bg-zinc-800 text-white text-xs px-2 py-1 rounded 
                                            -top-8 right-0 whitespace-nowrap"
                    >
                      Cannot be changed
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-zinc-500">
                <IndianRupee className="w-4 h-4 text-gray-600 dark:text-zinc-500" />
                Base Price
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Input
                    type="number"
                    placeholder="Enter price"
                    {...field}
                    readOnly
                    className="pr-8 cursor-not-allowed"
                  />
                  <div
                    className="absolute right-2 top-1/2 -translate-y-1/2 
                                        text-gray-500 dark:text-zinc-100 group-hover:text-gray-700 
                                        cursor-not-allowed"
                  >
                    <Info
                      size={15}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <span
                      className="absolute z-10 hidden group-hover:block 
                                            bg-black dark:bg-zinc-800 text-white text-xs px-2 py-1 rounded 
                                            -top-8 right-0 whitespace-nowrap"
                    >
                      Cannot be changed
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="offer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-zinc-500">
                <Percent className="w-4 h-4 text-gray-600 dark:text-zinc-500" />
                Offer Percentage
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter offer percentage"
                  {...field}
                  ref={offerInputRef}
                  // type="number"
                  className={` appearance-none ${
                    form.formState.errors.offer
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-zinc-900 rounded-md">
          <span className="text-sm font-medium text-gray-800 dark:text-zinc-100">
            Current Discounted:
          </span>
          <span className="text-lg font-bold text-black dark:text-white">
            ₹{liveOfferAmount}
          </span>
        </div>
        {!isLoading ? (
          <Button
            type="submit"
            className="w-full rounded-md bg-zinc-800 text-white hover:bg-zinc-950 dark:hover:bg-zinc-900 transition-colors"
          >
            Save Changes
          </Button>
        ) : (
          <Button
            type="button"
            className="w-full rounded-md bg-black text-white hover:bg-zinc-950 dark:hover:bg-zinc-800 transition-colors"
          >
            <Loader className="animate-spin" />
          </Button>
        )}
      </form>
    </Form>
  );
};

export default EditSubscriptionForm;
