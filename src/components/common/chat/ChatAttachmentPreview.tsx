import { useState, useEffect } from "react";
import { File, Send, Trash2, X } from "lucide-react";

interface AttachmentPreviewProps {
  file: File;
  onSend: (file: File) => void;
  onClose: () => void;
}

export function ChatAttachmentPreview({ file, onSend, onClose }: AttachmentPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const renderPreview = () => {
    if (!previewUrl) return null;

    switch (file.type.split('/')[0]) {
      case 'image':
        return <img src={previewUrl} alt="Preview" className="max-w-full h-64 object-contain" />;
      case 'video':
        return (
          <video controls className="max-w-full h-64">
            <source src={previewUrl} type={file.type} />
          </video>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64">
            <File size={48} className="text-gray-500" />
            <span className="mt-2 text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
          </div>
        );
    }
  };

  return (
    <div className="absolute bottom-14 left-0 right-0 bg-black bg-opacity-90 p-4 rounded-t-lg">
      <div className="relative">
        {renderPreview()}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 bg-red-500 rounded-full"
          >
            <Trash2 size={20} className="text-white" />
          </button>
          <button
            onClick={() => onSend(file)}
            className="p-2 bg-blue-500 rounded-full"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 text-white"
      >
        <X size={20} />
      </button>
    </div>
  );
}