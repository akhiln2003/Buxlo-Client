import { Search } from "lucide-react";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import { Icontacts } from "@/pages/chat";
import { Iuser } from "@/@types/interface/Iuser";

interface ChatSidebarProps {
  showSidebar: boolean;
  contacts: Icontacts[];
  activeChat: Icontacts | null;
  handleChatSelect: (contact: Icontacts) => void;
  myProfile: string;
  profileImage: string[];
  user: Iuser | null;
}

export function ChatSidebar({
  showSidebar,
  contacts,
  activeChat,
  handleChatSelect,
  myProfile,
  profileImage,
  user,
}: ChatSidebarProps) {
  return (
    <div
      className={`${
        showSidebar ? "flex" : "hidden"
      } md:flex flex-col h-full w-full md:w-80 lg:w-96 bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 absolute md:relative z-20 transition-all duration-300`}
    >
      <div className="p-3 md:p-4 border-b dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <img
              src={myProfile || dummyProfileImage}
              alt="Your Profile"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate max-w-[200px]">
                {user?.name}
              </h2>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-4 border-b dark:border-zinc-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:border-zinc-700 dark:focus:border-zinc-600"
          />
          <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-500 dark:text-zinc-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="text-gray-500 dark:text-zinc-400 mb-2">
              No conversations yet
            </div>
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Start a new conversation or wait for messages
            </p>
          </div>
        ) : (
          contacts.map((contact, i) => (                                                                                                                                                    
            <div
              key={contact.id}
              onClick={() => handleChatSelect(contact)}
              className={`flex items-center p-3 md:p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition ${
                activeChat?.id === contact.id ? "bg-blue-50 dark:bg-zinc-800" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={typeof profileImage[i] == 'string' ? profileImage[i] : dummyProfileImage}
                  alt={contact.participantDetails[0].name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                />
                <div
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                    contact.participantDetails[0].status
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                ></div>
              </div>
              <div className="ml-3 md:ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-xs md:text-sm text-gray-900 dark:text-white truncate max-w-[70%]">
                    {contact.participantDetails[0].name}
                  </h3>
                  {(contact.unreadCount ?? 0) > 0 && (
                    <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded-full text-xs ml-1 flex-shrink-0">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-zinc-400 truncate mt-0.5">
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}