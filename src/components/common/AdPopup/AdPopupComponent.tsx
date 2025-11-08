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
  brandLogo?: string;
}

const AdPopup: React.FC<AdPopupProps> = ({
  fetchUserProfileData,
  fetchMentorProfileData,
  user,
  brandLogo,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [fetchAdv] = useFetchRandomAdvMutation();

  // Default/dummy ad data for when no ads are available
  const dummyAd: Ad = {
    id: "default",
    image: brandLogo || "/path/to/your/brand-logo.png",
    title: "Welcome to BUXLO",
    description: "Discover amazing mentorship opportunities and connect with expert mentors. Upgrade to premium for an ad-free experience!",
  };

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
        // Check if the response has valid data (not empty strings)
        const hasValidData = response.data.id && response.data.image && response.data.title;
        
        if (hasValidData) {
          setCurrentAd(response.data);
        } else {
          // Use dummy ad if no valid ad data
          setCurrentAd(dummyAd);
        }
        setShowModal(true);
      } else {
        // Use dummy ad if response failed
        setCurrentAd(dummyAd);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching ad:", error);
      // Use dummy ad on error
      setCurrentAd(dummyAd);
      setShowModal(true);
    }
  };

  const closeModal = (): void => {
    setShowModal(false);
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
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        // Prevent closing when clicking the modal content
        if (e.target === e.currentTarget) {
          return;
        }
      }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full relative shadow-2xl transform transition-all duration-300 animate-in fade-in zoom-in">
        {/* Close Button - Only way to close */}
        <button
          onClick={closeModal}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
          aria-label="Close advertisement"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ad Content */}
        <div className="p-6">
          {/* Ad Image */}
          <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800">
            <img
              src={currentAd.image}
              alt={currentAd.title}
              className="w-full h-56 object-contain"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = brandLogo || "/path/to/fallback-image.png";
              }}
            />
          </div>

          {/* Ad Title */}
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
            {currentAd.title || "Special Offer"}
          </h3>

          {/* Ad Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {currentAd.description || "Check out this amazing opportunity!"}
          </p>

          {/* Close Button (Secondary) */}
          <button
            onClick={closeModal}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>

        {/* Optional: Ad indicator */}
        {currentAd.id !== "default" && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
            AD
          </div>
        )}
      </div>
    </div>
  );
};

export default AdPopup;