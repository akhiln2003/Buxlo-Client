import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { useFetchRandomAdvMutation } from "@/services/apis/CommonApis";

// Type definitions
interface Ad {
  id: string;
  image: string;
  title: string;
  description: string;
}

interface User {
  id: string;
  role: string;
  premiumId?: string | boolean;
}

interface ProfileResponse {
  data?: {
    data?: {
      premiumId?: string | boolean;
    };
  };
}

interface AdPopupProps {
  fetchUserProfileData: (id: string) => Promise<ProfileResponse>;
  fetchMentorProfileData: (id: string) => Promise<ProfileResponse>;
  user?: User | null;
}

const AdPopup: React.FC<AdPopupProps> = ({
  fetchUserProfileData,
  fetchMentorProfileData,
  user,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [fetchAdv] = useFetchRandomAdvMutation();

  // Check subscription status on mount
  useEffect(() => {
    checkSubscriptionStatus();
  }, [user?.id]);

  // Setup ad intervals after subscription check
  useEffect(() => {
    if (!isChecking && !hasSubscription && user?.id) {
      // Show first ad after 2 seconds
      const initialTimeout = setTimeout(() => {
        fetchAndShowAd();
      }, 2000);

      // Then show ad every 5 minutes
      const adInterval = setInterval(() => {
        fetchAndShowAd();
      }, 300000); // 5 minutes = 300000 milliseconds

      return () => {
        clearTimeout(initialTimeout);
        clearInterval(adInterval);
      };
    }
  }, [isChecking, hasSubscription, user?.id]);

  const checkSubscriptionStatus = async (): Promise<void> => {
    if (!user?.id) {
      setIsChecking(false);
      return;
    }

    try {
      let response: ProfileResponse;

      // Check user role and call appropriate API
      if (user.role === "user") {
        response = await fetchUserProfileData(user.id);
      } else if (user.role === "mentor") {
        response = await fetchMentorProfileData(user.id);
      } else {
        setIsChecking(false);
        return;
      }

      if (response?.data?.data) {
        // Check if user has premiumId
        const hasPremium = !!response.data.data.premiumId;
        setHasSubscription(hasPremium);
      } else {
        setHasSubscription(false);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setHasSubscription(false);
    } finally {
      setIsChecking(false);
    }
  };

  const fetchAndShowAd = async (): Promise<void> => {
    // Don't show ads if user has subscription
    if (hasSubscription) return;

    try {
      const response: IAxiosResponse = await fetchAdv({});

      if (response.data) {
        setCurrentAd(response.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching ad:", error);
    }
  };

  const closeModal = (): void => {
    setShowModal(false);
  };

  const handleAdClick = (): void => {
    if (currentAd) {
      // Track ad click if needed
      // fetch('/api/ads/track-click', {
      //   method: 'POST',
      //   body: JSON.stringify({ adId: currentAd.id })
      // });
      closeModal();
    }
  };

  // Don't render anything if:
  // - Still checking subscription status
  // - User has subscription
  // - Modal is not shown
  // - No ad available
  if (isChecking || hasSubscription || !showModal || !currentAd) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-lg w-full relative shadow-2xl transform transition-all duration-300 scale-100">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full p-2 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Ad Content */}
        <div className="p-6">
          <img
            src={currentAd.image}
            alt={currentAd.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            {currentAd.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {currentAd.description}
          </p>

          <button
            onClick={handleAdClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdPopup;
