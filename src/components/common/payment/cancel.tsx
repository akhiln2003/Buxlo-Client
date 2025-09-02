import { X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { errorTost } from "@/components/ui/tosastMessage";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { useEffect } from "react";
import {
  useUseUpdateBookingPlanMutation,
  useUseUpdateSubscriptionPlanMutation,
} from "@/services/apis/CommonApis";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const [updateBooking] = useUseUpdateBookingPlanMutation();
  const [updateSbuscription] = useUseUpdateSubscriptionPlanMutation();

  const updatePaymetStatus = async () => {
    try {
      const data = { status: "cancelled" };

      if (type == "booking") {
        const response: IaxiosResponse = await updateBooking({ id, data });

        if (response.error) {
          errorTost("Error", [
            {
              message:
                response.error?.data?.error[0].message ||
                "update payment failed.",
            },
          ]);
        }
      } else {
        const response: IaxiosResponse = await updateSbuscription({ id, data });

        if (response.error) {
          errorTost("Error", [
            {
              message:
                response.error?.data?.error[0].message ||
                "update payment failed.",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error during booking:", error);
      errorTost("Error", [
        { message: "Something went wrong while updateing payment." },
      ]);
    }
  };

  useEffect(() => {
    updatePaymetStatus();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Cancel Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full border-4 border-red-500 mb-8">
          <X className="w-8 h-8 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Paymet Cancelled
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-12">
          Your payment process was cancelled. No payment has been processed.
        </p>

        {/* Cancel Message */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              No Worries!
            </h2>
            <p className="text-gray-600">
              You can try again anytime or continue using our free features.
              We're here whenever you're ready.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {/* <Link
            to={UserUrls.home} // Assuming you have a pricing page
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-block"
          >
            Try Again
          </Link> */}
          <Link
            to={UserUrls.home}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-block"
          >
            Go to Home
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16">
          <p className="text-gray-500 text-sm">
            © 2024 Acme Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
