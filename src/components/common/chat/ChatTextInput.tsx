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
      // Set new height based on scroll height (with a min of 40px and max of 120px)
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 120);
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
    <>
      {showEmojiPicker && (
        <div className="absolute bottom-14 left-0 mb-2 z-10 animate-fade-in">
          <EmojiPicker
            theme={emojiTheme}
            onEmojiClick={handleEmojiClick}
            width={350}
            height={isMobile ? 300 : 400}
          />
        </div>
      )}
      <div className="relative flex-grow flex items-center bg-white dark:bg-zinc-700 rounded-lg">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 transition-colors"
        >
          {showEmojiPicker ? <X size={20} /> : <Smile size={20} />}
        </button>
        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowEmojiPicker(false)}
          placeholder="Type a message..."
          rows={1}
          className="w-full px-10 py-2 resize-none overflow-hidden rounded-lg border-none focus:outline-none focus:ring-0 dark:text-white bg-transparent"
          style={{
            maxHeight: "120px",
            minHeight: "40px",
          }}
        />
      </div>
      {newMessage.trim() && (
        <button
          onClick={handleSend}
          className="py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          <Send size={20} />
        </button>
      )}
    </>
  );
};