import { useEffect, useRef, useState } from "react";
import { InewMessage } from "@/pages/chat";
import {
  Image,
  FileText,
  Video,
  Mic,
  Check,
  CheckCheck,
  Clock,
  Download,
  Reply,
  Trash,
  X,
  ChevronDown,
} from "lucide-react";
import { useFetchMessageFromS3Mutation } from "@/services/apis/CommonApis";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";

export function ChatMessages({
  messages,
  userId,
  onReply,
  onDelete,
}: {
  messages: InewMessage[];
  userId: string;
  onReply?: (message: InewMessage) => void;
  onDelete?: (message: InewMessage, deleteFor: "me" | "everyone") => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showTimeForMessage, setShowTimeForMessage] = useState<string | null>(null);
  const [fetchMessageFromS3] = useFetchMessageFromS3Mutation();

  const [mediaContent, setMediaContent] = useState<Record<string, string>>({});
  const [loadingMedia, setLoadingMedia] = useState<Record<string, boolean>>({});
  
  // New states for dropdown and delete modal
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [messageToDelete, setMessageToDelete] = useState<InewMessage | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.message-dropdown')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups: Record<string, InewMessage[]>, message) => {
      const date = new Date().toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {}
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch media content from S3
  const handleFetchMedia = async (message: InewMessage, messageId: string) => {
    if (mediaContent[messageId] || loadingMedia[messageId]) return;

    try {
      setLoadingMedia((prev) => ({ ...prev, [messageId]: true }));

      // The API expects an array of keys
      const response: IaxiosResponse = await fetchMessageFromS3([
        message.content as string,
      ]);

      if (
        response.data &&
        response.data.imageUrl &&
        response.data.imageUrl.length > 0
      ) {
        setMediaContent((prev) => ({
          ...prev,
          [messageId]: response.data.imageUrl[0],
        }));
      } else {
        errorTost(
          "Failed to load media",
          response.error?.data?.error || [
            { message: "Could not retrieve media content" },
          ]
        );
      }
    } catch (err) {
      console.error("Error fetching media:", err);
      errorTost("Error loading media", [{ message: "Please try again" }]);
    } finally {
      setLoadingMedia((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  // Handle reply to message
  const handleReply = (message: InewMessage) => {
    if (onReply) {
      onReply(message);
    }
    setOpenDropdown(null);
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (message: InewMessage) => {
    setMessageToDelete(message);
    setDeleteModalOpen(true);
    setOpenDropdown(null);
  };

  // Handle delete action
  const handleDelete = (deleteFor: "me" | "everyone") => {
    if (onDelete && messageToDelete) {
      onDelete(messageToDelete, deleteFor);
    }
    setDeleteModalOpen(false);
    setMessageToDelete(null);
  };

  // Toggle dropdown menu
  const toggleDropdown = (e: React.MouseEvent, messageId: string) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === messageId ? null : messageId);
  };

  // Get content icon based on message type
  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case "image":
        return <Image size={18} />;
      case "document":
        return <FileText size={18} />;
      case "video":
        return <Video size={18} />;
      case "audio":
        return <Mic size={18} />;
      default:
        return null;
    }
  };

  // Render media content based on type
  const renderMediaContent = (message: InewMessage, messageId: string) => {
    const url = mediaContent[messageId];
    const isLoading = loadingMedia[messageId];

    if (!url && !isLoading) {
      return (
        <div
          className="flex items-center gap-2 py-1 cursor-pointer hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            handleFetchMedia(message, messageId);
          }}
        >
          {getContentIcon(message.contentType)}
          <span>
            {message.contentType.charAt(0).toUpperCase() +
              message.contentType.slice(1)}
          </span>
          <Download size={16} />
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center gap-2 py-1">
          {getContentIcon(message.contentType)}
          <span>Loading {message.contentType}...</span>
        </div>
      );
    }

    switch (message.contentType) {
      case "image":
        return (
          <div className="max-w-full">
            <img
              src={url}
              alt="Image message"
              className="max-w-full rounded-md object-contain max-h-60"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        );
      case "audio":
        return (
          <audio
            controls
            src={url}
            className="max-w-full w-full"
            onClick={(e) => e.stopPropagation()}
          />
        );
      case "video":
        return (
          <video
            controls
            src={url}
            className="max-w-full rounded-md max-h-60"
            onClick={(e) => e.stopPropagation()}
          />
        );
      case "document":
        return (
          <div className="flex items-center gap-2">
            <FileText size={18} />
            <a
              href={url}
              download
              className="text-blue-400 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Download document
            </a>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            {getContentIcon(message.contentType)}
            <a
              href={url}
              download
              className="text-blue-400 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Download attachment
            </a>
          </div>
        );
    }
  };

  // Render message status indicator
  const renderMessageStatus = (message: InewMessage) => {
    switch (message.status) {
      case "sent":
        return <Check size={12} />;
      case "delivered":
        return <CheckCheck size={12} />;
      case "read":
        return <CheckCheck size={12} className="text-green-400" />;
      default:
        return <Clock size={12} />; // For pending/sending messages
    }
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-zinc-900 flex flex-col items-center justify-center">
        <p className="text-gray-500 dark:text-zinc-400 text-lg font-medium">
          No messages yet
        </p>
        <p className="text-gray-400 dark:text-zinc-500 text-sm mt-2 text-center max-w-xs">
          Start the conversation by sending a message below
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 bg-gray-50 dark:bg-zinc-900">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className="space-y-3">
            <div className="flex justify-center">
              <div className="bg-gray-200 dark:bg-zinc-800 rounded-full px-3 py-1 text-xs text-gray-600 dark:text-zinc-400">
                {date === new Date().toLocaleDateString() ? "Today" : date}
              </div>
            </div>

            {groupedMessages[date].map((message: InewMessage, index: number) => {
              const isCurrentUser = message.senderId === userId;
              const messageId = `msg-${message.senderId}-${index}`;
              const isShowingTime = showTimeForMessage === messageId;
              const showTail =
                index === 0 ||
                groupedMessages[date][index - 1]?.senderId !== message.senderId;

              return (
                <div key={index} className="space-y-1">
                  {/* Show sender name for first message in a group */}
                  {showTail && !isCurrentUser && (
                    <div className="ml-12 text-xs font-medium text-gray-500 dark:text-zinc-500">
                      {message.senderId === message.receiverId ? "You" : "Sender"}
                    </div>
                  )}

                  <div
                    className={`flex items-end gap-2 ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Avatar for first message in sender's group */}
                    {!isCurrentUser && showTail && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-zinc-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <span className="text-xs font-medium text-gray-600 dark:text-zinc-300">
                          {message.senderId.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Message bubble with options */}
                    <div className="relative max-w-[70%] md:max-w-xl group">
                      {/* Message dropdown button - Always at the left top regardless of who sent the message */}
                      <button
                        onClick={(e) => toggleDropdown(e, messageId)}
                        className={`
                          absolute -left-6 top-2
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200
                          hover:text-gray-900 dark:hover:text-white
                          flex items-center justify-center z-10
                          focus:outline-none
                          text-gray-500 dark:text-gray-400
                          message-dropdown
                        `}
                        aria-label="Message actions"
                      >
                        <ChevronDown size={16} />
                      </button>

                      {/* Message bubble */}
                      <div
                        onClick={() =>
                          setShowTimeForMessage(isShowingTime ? null : messageId)
                        }
                        className={`
                          relative
                          px-3 md:px-4 py-2 md:py-3 
                          rounded-lg text-sm
                          transition-all duration-200 hover:shadow-md
                          cursor-pointer
                          ${
                            isCurrentUser
                              ? "bg-green-500 text-white rounded-br-none hover:bg-green-600"
                              : "bg-zinc-200 dark:bg-zinc-800 text-gray-800 dark:text-white rounded-bl-none"
                          }
                        `}
                      >
                        {message.contentType === "text" ? (
                          <p className="whitespace-pre-wrap break-words">
                            {message.content as string}
                          </p>
                        ) : (
                          renderMediaContent(message, messageId)
                        )}

                        {/* Time display */}
                        <div
                          className={`
                            flex items-center gap-2 justify-between mt-1
                            text-[10px] md:text-xs
                            ${
                              isCurrentUser
                                ? "text-blue-100"
                                : "text-gray-500 dark:text-zinc-400"
                            }
                          `}
                        >
                          {/* Always show time */}
                          <span className="text-[10px] opacity-75">
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          {/* Message status (for sent messages) */}
                          {isCurrentUser && (
                            <span className="ml-1">
                              {renderMessageStatus(message)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dropdown menu - Positioned at the bottom of the message */}
                      {openDropdown === messageId && (
                        <div 
                          ref={dropdownRef}
                          className={`
                            absolute z-50
                            w-36 rounded-md shadow-lg
                            bg-white dark:bg-zinc-800
                            ring-1 ring-black ring-opacity-5
                            divide-y divide-gray-100 dark:divide-zinc-700
                            message-dropdown
                            ${isCurrentUser ? 'right-0' : 'left-0'}
                            mt-2 top-full
                          `}
                        >
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button
                              onClick={() => handleReply(message)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                              role="menuitem"
                            >
                              <Reply size={16} className="mr-2" />
                              Reply
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(message)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-700"
                              role="menuitem"
                            >
                              <Trash size={16} className="mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Delete Message
              </h3>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
              Are you sure you want to delete this message?
            </p>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 
                  bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm 
                  hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              
              <button
                onClick={() => handleDelete("me")}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white 
                  bg-red-600 border border-transparent rounded-md shadow-sm 
                  hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete for me
              </button>
              
              {messageToDelete.senderId === userId && (
                <button
                  onClick={() => handleDelete("everyone")}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white 
                    bg-red-800 border border-transparent rounded-md shadow-sm 
                    hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete for everyone
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}