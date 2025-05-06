import React, { useState, useRef, ChangeEvent } from "react";
import { Camera, Video, File, Images, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { InewMessage } from "@/pages/chat";

interface AttachmentMenuProps {
  showAttachmentMenu: boolean;
  handleFileUpload: (
    e: ChangeEvent<HTMLInputElement>,
    type: InewMessage["contentType"]
  ) => Promise<void>;
  onCameraClick: () => void;
}

export function ChatAttachmentMenu({
  showAttachmentMenu,
  handleFileUpload,
  onCameraClick,
}: AttachmentMenuProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<{
    type: "text" | "image" | "video" | "audio" | "document";
    url: string;
    file: File;
  } | null>(null);

  const handleFileSelect = (
    e: ChangeEvent<HTMLInputElement>,
    type: "text" | "image" | "video" | "audio" | "document"
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      let fileUrl = "";
      if (type === "image" || type === "video") {
        fileUrl = URL.createObjectURL(file);
      } else if (type === "document") {
        fileUrl = URL.createObjectURL(new Blob([file], { type: file.type }));
      }
      setPreviewFile({
        type,
        url: fileUrl,
        file,
      });
      e.target.value = "";
    }
  };

  const handleFileSend = () => {
    if (previewFile) {
      const syntheticEvent = {
        target: {
          files: [previewFile.file],
        },
      } as unknown as ChangeEvent<HTMLInputElement>;
      handleFileUpload(syntheticEvent, previewFile.type);
      URL.revokeObjectURL(previewFile.url);
      setPreviewFile(null);
    }
  };

  const handleFileCancel = () => {
    if (previewFile) {
      URL.revokeObjectURL(previewFile.url);
      setPreviewFile(null);
    }
  };

  const renderPreview = () => {
    if (!previewFile) return null;
    return (
      <Dialog open={!!previewFile} onOpenChange={handleFileCancel}>
        <DialogContent className="w-[95vw] max-w-3xl h-[90vh] p-0 overflow-hidden">
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            {previewFile.type === "image" && (
              <div className="w-full max-w-[600px] h-[400px] flex items-center justify-center">
                <img
                  src={previewFile.url}
                  alt="Image Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            {previewFile.type === "video" && (
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                <video
                  src={previewFile.url}
                  controls
                  className="max-w-full max-h-full"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <Button
                    variant="default"
                    className="rounded-full px-6 py-3 flex items-center space-x-2 bg-green-500 hover:bg-green-600"
                    onClick={handleFileSend}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            )}
            {previewFile.type === "document" && (
              <div className="w-full max-w-4xl h-[70vh] flex flex-col items-center justify-center">
                <iframe
                  src={previewFile.url}
                  className="w-full h-full"
                  title="Document Preview"
                />
                <div className="mt-4 text-white">
                  <p>{previewFile.file.name}</p>
                  <p>{(previewFile.file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 mr-2"
                onClick={handleFileCancel}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            {(previewFile.type === "image" || previewFile.type === "document") && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Button
                  variant="default"
                  className="rounded-sm px-6 py-3 flex items-center space-x-2 bg-blue-500 hover:bg-blue-600"
                  onClick={handleFileSend}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      {showAttachmentMenu && (
        <div className="absolute bottom-14 left-1 mb-2 z-10 bg-white dark:bg-zinc-700 rounded-lg shadow-lg p-3 w-40 sm:w-48 animate-fade-in">
          <Button
            variant="ghost"
            className="flex items-center w-full justify-start p-2 hover:bg-gray-100 dark:hover:bg-zinc-600"
            onClick={onCameraClick}
          >
            <Camera size={20} className="text-blue-500 mr-2" />
            <span className="text-sm dark:text-white">Camera</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center w-full justify-start p-2 hover:bg-gray-100 dark:hover:bg-zinc-600"
            onClick={() => imageInputRef.current?.click()}
          >
            <Images size={20} className="text-blue-500 mr-2" />
            <span className="text-sm dark:text-white">Images</span>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e, "image")}
              className="hidden"
            />
          </Button>
          <Button
            variant="ghost"
            className="flex items-center w-full justify-start p-2 hover:bg-gray-100 dark:hover:bg-zinc-600"
            onClick={() => videoInputRef.current?.click()}
          >
            <Video size={20} className="text-purple-500 mr-2" />
            <span className="text-sm dark:text-white">Videos</span>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => handleFileSelect(e, "video")}
              className="hidden"
            />
          </Button>
          <Button
            variant="ghost"
            className="flex items-center w-full justify-start p-2 hover:bg-gray-100 dark:hover:bg-zinc-600"
            onClick={() => docInputRef.current?.click()}
          >
            <File size={20} className="text-green-500 mr-2" />
            <span className="text-sm dark:text-white">Document</span>
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileSelect(e, "document")}
              className="hidden"
            />
          </Button>
        </div>
      )}
      {renderPreview()}
    </>
  );
}