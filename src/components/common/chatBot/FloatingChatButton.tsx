import { Bot, X } from "lucide-react";

interface FloatingChatButtonProps {
  onClick: () => void;
  isChatOpen: boolean;
}

function FloatingChatButton({ onClick, isChatOpen }: FloatingChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-16 h-16 rounded-md flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-40 hover:scale-110 active:scale-95 ${
        isChatOpen ? "bg-gray-300" : " bg-zinc-900 dark:bg-zinc-600  border-black/10 text-white"
      }`}
      aria-label={isChatOpen ? "Close chat" : "Open chat"}
    >
      {isChatOpen ? (
        <X size={24} className="text-white" />
      ) : (
        <Bot size={24} className="text-white" />
      )}
    </button>
  );
}

export default FloatingChatButton;
