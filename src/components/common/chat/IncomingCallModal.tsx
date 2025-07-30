import { Phone, PhoneOff } from "lucide-react";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";

interface IncomingCallModalProps {
  name: string;
  avatar: string;
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingCallModal = ({
  name,
  avatar,
  onAccept,
  onReject,
}: IncomingCallModalProps) => {
  const getAvatarUrl = () => {
    if (avatar && avatar.trim()) {
      return avatar;
    }
    return dummyProfileImage;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl text-center w-80 p-6">
        {/* Caller Avatar */}
        <div className="relative mb-6">
          <img
            src={getAvatarUrl()}
            className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-gray-200 dark:border-zinc-700"
            alt="Caller Avatar"
          />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-green-500 rounded-full p-2 animate-pulse">
              <Phone className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Caller Info */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Incoming video call...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6">
          {/* Reject Button */}
          <button
            onClick={onReject}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-colors duration-200 shadow-lg"
            aria-label="Reject call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Accept Button */}
          <button
            onClick={onAccept}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition-colors duration-200 shadow-lg animate-pulse"
            aria-label="Accept call"
          >
            <Phone className="w-6 h-6" />
          </button>
        </div>

        {/* Background Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
