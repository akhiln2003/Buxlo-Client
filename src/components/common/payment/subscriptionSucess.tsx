import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { UserUrls } from "@/@types/urlEnums/UserUrls";

const subscriptionSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full border-4 border-green-500 mb-8">
          <Check className="w-8 h-8 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Subscription Successful!
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-12">
          Thank you for subscribing! Your payment has been processed successfully.
        </p>

        {/* Success Message */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome to Premium!
            </h2>
            <p className="text-gray-600">
              Your subscription is now active. Enjoy all the premium features and benefits.
            </p>
          </div>
        </div>

        {/* Return Home Button */}
        <Link
          to={UserUrls.home}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-block"
        >
          Go to Home
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

export default subscriptionSuccess;