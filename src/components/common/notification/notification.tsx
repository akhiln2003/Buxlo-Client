import { useContext, useEffect, useState, useCallback } from "react";
import {
  Bell,
  Check,
  AlertCircle,
  MessageCircle,
  Heart,
  Settings,
  Trash2,
  Clock,
  CheckCheck,
} from "lucide-react";
import { useGetUser } from "@/hooks/useGetUser";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import {
  useDeleteNotificationsMutation,
  useFetchNotificationsMutation,
  useReadNotificationsMutation,
} from "@/services/apis/CommonApis";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { Inotification } from "@/@types/interface/Inotification";
import { SocketContext } from "@/contexts/socketContext";
import SearchInput from "@/components/ui/searchInput";
import { PageNation } from "@/components/ui/pageNation";
import { USER_ROLE } from "@/@types/userRoleEnum";

const iconMap = {
  message: MessageCircle,
  alert: AlertCircle,
  like: Heart,
  settings: Settings,
};

const colorMap = {
  message: "bg-blue-500",
  alert: "bg-red-500",
  like: "bg-pink-500",
  settings: "bg-gray-500",
};

const formatTimeAgo = (dateString: string) => {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

interface Inotifications extends Inotification {
  icon?: React.ElementType;
  color?: string;
  time?: string;
  read: boolean;
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Inotifications[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNationData, setPageNationData] = useState({
    pageNum: 1,
    totalPages: 1,
  });
  const user = useGetUser();
  const [fetchNotifications] = useFetchNotificationsMutation();
  const [readNotification] = useReadNotificationsMutation();
  const [notificationDelete] = useDeleteNotificationsMutation();
  const socketContext = useContext(SocketContext);

  const fetchNotificationDatas = useCallback(
    async (
      id: string,
      page: number = 1,
      status: string = "all",
      searchData: string = ""
    ) => {
      const userId = id || user?.id;
      try {
        const response: IaxiosResponse = await fetchNotifications({
          userId,
          page,
          status,
          searchData,
        });

        if (response.data) {
          const rawNotifs = response.data.notifications;
          const mapped: Inotifications[] = rawNotifs.map(
            (n: Inotification) => ({
              ...n,
              read: n.status !== "unread",
              icon: iconMap[n.type as keyof typeof iconMap] || Bell,
              color: colorMap[n.type as keyof typeof colorMap] || "bg-gray-400",
              time: formatTimeAgo(n.createdAt as string),
            })
          );

          setNotifications(mapped);

          setPageNationData((prev) => ({
            ...prev,
            totalPages: response.data.totalPages,
            pageNum: page,
          }));
        } else {
          errorTost(
            "Something went wrong",
            response.error?.data?.error || [
              { message: `${response.error?.data || "Unknown error"}` },
            ]
          );
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        errorTost("Something went wrong", [
          { message: "Please try again later" },
        ]);
      }
    },
    [fetchNotifications, user?.id]
  );

  useEffect(() => {
    fetchNotificationDatas(
      user?.id as string,
      pageNationData.pageNum,
      filter,
      searchTerm
    );
  }, [
    pageNationData.pageNum,
    filter,
    searchTerm,
    fetchNotificationDatas,
    user?.id,
  ]);

  useEffect(() => {
    const socket = socketContext.notificationSocket;
    if (!socket) return;

    const handleNotification = (data: Inotification) => {
      const newNotification: Inotifications = {
        ...data,
        read: data.status !== "unread",
        icon: iconMap[data.type as keyof typeof iconMap] || Bell,
        color: colorMap[data.type as keyof typeof colorMap] || "bg-gray-400",
        time: formatTimeAgo(data.createdAt as string),
      };
      setNotifications((prev) => [newNotification, ...prev]);
    };

    socket.on("direct_notification", handleNotification);

    return () => {
      socket.off("direct_notification", handleNotification);
    };
  }, [socketContext?.notificationSocket]);

  const markAsRead = async (id: string) => {
    try {
      const response: IaxiosResponse = await readNotification([
        { id, status: "read" },
      ]);

      if (response.data) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        );
      } else {
        errorTost(
          "Something went wrong",
          response.error?.data?.error || [
            { message: `${response.error?.data || "Unknown error"}` },
          ]
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      errorTost("Something went wrong", [
        { message: "Please try again later" },
      ]);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifs = notifications.filter((notif) => !notif.read);
    if (unreadNotifs.length === 0) return;

    const payload = unreadNotifs.map((notif) => ({
      id: notif.id as string,
      status: "read" as const,
    }));

    try {
      const response: IaxiosResponse = await readNotification(payload);

      if (response.data) {
        socketContext?.notificationSocket?.emit("mark_all_read", {
          userId: user?.id,
        });

        setNotifications((prev) =>
          prev.map((notif) => (!notif.read ? { ...notif, read: true } : notif))
        );
      } else {
        errorTost(
          "Something went wrong",
          response.error?.data?.error || [
            { message: `${response.error?.data || "Unknown error"}` },
          ]
        );
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      errorTost("Something went wrong", [
        { message: "Please try again later" },
      ]);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response: IaxiosResponse = await notificationDelete([id]);
      if (response.data) {
        successToast("Delete", response.data.response);
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      } else {
        errorTost(
          "Something went wrong",
          response.error?.data?.error || [
            { message: `${response.error?.data || "Unknown error"}` },
          ]
        );
      }
    } catch (error) {
      console.error("Error deleting  notifications :", error);
      errorTost("Something went wrong", [
        { message: "Please try again later" },
      ]);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPageNationData((prev) => ({ ...prev, pageNum: 1 }));
  }, []);

  const handlePageChange = useCallback(
    async (page: number) => {
      await fetchNotificationDatas(
        user?.id as string,
        page,
        filter,
        searchTerm
      );
    },
    [fetchNotificationDatas, user?.id, filter, searchTerm]
  );

  const filterButtons = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className={`bg-white shadow-sm sticky ${
          user?.role == USER_ROLE.ADMIN ? "top-0" : "top-14"
        } z-10`}
      >
        <div
          className={`${
            user?.role == USER_ROLE.ADMIN
              ? "w-full px-4 sm:px-6 lg:px-8 py-4"
              : "max-w-4xl mx-auto px-4 py-4"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-7 h-7 text-blue-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Notifications
                </h1>
                <p className="text-sm text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark All Read</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-4">
          <SearchInput
            placeholder="Search notifications..."
            onSearch={handleSearch}
            debounceDelay={400}
          />

          <div className="flex flex-wrap gap-2">
            {filterButtons.map((btn) => {
              const count =
                btn.key === "all"
                  ? notifications.length
                  : btn.key === "unread"
                  ? unreadCount
                  : 0;

              return (
                <button
                  key={btn.key}
                  onClick={() => {
                    setFilter(btn.key);
                    setPageNationData((prev) => ({ ...prev, pageNum: 1 }));
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === btn.key
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {btn.label} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try different search terms"
                : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = notification.icon ?? Bell;
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${
                    !notification.read ? "border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${notification.color} flex-shrink-0`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900 text-sm">
                                {notification.type}
                              </h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{notification.time} ago</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.read && (
                              <button
                                onClick={() =>
                                  markAsRead(notification.id as string)
                                }
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                deleteNotification(notification.id as string)
                              }
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {notifications.length > 0 && (
          <div className="w-full mt-6 flex justify-center">
            <PageNation
              pageNationData={pageNationData}
              fetchUserData={handlePageChange}
              setpageNationData={setPageNationData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
