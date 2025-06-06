import { ArrowLeft, Phone, Video } from "lucide-react";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import { Icontacts } from "@/pages/chat";

interface ChatHeaderProps {
  activeChat: Icontacts | null;
  onlineUsers: Set<string>;
  setActiveChat: (activeChat: Icontacts | null) => void;
  setShowSidebar: (value: boolean) => void;
  profileImage: string;
}

export function ChatHeader({
  activeChat,
  onlineUsers,
  setActiveChat,
  setShowSidebar,
  profileImage,
}: ChatHeaderProps) {
  const handleBackButton = () => {
    setShowSidebar(true);
    setActiveChat(null);
  };

  return (
    <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 sticky top-0 z-10">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={handleBackButton}
          className="md:hidden text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 p-1"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative flex-shrink-0">
          <img
            src={typeof profileImage === "string" ? profileImage : dummyProfileImage}
            alt="Contact profile"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
          <div
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
              onlineUsers.has(activeChat?.participantDetails[0]._id as string)
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
          ></div>
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-[180px] md:max-w-[250px]">
            {activeChat?.participantDetails[0].name}
          </h2>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
            { onlineUsers.has(activeChat?.participantDetails[0]._id as string) ? "Online" : "Offline"}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-colors hidden sm:flex">
          <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-colors hidden sm:flex">
          <Video className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}