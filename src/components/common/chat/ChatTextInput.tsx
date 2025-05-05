import { KeyboardEvent, useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode } = useTheme();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newMessage.trim()) {
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(newMessage + emojiData.emoji);
    inputRef.current?.focus();
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
      <div className="relative flex-grow bg-white dark:bg-zinc-700 rounded-lg">
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowEmojiPicker(false)}
          placeholder="Type a message..."
          className="w-full px-10 py-2 rounded-lg border-none focus:outline-none focus:ring-0 dark:text-white bg-transparent"
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 transition-colors"
        >
          {showEmojiPicker ? <X size={20} /> : <Smile size={20} />}
        </button>
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
}