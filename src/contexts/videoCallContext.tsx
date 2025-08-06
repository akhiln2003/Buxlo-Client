import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Socket } from "socket.io-client";
import { SocketContext } from "./socketContext";
import { useGetUser } from "@/hooks/useGetUser";
import { IncomingCallModal } from "@/components/common/chat/IncomingCallModal";
import { VideoCallModal } from "@/components/common/chat/videoCall";
import { errorTost } from "@/components/ui/tosastMessage";

// Call states enum
export enum CallState {
  IDLE = "idle",
  CALLING = "calling",
  RINGING = "ringing",
  CONNECTED = "connected",
  ENDED = "ended",
}

export interface CallInfo {
  state: CallState;
  isOutgoing: boolean;
  remoteUserId: string;
  remoteName: string;
  remoteAvatar: string;
}

interface CallContextType {
  callInfo: CallInfo | null;
  isInCall: boolean;
  startVideoCall: (
    remoteUserId: string,
    remoteName: string,
    remoteAvatar: string,
    onlineUsers: Set<string>
  ) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
}

const CallContext = createContext<CallContextType | null>(null);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};

interface CallProviderProps {
  children: ReactNode;
}

export const CallProvider: React.FC<CallProviderProps> = ({ children }) => {
  const [callInfo, setCallInfo] = useState<CallInfo | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const socketContext = useContext(SocketContext);
  const user = useGetUser();

  const isInCall = callInfo !== null;

  // Listen to socket events for calls
  useEffect(() => {
    if (!socketContext?.socket || !user?.id) return;

    const socket = socketContext.socket;

    // Listen for online users updates
    const handleActiveUsers = (data: string[]) => {
      setOnlineUsers(new Set(data));
    };

    const handleOnlineUser = ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    };

    const handleOfflineUser = (userId: string) => {
      setOnlineUsers((prev) => {
        const updatedUsers = new Set(prev);
        updatedUsers.delete(userId);
        return updatedUsers;
      });

      // If the user who went offline was in a call with us, end the call
      if (callInfo && callInfo.remoteUserId === userId) {
        setCallInfo(null);
        setShowVideoModal(false);
      }
    };

    // Listen for incoming calls
    const handleIncomingCall = ({
      from,
      name,
      avatar,
    }: {
      from: string;
      name: string;
      avatar: string;
    }) => {
      // Don't accept new calls if already in one
      if (callInfo) {
        socket.emit("call-rejected", {
          from: user.id,
          to: from,
        });
        return;
      }

      setCallInfo({
        state: CallState.RINGING,
        isOutgoing: false,
        remoteUserId: from,
        remoteName: name,
        remoteAvatar: avatar,
      });
    };

    // Listen for call acceptance
    const handleCallAccepted = () => {
      setCallInfo((prev) =>
        prev ? { ...prev, state: CallState.CONNECTED } : null
      );
    };

    // Listen for call rejection
    const handleCallRejected = () => {
      setCallInfo(null);
      setShowVideoModal(false);
    };

    // Listen for call end
    const handleCallEnd = () => {
      setCallInfo(null);
      setShowVideoModal(false);
    };

    // Register socket listeners
    socket.on("active_user", handleActiveUsers);
    socket.on("online", handleOnlineUser);
    socket.on("leave", handleOfflineUser);
    socket.on("incoming_call", handleIncomingCall);
    socket.on("call_accepted", handleCallAccepted);
    socket.on("call_rejected", handleCallRejected);
    socket.on("end-call", handleCallEnd);

    // Emit active user when component mounts
    socket.emit("active_user", user.id);

    return () => {
      socket.off("active_user", handleActiveUsers);
      socket.off("online", handleOnlineUser);
      socket.off("leave", handleOfflineUser);
      socket.off("incoming_call", handleIncomingCall);
      socket.off("call_accepted", handleCallAccepted);
      socket.off("call_rejected", handleCallRejected);
      socket.off("end-call", handleCallEnd);
    };
  }, [socketContext?.socket, user?.id, callInfo]);

  const startVideoCall = (
    remoteUserId: string,
    remoteName: string,
    remoteAvatar: string,
    currentOnlineUsers: Set<string>
  ) => {
    // Check if already in a call
    if (callInfo) {
      errorTost("Already in a call", [
        { message: "Please end current call first" },
      ]);
      return;
    }

    // Check if user is online
    if (!currentOnlineUsers.has(remoteUserId)) {
      errorTost("User is offline", [
        { message: "Cannot start call with offline user" },
      ]);
      return;
    }

    setCallInfo({
      state: CallState.CALLING,
      isOutgoing: true,
      remoteUserId,
      remoteName,
      remoteAvatar,
    });

    setShowVideoModal(true);

    // Emit call-user event
    socketContext?.socket?.emit("call-user", {
      to: remoteUserId,
      from: user?.id,
      name: user?.name,
      avatar: user?.avatar || "",
    });
  };

  const acceptCall = () => {
    if (!callInfo) return;

    setCallInfo((prev) =>
      prev ? { ...prev, state: CallState.CONNECTED } : null
    );
    setShowVideoModal(true);

    // Emit call accepted
    socketContext?.socket?.emit("answer-call", {
      from: user?.id,
      to: callInfo.remoteUserId,
    });
  };

  const rejectCall = () => {
    if (!callInfo) return;

    socketContext?.socket?.emit("call-rejected", {
      from: user?.id,
      to: callInfo.remoteUserId,
    });

    setCallInfo(null);
  };

  const endCall = () => {
    if (callInfo) {
      // Emit end call event
      socketContext?.socket?.emit("end-call", {
        from: user?.id,
        to: callInfo.remoteUserId,
      });
    }

    setCallInfo(null);
    setShowVideoModal(false);
  };

  return (
    <CallContext.Provider
      value={{
        callInfo,
        isInCall,
        startVideoCall,
        acceptCall,
        rejectCall,
        endCall,
      }}
    >
      {children}

      {/* Global Incoming Call Modal */}
      {callInfo &&
        callInfo.state === CallState.RINGING &&
        !callInfo.isOutgoing && (
          <IncomingCallModal
            name={callInfo.remoteName}
            avatar={callInfo.remoteAvatar}
            onAccept={acceptCall}
            onReject={rejectCall}
          />
        )}

      {/* Global Video Call Modal */}
      {showVideoModal && callInfo && (
        <VideoCallModal
          callInfo={callInfo}
          currentUserId={user?.id as string}
          onlineUsers={onlineUsers}
          onClose={endCall}
          socket={socketContext?.socket as Socket}
        />
      )}
    </CallContext.Provider>
  );
};
