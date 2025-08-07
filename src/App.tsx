import { RouterProvider } from "react-router-dom";
import routes from "@/routes/routes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./contexts/themeContext";
import { SocketContext } from "./contexts/socketContext";
import { useContext, useEffect } from "react";
import { useGetUser } from "./hooks/useGetUser";
import { CallProvider } from "./contexts/videoCallContext";

function App() {
  const socketContext = useContext(SocketContext);
  const user = useGetUser();

  useEffect(() => {
    const notification = socketContext.notificationSocket;

    if (!notification || !user?.id) return;

    if (notification.connected) {
      notification.emit("join", { userId: user.id });
    } else {
      // If not connected yet, wait for connection and then emit
      notification.once("connect", () => {
        notification.emit("join", { userId: user.id });
      });
    }
  }, [socketContext?.notificationSocket, user?.id]);

  useEffect(() => {
    const chat = socketContext.socket;

    if (!chat || !user?.id) return;

    if (chat.connected) {
      chat.emit("online", user?.id as string);
    } else {
      chat.once("connect", () => {
        chat.emit("online", user?.id as string);
      });
    }

    return () => {
      chat.emit("leave", user?.id as string);
      chat.off("leave");
      chat.off("online");
    };
  }, [socketContext?.socket, user?.id]);

  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <CallProvider>
          <RouterProvider router={routes} />
          <Toaster />
        </CallProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
