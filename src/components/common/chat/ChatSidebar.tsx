import { Search } from "lucide-react";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import { Icontacts } from "@/pages/chat";
import { IUserDB } from "@/@types/interface/IDataBase";

interface ChatSidebarProps {
  showSidebar: boolean;
  onlineUsers: Set<string>;
  contacts: Icontacts[];
  activeChat: Icontacts | null;
  handleChatSelect: (contact: Icontacts) => void;
  myProfile: string;
  profileImage: string[];
  user: IUserDB | null;
}

export function ChatSidebar({
  showSidebar,
  onlineUsers,
  contacts,
  activeChat,
  handleChatSelect,
  myProfile,
  profileImage,
  user,
}: ChatSidebarProps) {
  const formatMessageTime = (timestamp: string | number | Date) => {
    const messageDate = new Date(timestamp);
    const today = new Date();

    // Check if the message is from today
    const isToday = messageDate.toDateString() === today.toDateString();

    if (isToday) {
      // Show time if today
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // Show date if not today
      return messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div
      className={`flex flex-col h-full w-full sm:w-64 lg:w-80 bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 fixed md:static z-20 transition-transform duration-300 ${
        showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="p-3 sm:p-4 border-b dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img
              src={myProfile || dummyProfileImage}
              alt="Your Profile"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
                {user?.name}
              </h2>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 border-b dark:border-zinc-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:border-zinc-700 dark:focus:border-zinc-600"
          />
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-zinc-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
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
              className={`flex items-center p-3 sm:p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition ${
                activeChat?.id === contact.id
                  ? "bg-blue-50 dark:bg-zinc-800"
                  : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={
                    typeof profileImage[i] == "string"
                      ? profileImage[i]
                      : dummyProfileImage
                  }
                  alt={contact.participants[0].name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                <div
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                    onlineUsers.has(contact.participants[0].id)
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                ></div>
              </div>
              <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate mb-1">
                      {contact.participants[0].name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                      {contact.lastMessage ? (
                        contact.lastMessage.contentType === "text" ? (
                          typeof contact.lastMessage.content === "string" ? (
                            contact.lastMessage.content
                          ) : (
                            "[Unsupported content]"
                          )
                        ) : (
                          <span className="flex items-center gap-1">
                            {contact.lastMessage.contentType === "image" && (
                              <>
                                <span role="img" aria-label="Image">
                                  📷
                                </span>
                                Image
                              </>
                            )}
                            {contact.lastMessage.contentType === "audio" && (
                              <>
                                <span role="img" aria-label="Audio">
                                  🎵
                                </span>
                                Audio
                              </>
                            )}
                            {contact.lastMessage.contentType === "document" && (
                              <>
                                <span role="img" aria-label="Document">
                                  📄
                                </span>
                                Document
                              </>
                            )}
                            {!["image", "audio", "doc"].includes(
                              contact.lastMessage.contentType
                            ) && (
                              <>
                                <span role="img" aria-label="File">
                                  📎
                                </span>
                                {contact.lastMessage.contentType}
                              </>
                            )}
                          </span>
                        )
                      ) : (
                        "No messages yet"
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                    {contact.lastMessage?.createdAt && (
                      <span className="text-xs text-gray-500 dark:text-zinc-400">
                        {formatMessageTime(contact.lastMessage.createdAt)}
                      </span>
                    )}
                    {(contact.unreadCount ?? 0) > 0 && (
                      <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded-full text-xs min-w-[18px] text-center">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
