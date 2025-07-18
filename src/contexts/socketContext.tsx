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
    const newSocket = io(SOCKET_CONFIG.urls.socket);
    const notificationSocket = io(SOCKET_CONFIG.urls.notification);

    setSocket(newSocket);
    setNotificationSocket(notificationSocket);

    if (socket) {
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });
    }

    if (notificationSocket) {
      notificationSocket.on("connect", () => {
        console.log("NotificationSocket connected:", notificationSocket.id);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        console.log("ChatSocket disconnected");
      }
      if (notificationSocket) {
        notificationSocket.disconnect();
        console.log("NotificationSocket disconnected");
      }
    };
  }, [socket?.connected]);

  return (
    <SocketContext.Provider value={{ socket, notificationSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
