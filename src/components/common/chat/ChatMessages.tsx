import { useEffect, useRef, useState } from "react";
import { InewMessage } from "./Chat";
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [messageToDelete, setMessageToDelete] = useState<InewMessage | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest(".message-dropdown")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  const handleFetchMedia = async (message: InewMessage, messageId: string) => {
    if (mediaContent[messageId] || loadingMedia[messageId]) return;
    try {
      setLoadingMedia((prev) => ({ ...prev, [messageId]: true }));
      const response: IaxiosResponse = await fetchMessageFromS3([message.content as string]);
      if (response.data && response.data.imageUrl && response.data.imageUrl.length > 0) {
        setMediaContent((prev) => ({ ...prev, [messageId]: response.data.imageUrl[0] }));
      } else {
        errorTost("Failed to load media", response.error?.data?.error || [{ message: "Could not retrieve media content" }]);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
      errorTost("Error loading media", [{ message: "Please try again" }]);
    } finally {
      setLoadingMedia((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const handleReply = (message: InewMessage) => {
    if (onReply) {
      onReply(message);
    }
    setOpenDropdown(null);
  };

  const handleOpenDeleteModal = (message: InewMessage) => {
    setMessageToDelete(message);
    setDeleteModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDelete = (deleteFor: "me" | "everyone") => {
    if (onDelete && messageToDelete) {
      onDelete(messageToDelete, deleteFor);
    }
    setDeleteModalOpen(false);
    setMessageToDelete(null);
  };

  const toggleDropdown = (e: React.MouseEvent, messageId: string) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === messageId ? null : messageId);
  };

  const getFileName = (url: string) => {
    return url.split("/").pop() || "Document";
  };

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case "image":
        return <Image size={16} />;
      case "document":
        return <FileText size={16} />;
      case "video":
        return <Video size={16} />;
      case "audio":
        return <Mic size={16} />;
      default:
        return null;
    }
  };

  const renderMediaContent = (message: InewMessage, messageId: string) => {
    const url = mediaContent[messageId];
    const isLoading = loadingMedia[messageId];
    const fileName = getFileName(message.content as string);

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
          <span className="text-xs sm:text-sm">
            {message.contentType.charAt(0).toUpperCase() + message.contentType.slice(1)}
          </span>
          <Download size={16} className="text-blue-500" />
        </div>
      );
    }
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 py-1">
          {getContentIcon(message.contentType)}
          <span className="text-xs sm:text-sm">Loading {message.contentType}...</span>
        </div>
      );
    }

    switch (message.contentType) {
      case "image":
        return (
          <div className="max-w-[150px] sm:max-w-[200px]">
            <img
              src={url}
              alt="Image message"
              className="max-w-full rounded-lg object-contain shadow-sm cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                window.open(url, "_blank");
              }}
            />
            <button
              className="flex items-center gap-1 mt-1 text-xs text-blue-400 hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(url, fileName);
              }}
            >
              <Download size={14} />
              Download
            </button>
          </div>
        );
      case "video":
        return (
          <div className="max-w-[150px] sm:max-w-[200px]">
            <div
              className="relative rounded-lg cursor-pointer shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(url, "_blank");
              }}
            >
              <video src={url} className="max-w-full rounded-lg" muted poster={url} />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="9 6 9 18 18 12" />
                </svg>
              </div>
            </div>
            <button
              className="flex items-center gap-1 mt-1 text-xs text-blue-400 hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(url, fileName);
              }}
            >
              <Download size={14} />
              Download
            </button>
          </div>
        );
      case "audio":
        return (
          <div className="flex items-center space-x-2 w-full max-w-[150px] sm:max-w-[200px]">
            <button
              className="p-1.5 bg-blue-600 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                window.open(url, "_blank");
              }}
            >
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="9 6 9 18 18 12" />
              </svg>
            </button>
            <div className="flex-1 h-1.5 bg-gray-300 dark:bg-zinc-600 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-blue-500"></div>
            </div>
            <span className="text-xs text-gray-500 dark:text-zinc-400">0:30</span>
            <button
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(url, fileName);
              }}
            >
              <Download size={14} />
            </button>
          </div>
        );
      case "document":
        return (
          <div className="flex items-center space-x-2 max-w-[150px] sm:max-w-[200px]">
            <FileText size={18} className="text-gray-500 dark:text-zinc-400" />
            <span className="text-xs sm:text-sm truncate text-gray-700 dark:text-zinc-300">
              {fileName}
            </span>
            <button
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(url, fileName);
              }}
            >
              <Download size={14} />
            </button>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            {getContentIcon(message.contentType)}
            <button
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(url, fileName);
              }}
            >
              <Download size={14} />
              Download attachment
            </button>
          </div>
        );
    }
  };

  const renderMessageStatus = (message: InewMessage) => {
    switch (message.status) {
      case "sent":
        return <Check size={12} />;
      case "delivered":
        return <CheckCheck size={12} />;
      case "read":
        return <CheckCheck size={12} className="text-green-400" />;
      default:
        return <Clock size={12} />;
    }
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 p-3 sm:p-4 bg-gray-50 dark:bg-zinc-900 flex flex-col items-center justify-center">
        <p className="text-gray-500 dark:text-zinc-400 text-base sm:text-lg font-medium">
          No messages yet
        </p>
        <p className="text-gray-400 dark:text-zinc-500 text-xs sm:text-sm mt-2 text-center max-w-xs">
          Start the conversation by sending a message below
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-3 sm:p-4 bg-gray-50 dark:bg-zinc-900">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className="space-y-2">
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
                    {!isCurrentUser && showTail && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-zinc-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <span className="text-xs font-medium text-gray-600 dark:text-zinc-300">
                          {message.senderId.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="relative max-w-[90%] sm:max-w-[70%] md:max-w-lg group">
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
                      <div
                        onClick={() =>
                          setShowTimeForMessage(isShowingTime ? null : messageId)
                        }
                        className={`
                          relative
                          px-3 sm:px-4 py-2 sm:py-3 
                          rounded-lg text-sm
                          transition-all duration-200 hover:shadow-md
                          cursor-pointer
                          ${
                            isCurrentUser
                              ? "bg-blue-500 text-white rounded-br-none hover:bg-blue-600"
                              : "bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white rounded-bl-none"
                          }
                        `}
                      >
                        {message.contentType === "text" ? (
                          <p className="whitespace-pre-wrap break-words text-xs sm:text-sm">
                            {message.content as string}
                          </p>
                        ) : (
                          renderMediaContent(message, messageId)
                        )}
                        <div
                          className={`
                            flex items-center gap-2 justify-between mt-1
                            text-[10px] sm:text-xs
                            ${
                              isCurrentUser
                                ? "text-blue-100"
                                : "text-gray-500 dark:text-zinc-400"
                            }
                          `}
                        >
                          <span className="text-[10px] opacity-75">
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isCurrentUser && (
                            <span className="ml-1">
                              {renderMessageStatus(message)}
                            </span>
                          )}
                        </div>
                      </div>
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
                            ${isCurrentUser ? "right-0" : "left-0"}
                            mt-2 top-full
                          `}
                        >
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button
                              onClick={() => handleReply(message)}
                              className="flex items-center w-full px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                              role="menuitem"
                            >
                              <Reply size={16} className="mr-2" />
                              Reply
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(message)}
                              className="flex items-center w-full px-4 py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-700"
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
      {deleteModalOpen && messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md mx-4 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                Delete Message
              </h3>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mb-4">
              Are you sure you want to delete this message?
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="inline-flex justify-center px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-zinc-300 
                  bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm 
                  hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete("me")}
                className="inline-flex justify-center px-4 py-2 text-xs sm:text-sm font-medium text-white 
                  bg-red-600 border border-transparent rounded-md shadow-sm 
                  hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete for me
              </button>
              {messageToDelete.senderId === userId && (
                <button
                  onClick={() => handleDelete("everyone")}
                  className="inline-flex justify-center px-4 py-2 text-xs sm:text-sm font-medium text-white 
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