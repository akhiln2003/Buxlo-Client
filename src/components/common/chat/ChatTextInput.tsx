import { KeyboardEvent, useRef, useEffect, ChangeEvent } from "react";
import { Send, Smile, X } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useTheme } from "@/contexts/themeContext";

interface TextInputProps {
  newMessage: string;
  setNewMessage: (content: string) => void;
  handleSend: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  isMobile: boolean;
}

export function ChatTextInput({
  newMessage,
  setNewMessage,
  handleSend,
  showEmojiPicker,
  setShowEmojiPicker,
  isMobile,
}: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isDarkMode } = useTheme();

  // Auto-resize the textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      // Set new height based on scroll height (with a min of 28px and max of 56px)
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 28), 56);
      textarea.style.height = `${newHeight}px`;
    }
  }, [newMessage]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && newMessage.trim()) {
      e.preventDefault(); // Prevent default to avoid new line
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(newMessage + emojiData.emoji);
    textareaRef.current?.focus();
  };

  const emojiTheme: Theme = isDarkMode ? ("dark" as Theme) : ("light" as Theme);

  return (
    <div className="relative flex items-end w-full">
      {showEmojiPicker && (
        <div className="absolute bottom-14 left-0 mb-2 z-10 animate-fade-in">
          <EmojiPicker
            theme={emojiTheme}
            onEmojiClick={handleEmojiClick}
            width={isMobile ? 300 : 350}
            height={isMobile ? 300 : 400}
            className="border dark:border-zinc-700 rounded-lg"
          />
        </div>
      )}
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="p-2 text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 transition-colors"
      >
        <Smile size={18} className="sm:w-5 sm:h-5" />
      </button>
      <textarea
        ref={textareaRef}
        value={newMessage}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 resize-none rounded-lg border dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm sm:text-base text-gray-900 dark:text-white px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 min-h-[25px] max-h-[45px] w-full"
      />
      {newMessage.trim() && (
        <button
          onClick={handleSend}
          className="p-2 text-white bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 transition-colors rounded-md ml-2"
        >
          <Send size={18} className="sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
}