import { useRef, useEffect, useState, useContext } from "react";
import { format, isToday } from "date-fns";
import {
  CheckCheck,
  Check,
  Clock,
  Video,
  Image,
  File,
  Mic,
  Play,
  Pause,
} from "lucide-react";
import { useFetchMessageFromS3Mutation } from "@/services/apis/CommonApis";
import { errorTost } from "@/components/ui/tosastMessage";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { SocketContext } from "@/contexts/socketContext";
import { InewMessage } from "@/pages/chat";

interface ChatMessagesProps {
  messages: InewMessage[];
  setMessages: React.Dispatch<React.SetStateAction<InewMessage[]>>;
  userId: string;
  receiverId: string;
}

// Audio Message Component
export const AudioMessage = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedData = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadeddata", handleLoadedData);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadeddata", handleLoadedData);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg w-full">
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
      <button
        onClick={togglePlayPause}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-white mr-3 flex-shrink-0"
      >
        {isLoaded ? (
          isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </button>
      <div className="flex-1 flex flex-col">
        <div className="relative h-1 w-full bg-gray-300 dark:bg-zinc-600 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{isLoaded ? formatTime(duration) : "--:--"}</span>
        </div>
      </div>
    </div>
  );
};

// Message Status Component
export const MessageStatus = ({ status }: { status: string }) => {
  switch (status) {
    case "read":
      return <CheckCheck className="h-4 w-4 text-blue-500" />;
    case "delivered":
      return <CheckCheck className="h-4 w-4 text-gray-400" />;
    case "received":
    case "sent":
      return <Check className="h-4 w-4 text-gray-400" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

// Media Content Component
export const MediaContent = ({
  message,
  mediaUrl,
}: {
  message: InewMessage;
  mediaUrl: string | null;
}) => {
  if (!mediaUrl) {
    const icons = {
      image: <Image className="h-6 w-6 text-gray-500" />,
      video: <Video className="h-6 w-6 text-gray-500" />,
      audio: <Mic className="h-6 w-6 text-gray-500" />,
      document: <File className="h-6 w-6 text-gray-500" />,
    };

    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg">
        {icons[message.contentType as keyof typeof icons]}
        <span className="ml-2 text-sm text-gray-500">
          Loading {message.contentType}...
        </span>
      </div>
    );
  }

  switch (message.contentType) {
    case "image":
      return (
        <img
          src={mediaUrl}
          alt="Image"
          className="rounded-lg max-h-72 max-w-full object-contain cursor-pointer"
        />
      );
    case "video":
      return (
        <video
          src={mediaUrl}
          controls
          className="rounded-lg max-h-72 max-w-full"
        />
      );
    case "audio":
      return <AudioMessage src={mediaUrl} />;
    case "document":
      return (
        <div className="flex items-center justify-between bg-gray-100 dark:bg-zinc-800 p-3 rounded-lg">
          <div className="flex items-center">
            <File className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-sm font-medium truncate max-w-xs">
              {message.content.split("/").pop() || "Document"}
            </span>
          </div>
          <a
            href={mediaUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-xs"
          >
            Download
          </a>
        </div>
      );
    default:
      return <div>Unsupported media type</div>;
  }
};

// Message Component
export const Message = ({
  message,
  isMine,
  mediaUrls,
}: {
  message: InewMessage;
  isMine: boolean;
  mediaUrls: Record<string, string>;
}) => {
  const formatMessageDate = (timestamp: string | number | Date) => {
    try {
      return format(new Date(timestamp), "h:mm a");
    } catch {
      return "";
    }
  };

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg relative px-3 py-2 rounded-lg shadow-sm ${
          isMine
            ? "bg-emerald-100 dark:bg-emerald-900 text-gray-800 dark:text-gray-100 rounded-tr-none"
            : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-tl-none"
        }`}
      >
        {message.deleted === "everyone" ? (
          <div className="italic text-gray-500 text-sm">
            This message was deleted
          </div>
        ) : message.contentType === "text" ? (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        ) : (
          <MediaContent
            message={message}
            mediaUrl={message.id ? mediaUrls[message.id] : null}
          />
        )}
        <div className="flex items-center justify-end mt-1 space-x-1 text-gray-500 text-xs">
          <span>{formatMessageDate(message.createdAt)}</span>
          {isMine && <MessageStatus status={message.status} />}
        </div>
        <div
          className={`absolute top-0 ${
            isMine ? "right-0 -mr-2" : "left-0 -ml-2"
          }`}
          style={{
            width: 0,
            height: 0,
            borderTop: isMine ? "8px solid #d1fae5" : "8px solid #ffffff",
            borderRight: isMine ? "8px solid transparent" : "0",
            borderLeft: isMine ? "0" : "8px solid transparent",
          }}
        />
      </div>
    </div>
  );
};

// Date Group Component
export const DateGroup = ({
  date,
  messages,
  userId,
  mediaUrls,
}: {
  date: string;
  messages: InewMessage[];
  userId: string;
  mediaUrls: Record<string, string>;
}) => (
  <div className="flex flex-col space-y-3">
    <div className="flex justify-center">
      <div className="bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
        {date}
      </div>
    </div>
    {messages.map((message, index) => (
      <Message
        key={message.id || index}
        message={message}
        isMine={message.senderId === userId}
        mediaUrls={mediaUrls}
      />
    ))}
  </div>
);

// Main ChatMessages Component
export const ChatMessages = ({
  messages,
  userId,
  receiverId,
  setMessages,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [fetchMedia] = useFetchMessageFromS3Mutation();

  const socketContext = useContext(SocketContext);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socketContext?.socket?.connected) {
      socketContext?.socket.emit("join", { userId, receiverId });
    }

    socketContext?.socket?.on("direct_message", (data: InewMessage) => {
      setMessages((prev) => [
        ...prev,
        ...(Array.isArray(data) ? data : [data]),
      ]);
    });
  }, [ socketContext?.socket?.connected]);

  useEffect(() => {
    const mediaMessages = messages.filter(
      (msg) => msg.contentType !== "text" && !mediaUrls[msg.id || ""]
    );
    if (mediaMessages.length === 0) return;

    const fetchMediaFiles = async () => {
      try {
        const mediaKeys = mediaMessages.map(
          (msg) => `${msg.contentType}/${msg.content}`
        );
        const response: IaxiosResponse = await fetchMedia(mediaKeys);
        if (response.data?.imageUrl) {
          setMediaUrls((prev) => ({
            ...prev,
            ...mediaMessages.reduce((acc, msg, index) => {
              if (msg.id && response.data.imageUrl[index]) {
                acc[msg.id] = response.data.imageUrl[index];
              }
              return acc;
            }, {} as Record<string, string>),
          }));
        } else {
          errorTost(
            "Failed to load media",
            response.error?.data?.error || [{ message: "Please try again" }]
          );
        }
      } catch (err) {
        console.error("Error fetching media:", err);
        errorTost("Failed to load media", [{ message: "Please try again" }]);
      }
    };

    fetchMediaFiles();
  }, [messages, fetchMedia]);

  const groupMessagesByDate = () => {
    const groups: Record<string, InewMessage[]> = {};
  
    messages.forEach((message) => {
      const dateObj = new Date(message.createdAt);
      const dateStr = isToday(dateObj)
        ? "Today"
        : format(dateObj, "MMMM d, yyyy");
  
      groups[dateStr] = groups[dateStr]
        ? [...groups[dateStr], message]
        : [message];
    });
  
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }));
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex flex-col p-4 space-y-3 bg-gray-50 dark:bg-zinc-900">
      <div
        className="absolute inset-0 bg-repeat opacity-5 dark:opacity-2 pointer-events-none"
        style={{
          backgroundImage:
            "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQoLDDf2IqZsAAAA7klEQVQ4y5XUzU3DQBCG4ScR90gF0A6ECpJjJJIKYtMBdBDS0EWcU4QKAhVACUmOIFmWD57Pdlw1h13p1czO/kn2QsuFhla3aqngXGfAEJIlBwbJdgFnlnxLrp1AEp8s8UiuoLEy0NpBV8uLlp6e1sqAVwMXziz5MVKz4XTvRK+7NuCkVNR5UxtLJpITtTH8y/gVMZlIpqI+2OjYWXKVXLIzSO4c+JIcyqcuGUre5Yfs5JIXeZQnhaTvp91XspFsypXXXe7EJ5+OVdzZ6Gg4sLLUscS5X7XhVxNJ09FIg1Lj78yKN2lZkHxI3v4AfOB6hzq7UYEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDUtMTBUMTE6MTI6NTUrMDA6MDAi+wQ6AAAAJXRFWHRkYXRlOm1vZGlmyQAyMDIwLTA1LTEwVDExOjEyOjU1KzAwOjAwU6a8hgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=')",
        }}
      />
      <div className="flex flex-col space-y-6 z-10">
        {messageGroups.map((group, index) => (
          <DateGroup
            key={index}
            date={group.date}
            messages={group.messages}
            userId={userId}
            mediaUrls={mediaUrls}
          />
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};
