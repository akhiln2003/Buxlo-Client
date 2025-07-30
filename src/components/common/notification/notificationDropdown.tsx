import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTheme } from "@/contexts/themeContext";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { Inotification } from "@/@types/interface/Inotification";
import {
  useFetchNotificationsMutation,
  useReadNotificationsMutation,
} from "@/services/apis/CommonApis";
import { SocketContext } from "@/contexts/socketContext";
import NotificationSound from "@/assets/sounds/notification.mp3";

interface NotificationDropdownProps {
  notificationsUrl: string;
  onNotificationClick?: () => void;
}

export default function NotificationDropdown({
  notificationsUrl,
  onNotificationClick,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Inotification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [fetchNotifications] = useFetchNotificationsMutation();
  const [readNotification] = useReadNotificationsMutation();
  const socketContext = useContext(SocketContext);
  const { isDarkMode } = useTheme();
  const { user } = useSelector((state: RootState) => state.userAuth);

  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const colorTheme = isDarkMode ? "white" : "black";

  const formatTimeAgo = (dateString: string) => {
    const diff = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / 1000
    );
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const fetchNotificationDatas = async () => {
    if (!user?.id) return;
    try {
      const response: IaxiosResponse = await fetchNotifications({
        userId: user.id,
        page: 1,
        status: "unread",
        searchData: "",
      });

      if (response.data) {
        setNotifications(response.data.notifications);
      } else {
        console.error("Error fetching notifications:", response.error);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      const response: IaxiosResponse = await readNotification([
        { id, status: "read" },
      ]);
      if (response.data) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, status: "read" } : notif
          )
        );
      } else {
        console.error("Failed to mark as read:", response.error);
      }
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotificationDatas();
    }
  }, [user?.id]);

  useEffect(() => {
    notificationSoundRef.current = new Audio(NotificationSound);
    notificationSoundRef.current.volume = 0.5;

    const unlockAudio = () => {
      if (!notificationSoundRef.current) return;

      notificationSoundRef.current
        .play()
        .then(() => {
          notificationSoundRef.current?.pause();
          if (notificationSoundRef.current)
            notificationSoundRef.current.currentTime = 0;
          setAudioUnlocked(true);
        })
        .catch((err) => {
          console.warn("Audio unlock failed:", err);
        });

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  useEffect(() => {
    const socket = socketContext.notificationSocket;
    if (!socket) return;

    const handleNotification = (data: Inotification) => {
      if (audioUnlocked && notificationSoundRef.current) {
        notificationSoundRef.current
          .play()
          .catch((err) =>
            console.warn("Failed to play notification sound:", err)
          );
      }
      setNotifications((prev) => [data, ...prev]);
    };
    const handleClearNotifications = (data: { userId: string }) => {
      if (data.userId === user?.id) {
        setNotifications([]);
      }
    };

    socket.on("direct_notification", handleNotification);
    socket.on("mark_all_read", handleClearNotifications);

    return () => {
      socket.off("direct_notification", handleNotification);
      socket.off("mark_all_read", handleClearNotifications);
    };
  }, [socketContext?.notificationSocket, audioUnlocked]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const getDropdownNotifications = () => {
    const unreadNotifs = notifications
      .filter((n) => n.status === "unread")
      .slice(0, 5);
    const latestNotifs = notifications.slice(0, 5);

    const combined = [...unreadNotifs];
    latestNotifs.forEach((notif) => {
      if (!combined.find((n) => n.id === notif.id)) {
        combined.push(notif);
      }
    });

    return combined.slice(0, 10);
  };

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
    onNotificationClick?.();
  };

  return (
    <DropdownMenu
      open={isNotificationOpen}
      onOpenChange={setIsNotificationOpen}
    >
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell size={25} strokeWidth={1.5} color={colorTheme} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="relative mr-9 w-[25rem] max-h-[25rem] overflow-y-auto scrollbar-thin dark:scrollbar-track-zinc-900 scrollbar-thumb-gray-500 dark:scrollbar-thumb-gray-500 scrollbar-track-gray scrollbar-track-rounded-full p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-50 dark:bg-zinc-950 flex justify-between items-center px-4 py-3 border-b border-gray-300 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              Notifications
            </span>
          </div>
          {unreadCount > 0 && (
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-2">
          {getDropdownNotifications().length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {getDropdownNotifications().map((notification) => (
                <div
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(notification.id as string)
                  }
                  className={`p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
                    notification.status === "unread"
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {notification.status === "unread" && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-900 dark:text-white capitalize">
                          {notification.type}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(notification.createdAt as string)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-zinc-800 p-2">
          <Link
            to={notificationsUrl}
            className="block w-full text-center py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            onClick={() => {
              setIsNotificationOpen(false);
              onNotificationClick?.();
            }}
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
