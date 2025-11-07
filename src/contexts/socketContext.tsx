import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  notificationSocket?: Socket | null;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  notificationSocket: null,
});

const SOCKET_CONFIG = {
  base: {
    transports: ["websocket", "polling"],
    reconnectionAttempts: 5,
  },
  urls: {
    socket: import.meta.env.VITE_API_CHAT,
    notification: import.meta.env.VITE_API_NOTIFICATION,
  },
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notificationSocket, setNotificationSocket] = useState<Socket | null>(
    null
  );

  useEffect(() => {
    console.log("🔌 Initializing sockets...");

    // ✅ Correctly specify the `path` for each socket
    const chatSocket = io(SOCKET_CONFIG.urls.socket, {
      ...SOCKET_CONFIG.base,
      path: "/socket.io",
    });

    const notifSocket = io(SOCKET_CONFIG.urls.notification, {
      ...SOCKET_CONFIG.base,
      path: "/notification-socket",
    });

    setSocket(chatSocket);
    setNotificationSocket(notifSocket);

    chatSocket.on("connect", () => {
      console.log("✅ ChatSocket connected:", chatSocket.id);
    });

    chatSocket.on("disconnect", () => {
      console.log("❌ ChatSocket disconnected");
    });

    notifSocket.on("connect", () => {
      console.log("✅ NotificationSocket connected:", notifSocket.id);
    });

    notifSocket.on("disconnect", () => {
      console.log("❌ NotificationSocket disconnected");
    });

    return () => {
      console.log("🧹 Cleaning up sockets...");
      chatSocket.disconnect();
      notifSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, notificationSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
