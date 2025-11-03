import { useState } from "react";
import { Bot, Send, X } from "lucide-react"; // ✅ Added this import

interface Message {
  id: number;
  type: "bot" | "user";
  text: string;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}
// Chatbot Modal Component
function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      text: "Hey! 👋 Welcome to our financial platform. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = (): void => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: inputValue,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const botResponses: string[] = [
        "That's a great question! Our platform helps you track spending, monitor transactions, and manage your finances effortlessly.",
        "You can get started by signing up and connecting your accounts. It only takes a few minutes!",
        "We use enterprise-grade security to protect your financial data. Your privacy is our priority.",
        "Check out our dashboard to see real-time analytics and insights about your spending patterns.",
      ];
      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          text: randomResponse,
        },
      ]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
      />

      <div className="fixed bottom-6 right-6 w-full max-w-md h-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-zinc-600 to-zinc-800 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Bot size={20} className="text-zinc-600" />
            </div>
            <div>
              <p className="font-semibold text-white">Finance Assistant</p>
              <p className="text-xs text-zinc-100">Always here to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              } animate-in slide-in-from-bottom-2 fade-in duration-300`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-zinc-900 text-white rounded-br-none"
                    : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 p-4 animate-in fade-in duration-200">
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-200" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 text-gray-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 placeholder-gray-500"
              aria-label="Message input"
            />
            <button
              onClick={handleSendMessage}
              className="w-10 h-10 bg-zinc-950 hover:bg-zinc-900 rounded-lg flex items-center justify-center transition-colors hover:scale-105 active:scale-95"
              aria-label="Send message"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatbotModal;
