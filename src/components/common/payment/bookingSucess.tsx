import  { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Ipayment } from "@/@types/interface/Ipayment";
import { Link, useSearchParams } from "react-router-dom";
import { errorTost } from "@/components/ui/tosastMessage";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { useFetchOnePaymetMutation } from "@/services/apis/CommonApis";
import { UserUrls } from "@/@types/urlEnums/UserUrls";

const BookingSuccess = () => {
  const [paymentDetails, setPaymentDetails] = useState<Ipayment | null>(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [fetchPayment] = useFetchOnePaymetMutation();

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to truncate payment ID
  const formatPaymentId = (paymentId: string) => {
    if (paymentId.length > 20) {
      return `${paymentId.substring(0, 10)}...${paymentId.substring(
        paymentId.length - 6
      )}`;
    }
    return paymentId;
  };

  const fetchData = async (id: string) => {
    try {
      const response: IaxiosResponse = await fetchPayment(id);
      if (response.data) {
        setPaymentDetails(response.data.payment);
      } else {
        errorTost("Error", [
          {
            message:
              response.error?.data?.error[0].message ||
              "fetching payment failed.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error during booking:", error);
      errorTost("Error", [
        { message: "Something went wrong while fetching payment." },
      ]);
    }
  };

  useEffect(() => {
    fetchData(id!);
  }, []);

  console.log("::::::::::::::::::", paymentDetails);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full border-4 border-green-500 mb-8">
          <Check className="w-8 h-8 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Payment Successful
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-12">Thank you for your purchase!</p>

        {/* Payment Details Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Amount Paid:</span>
              <span className="font-semibold text-gray-900">
                ₹{paymentDetails ? paymentDetails.amount : 0}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-700">Date & Time:</span>
              <span className="font-semibold text-gray-900 text-right">
                {paymentDetails && paymentDetails.updatedAt
                  ? formatDate(paymentDetails.updatedAt)
                  : "Not available"}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-700 flex-shrink-0">Payment ID:</span>
              <div className="text-right flex-1 ml-4">
                <span className="font-semibold text-gray-900 break-words text-sm">
                  {paymentDetails
                    ? formatPaymentId(paymentDetails.paymentId)
                    : "Not available"}
                </span>
                {paymentDetails?.paymentId &&
                  paymentDetails.paymentId.length > 20 && (
                    <div
                      className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 mt-1"
                      title={paymentDetails.paymentId}
                      onClick={() =>
                        navigator.clipboard?.writeText(paymentDetails.paymentId)
                      }
                    >
                      Click to copy full ID
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Return Button */}
        <Link
          to={`${UserUrls.mentorProfile}/${paymentDetails?.mentorId}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Start chating
        </Link>

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

export default BookingSuccess;
