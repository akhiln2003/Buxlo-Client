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
    console.log("Initializing sockets...");
    
    const newSocket = io(SOCKET_CONFIG.urls.socket, SOCKET_CONFIG.base);
    const newNotificationSocket = io(SOCKET_CONFIG.urls.notification, SOCKET_CONFIG.base);

    setSocket(newSocket);
    setNotificationSocket(newNotificationSocket);

    newSocket.on("connect", () => {
      console.log("ChatSocket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("ChatSocket disconnected");
    });

    newNotificationSocket.on("connect", () => {
      console.log("NotificationSocket connected:", newNotificationSocket.id);
    });

    newNotificationSocket.on("disconnect", () => {
      console.log("NotificationSocket disconnected");
    });

    return () => {
      console.log("Cleaning up sockets...");
      newSocket.disconnect();
      newNotificationSocket.disconnect();
    };
  }, []); // Remove the dependency to prevent re-initialization loop

  return (
    <SocketContext.Provider value={{ socket, notificationSocket }}>
      {children}
    </SocketContext.Provider>
  );
};