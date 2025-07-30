import { useEffect, useRef, useState } from "react";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useWebRTC } from "@/hooks/useVideoCall";
import { CallState, CallInfo } from "@/pages/chat";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";

interface VideoCallModalProps {
  callInfo: CallInfo;
  currentUserId: string;
  onlineUsers: Set<string>;
  onClose: () => void;
  socket: import("socket.io-client").Socket;
}

export function VideoCallModal({
  callInfo,
  currentUserId,
  onlineUsers,
  onClose,
  socket,
}: VideoCallModalProps) {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const isConnected = callInfo.state === CallState.CONNECTED;
  const isRemoteOnline = onlineUsers.has(callInfo.remoteUserId);

  // Updated addRemoteStream with null check
  const addRemoteStream = (remoteStream: MediaStream) => {
    if (remoteRef.current) {
      remoteRef.current.srcObject = remoteStream;
    } else {
      console.error("remoteRef.current is null, cannot set remote stream");
    }
  };

  useWebRTC({
    socket: socket,
    isCaller: callInfo.isOutgoing,
    localVideoRef: localRef,
    remoteVideoRef: addRemoteStream,
    callerId: callInfo.isOutgoing ? currentUserId : callInfo.remoteUserId,
    receiverId: callInfo.isOutgoing ? callInfo.remoteUserId : currentUserId,
    isReady: isConnected,
  });

  useEffect(() => {
    const handleCallRejected = () => {
      onClose();
    };

    const handleEndCall = () => {
      onClose();
    };

    if (socket) {
      socket.on("call_rejected", handleCallRejected);
      socket.on("end-call", handleEndCall);
    }

    return () => {
      if (socket) {
        socket.off("call_rejected", handleCallRejected);
        socket.off("end-call", handleEndCall);
      }
    };
  }, [socket, onClose]);

  const handleEndCall = () => {
    // Clean up media streams
    if (localRef.current?.srcObject) {
      const stream = localRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  const toggleMute = () => {
    if (localRef.current?.srcObject) {
      const stream = localRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localRef.current?.srcObject) {
      const stream = localRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const getStatusText = () => {
    if (!isRemoteOnline) return "User is offline";
    if (callInfo.state === CallState.CALLING) return "Calling...";
    if (callInfo.state === CallState.RINGING) return "Ringing...";
    return "";
  };

  const getAvatarUrl = () => {
    if (callInfo.remoteAvatar && callInfo.remoteAvatar.trim()) {
      return callInfo.remoteAvatar;
    }
    return dummyProfileImage;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div
        className={`bg-black rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
          isMinimized
            ? "w-80 h-56 fixed bottom-4 right-4"
            : "w-full h-full max-w-6xl max-h-[90vh]"
        }`}
      >
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <div className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
            {callInfo.remoteName}
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleMinimize}
              className="p-2 rounded-full bg-gray-800 bg-opacity-75 text-white hover:bg-opacity-100 transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative w-full h-full">
          {/* Remote Video or Status */}
          {isConnected && isRemoteOnline ? (
            <video
              ref={remoteRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center">
              <img
                src={getAvatarUrl()}
                alt={callInfo.remoteName}
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <p className="text-white text-lg font-medium">
                {callInfo.remoteName}
              </p>
              <p className="text-gray-300 text-sm mt-2">{getStatusText()}</p>
            </div>
          )}

          {/* Local Video (Picture in Picture) */}
          <div
            className={`absolute ${
              isMinimized
                ? "bottom-2 right-2 w-20 h-16"
                : "bottom-4 right-4 w-48 h-36"
            } rounded overflow-hidden border-2 border-white shadow-lg`}
          >
            <video
              ref={localRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="text-white w-6 h-6" />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        {!isMinimized && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
            {/* <button
              onClick={toggleMute}
              className={`p-3 rounded-full transition-colors ${
                isMuted
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-800 bg-opacity-75 hover:bg-opacity-100"
              } text-white`}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button> */}

            {/* <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                isVideoOff
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-800 bg-opacity-75 hover:bg-opacity-100"
              } text-white`}
            >
              {isVideoOff ? (
                <VideoOff className="w-5 h-5" />
              ) : (
                <Video className="w-5 h-5" />
              )}
            </button> */}

            <button
              onClick={handleEndCall}
              className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Minimized Controls */}
        {isMinimized && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            <button
              onClick={toggleMute}
              className={`p-1 rounded-full transition-colors ${
                isMuted ? "bg-red-600" : "bg-gray-800 bg-opacity-75"
              } text-white`}
            >
              {isMuted ? (
                <MicOff className="w-3 h-3" />
              ) : (
                <Mic className="w-3 h-3" />
              )}
            </button>

            <button
              onClick={handleEndCall}
              className="p-1 rounded-full bg-red-600 text-white transition-colors"
            >
              <PhoneOff className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}