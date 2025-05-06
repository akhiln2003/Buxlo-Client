import React, { useState, useRef, useEffect } from "react";
import { RotateCcw, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

interface CameraPreviewProps {
  isOpen: boolean;
  onSend: (file: File) => void;
  onClose: () => void;
}

export function ChatCameraPreview({
  isOpen,
  onSend,
  onClose,
}: CameraPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Reset preview when camera is closed
  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl(null);
      stopCamera();
    }
  }, [isOpen]);

  // Start camera when opened
  useEffect(() => {
    if (isOpen) {
      startCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      setMediaStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Please allow camera access to take photos.");
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");
      setPreviewUrl(dataUrl);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setPreviewUrl(null);
    startCamera();
  };

  const sendPhoto = () => {
    if (previewUrl) {
      fetch(previewUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "captured-photo.jpg", {
            type: "image/jpeg",
          });
          onSend(file); // Directly call onSend to send the file
          onClose();
        });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Prevent closing when clicking outside
        if (!open) {
          return;
        }
      }}
    >
      <DialogContent
        className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>
        </DialogClose>

        <div className="relative w-full h-full bg-black">
          <canvas ref={canvasRef} className="hidden" />

          {!previewUrl ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-16 h-16 rounded-full border-4 border-white bg-transparent hover:bg-white/20"
                  onClick={takePhoto}
                >
                  <div className="w-12 h-12 rounded-full bg-white/50"></div>
                </Button>
              </div>
            </>
          ) : (
            <>
              <img
                src={previewUrl}
                alt="Captured"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <Button
                  variant="destructive"
                  className="rounded-md px-6 py-3 flex items-center space-x-2"
                  onClick={retakePhoto}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake
                </Button>
                <Button
                  variant="default"
                  className="rounded-md bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 flex items-center space-x-2"
                  onClick={sendPhoto}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}