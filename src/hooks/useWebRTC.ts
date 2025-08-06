import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

interface UseWebRTCParams {
  socket: Socket;
  isCaller: boolean;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: (stream: MediaStream) => void;
  callerId: string;
  receiverId: string;
  isReady: boolean;
}

export function useWebRTC({
  socket,
  isCaller,
  localVideoRef,
  remoteVideoRef,
  callerId,
  receiverId,
  isReady,
}: UseWebRTCParams) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const iceCandidateBuffer = useRef<RTCIceCandidateInit[]>([]); // Buffer for ICE candidates

  useEffect(() => {
    if (!isReady) return;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }, // Added additional STUN server for reliability
        {
          urls: "turn:turn.example.com:3478", // Replace with actual TURN server if available
          username: "username", // Replace with actual TURN credentials
          credential: "credential", // Replace with actual TURN credentials
        },
      ],
    });

    pcRef.current = pc;

    const setupConnection = async () => {
      try {
        console.log("Setting up WebRTC connection...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          // console.log("Local video stream set");
        }

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.ontrack = (e) => {
          // console.log("Received remote stream");
          remoteVideoRef(e.streams[0]);
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            // console.log("Sending ICE candidate");
            socket.emit("ice-candidate", {
              from: callerId,
              to: receiverId,
              candidate: event.candidate,
            });
          }
        };

        pc.oniceconnectionstatechange = () => {
          // console.log("ICE connection state:", pc.iceConnectionState);
          if (pc.iceConnectionState === "failed") {
            console.warn("ICE connection failed, attempting to restart ICE...");
            pc.restartIce(); // Attempt to restart ICE negotiation
          } else if (pc.iceConnectionState === "disconnected") {
            console.warn("ICE connection disconnected, checking network...");
          }
        };

        pc.onconnectionstatechange = () => {
          // console.log("Connection state:", pc.connectionState);
          if (pc.connectionState === "failed") {
            console.error("WebRTC connection failed");
            socket.emit("end-call", { from: callerId, to: receiverId });
          }
        };

        if (isCaller) {
          // console.log("Creating offer as caller");
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("webrtc-offer", {
            to: receiverId,
            offer: offer,
          });
        }

        // Apply buffered ICE candidates after setting remote description
        const applyBufferedCandidates = async () => {
          if (pc.remoteDescription && iceCandidateBuffer.current.length > 0) {
            // console.log("Applying buffered ICE candidates");
            for (const candidate of iceCandidateBuffer.current) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
              } catch (err) {
                console.error("Error applying buffered ICE candidate:", err);
              }
            }
            iceCandidateBuffer.current = []; 
          }
        };

        // Handle WebRTC offer
        const handleWebRTCOffer = async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
          if (!pcRef.current || !offer) return;

          try {
            // console.log("Handling WebRTC offer");
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            await applyBufferedCandidates(); 
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            socket.emit("webrtc-answer", {
              to: callerId,
              answer: answer,
            });
            // console.log("WebRTC answer sent");
          } catch (error) {
            console.error("Error handling WebRTC offer:", error);
          }
        };

        // Handle WebRTC answer
        const handleWebRTCAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
          if (!pcRef.current || !answer) return;

          try {
            // console.log("Handling WebRTC answer");
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            await applyBufferedCandidates(); 
            // console.log("Remote description set from answer");
          } catch (error) {
            console.error("Error handling WebRTC answer:", error);
          }
        };

        // Handle ICE candidates
        const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
          try {
            if (pcRef.current && pcRef.current.remoteDescription) {
              // console.log("Adding ICE candidate");
              await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
              // console.log("Buffering ICE candidate");
              iceCandidateBuffer.current.push(candidate); 
            }
          } catch (err) {
            console.error("Error adding ICE candidate:", err);
          }
        };

        socket.on("webrtc-offer", handleWebRTCOffer);
        socket.on("webrtc-answer", handleWebRTCAnswer);
        socket.on("ice-candidate", handleIceCandidate);

        return () => {
          socket.off("webrtc-offer", handleWebRTCOffer);
          socket.off("webrtc-answer", handleWebRTCAnswer);
          socket.off("ice-candidate", handleIceCandidate);
        };
      } catch (error) {
        console.error("Error setting up connection:", error);
      }
    };

    const cleanupConnection = () => {
      // console.log("Cleaning up WebRTC connection");
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      iceCandidateBuffer.current = []; 
    };

    setupConnection();

    return () => {
      cleanupConnection();
    };
  }, [
    callerId,
    isCaller,
    localVideoRef,
    receiverId,
    remoteVideoRef,
    socket,
    isReady,
  ]);

  const restartIce = () => {
    if (pcRef.current) {
      // console.log("Restarting ICE negotiation");
      pcRef.current.restartIce();
    }
  };

  return { restartIce };
}