import React, { useState, useEffect } from "react";
import { X, Sparkles, ExternalLink } from "lucide-react";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { useFetchRandomAdvMutation } from "@/services/apis/CommonApis";

// Type definitions
interface Ad {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
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
    description:
      "Discover amazing mentorship opportunities and connect with expert mentors. Upgrade to premium for an ad-free experience!",
    link: "#",
  };

  // Check subscription status on mount
  useEffect(() => {
    // Don't show ads for admin users
    if (user?.role === "admin") {
      setHasSubscription(true);
      setIsChecking(false);
      return;
    }
    checkSubscriptionStatus();
  }, [user?.id, user?.role]);

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

    // Don't show ads for admin users
    if (user.role === "admin") {
      setHasSubscription(true);
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
        const hasValidData =
          response.data.id && response.data.image && response.data.title;

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

  const handleRedirect = (): void => {
    if (!currentAd?.link || currentAd.link === "#") {
      closeModal();
      return;
    }

    try {
      // Validate URL before opening
      const url = new URL(currentAd.link);
      if (url.protocol === "http:" || url.protocol === "https:") {
        // Open in new tab for security
        window.open(currentAd.link, "_blank", "noopener,noreferrer");
        closeModal();
      } else {
        console.error("Invalid URL protocol");
        closeModal();
      }
    } catch (error) {
      console.error("Invalid URL:", error);
      closeModal();
    }
  };

  const handleImageClick = (): void => {
    // Also allow clicking the image to redirect
    if (!isDefaultAd) {
      handleRedirect();
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

  const isDefaultAd = currentAd.id === "default";
  const hasValidLink = currentAd.link && currentAd.link !== "#";

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 rounded-3xl max-w-lg w-full relative shadow-2xl transform transition-all duration-500 animate-in zoom-in-95 slide-in-from-bottom-4 border border-gray-200 dark:border-zinc-700">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute -top-4 -right-4 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full p-3 shadow-xl transition-all duration-200 hover:scale-110 hover:rotate-90 z-20 group"
          aria-label="Close advertisement"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Ad indicator badge */}
        {!isDefaultAd && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>SPONSORED</span>
            </div>
          </div>
        )}

        {/* Ad Content */}
        <div className="relative p-8">
          {/* Ad Image Container */}
          <div
            className={`relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 shadow-inner ${
              !isDefaultAd && hasValidLink
                ? "cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                : ""
            }`}
            onClick={handleImageClick}
          >
            <div className="aspect-video flex items-center justify-center p-6">
              <img
                src={currentAd.image}
                alt={currentAd.title}
                className="w-full h-full object-contain max-h-64 rounded-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = brandLogo || "/path/to/fallback-image.png";
                }}
              />
            </div>
            {/* Image overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            
            {/* Click hint overlay on hover */}
            {!isDefaultAd && hasValidLink && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="bg-white/90 dark:bg-zinc-900/90 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-semibold">Click to visit</span>
                </div>
              </div>
            )}
          </div>

          {/* Ad Title */}
          <h3 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            {currentAd.title || "Special Offer"}
          </h3>

          {/* Ad Description */}
          <p className="text-base text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {currentAd.description || "Check out this amazing opportunity!"}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {!isDefaultAd && hasValidLink ? (
              <>
                {/* Visit Link Button */}
                <button
                  onClick={handleRedirect}
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Visit Link
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </span>
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>

            
              </>
            ) : (
              /* Continue Button (for default ad or no link) */
              <button
                onClick={closeModal}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Continue
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdPopup;