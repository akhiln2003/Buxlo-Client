import { RouterProvider } from "react-router-dom";
import routes from "@/routes/routes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./contexts/themeContext";
import { SocketContext } from "./contexts/socketContext";
import { useContext, useEffect } from "react";
import { useGetUser } from "./hooks/useGetUser";

function App() {
  const socketContext = useContext(SocketContext);
  const user = useGetUser();

  useEffect(() => {
    const socket = socketContext.notificationSocket;

    // Guard: wait until socket is connected and user is available
    if (!socket || !user?.id) return;

    if (socket.connected) {
      socket.emit("join", { userId: user.id });
    } else {
      // If not connected yet, wait for connection and then emit
      socket.once("connect", () => {
        socket.emit("join", { userId: user.id });
      });
    }
  }, [socketContext?.notificationSocket, user?.id]);

  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <RouterProvider router={routes} />
        <Toaster />
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
