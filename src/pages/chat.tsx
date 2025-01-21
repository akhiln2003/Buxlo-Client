import { useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
} from "lucide-react";

export default function Chat() {
  const [activeChat, setActiveChat] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const contacts = [
    {
      id: 0,
      name: "Sarah Parker",
      status: "online",
      avatar: "/api/placeholder/48/48",
      unread: 2,
      lastMessage: "Sure! I can show you tomorrow during lunch.",
    },
    {
      id: 1,
      name: "John Developer",
      status: "online",
      avatar: "/api/placeholder/48/48",
      unread: 0,
      lastMessage: "The new feature is ready for review",
    },
    {
      id: 2,
      name: "Design Team",
      status: "offline",
      avatar: "/api/placeholder/48/48",
      unread: 5,
      lastMessage: "Updated the wireframes for homepage",
    },
    {
      id: 3,
      name: "Alex Marketing",
      status: "online",
      avatar: "/api/placeholder/48/48",
      unread: 0,
      lastMessage: "Campaign stats look great!",
    },
    {
      id: 0,
      name: "Sarah Parker",
      status: "online",
      avatar: "/api/placeholder/48/48",
      unread: 2,
      lastMessage: "Sure! I can show you tomorrow during lunch.",
    },
    {
      id: 1,
      name: "John Developer",
      status: "online",
      avatar: "/api/placeholder/48/48",
      unread: 0,
      lastMessage: "The new feature is ready for review",
    },
    {
      id: 2,
      name: "Design Team",
      status: "offline",
      avatar: "/api/placeholder/48/48",
      unread: 5,
      lastMessage: "Updated the wireframes for homepage",
    },
    {
      id: 3,
      name: "Alex Marketing",
      status: "online",
      avatar: "/api/placeholder/48/48",
      unread: 0,
      lastMessage: "Campaign stats look great!",
    },
    {
      id: 0,
      name: "Sarah Parker",
      status: "online",
      avatar: "/api/placeholder/48/48",
      unread: 2,
      lastMessage: "Sure! I can show you tomorrow during lunch.",
    },
    {
      id: 1,
      name: "John Developer",
      status: "online",
      avatar: "/api/placeholder/48/48",
      unread: 0,
      lastMessage: "The new feature is ready for review",
    },
    {
      id: 2,
      name: "Design Team",
      status: "offline",
      avatar: "/api/placeholder/48/48",
      unread: 5,
      lastMessage: "Updated the wireframes for homepage",
    },
    {
      id: 3,
      name: "Alex Marketing",
      status: "online",
      avatar: "/api/placeholder/48/48",
      unread: 0,
      lastMessage: "Campaign stats look great!",
    },
  ];

  const messages = [
    { id: 1, text: "Hey! How are you?", sender: "other", time: "09:30" },
    {
      id: 2,
      text: "I'm doing great! Just finished the project we discussed last week.",
      sender: "self",
      time: "09:31",
    },
    {
      id: 3,
      text: "That's awesome! Would love to see it sometime. Could you share some screenshots?",
      sender: "other",
      time: "09:32",
    },
    {
      id: 4,
      text: "Sure! I can show you tomorrow during lunch. I've added some new features you might like.",
      sender: "self",
      time: "09:33",
    },
  ];

  const handleSend = () => {
    if (newMessage.trim()) {
      setNewMessage("");
    }
  };

  const handleChatSelect = (id) => {
    setActiveChat(id);
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  return (
    <div className="flex h-screen -mt-16 pt-16 bg-gray-100 dark:bg-zinc-900">
      {/* Sidebar - Increased width and adjusted dark mode */}
      <div
        className={`${
          showSidebar ? "flex" : "hidden"
        } md:flex w-full md:w-96 bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 flex-col absolute md:relative z-10`}
      >
        {/* User Profile */}
        <div className="p-4 border-b dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/api/placeholder/40/40"
                alt="Your Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Your Name
                </h2>
                <span className="text-sm text-gray-500 dark:text-zinc-400">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search - Improved dark mode */}
        <div className="p-4 border-b dark:border-zinc-800">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:border-zinc-700 dark:focus:border-zinc-600"
            />
            <Search className="w-5 h-5 text-gray-500 dark:text-zinc-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Conversations List - Improved dark mode and reduced text size */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleChatSelect(contact.id)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                activeChat === contact.id ? "bg-blue-50 dark:bg-zinc-800" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                    contact.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                {" "}
                {/* Added min-w-0 to prevent text overflow */}
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {contact.name}
                  </h3>
                  {contact.unread > 0 && (
                    <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs ml-2 flex-shrink-0">
                      {contact.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area - Improved dark mode */}
      <div
        className={`${
          !showSidebar ? "flex" : "hidden"
        } md:flex flex-1 flex-col`}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img
              src={contacts[activeChat].avatar}
              alt=""
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {contacts[activeChat].name}
              </h2>
              <span className="text-sm text-gray-500 dark:text-zinc-400">
                {contacts[activeChat].status}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            <Phone className="w-5 h-5 text-gray-500 dark:text-zinc-400 cursor-pointer hover:text-gray-700 dark:hover:text-zinc-300 hidden md:block" />
            <Video className="w-5 h-5 text-gray-500 dark:text-zinc-400 cursor-pointer hover:text-gray-700 dark:hover:text-zinc-300 hidden md:block" />
            {/* <Search className="w-5 h-5 text-gray-500 dark:text-zinc-400 cursor-pointer hover:text-gray-700 dark:hover:text-zinc-300" /> */}
            {/* <MoreVertical className="w-5 h-5 text-gray-500 dark:text-zinc-400 cursor-pointer hover:text-gray-700 dark:hover:text-zinc-300" /> */}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-gray-50 dark:bg-zinc-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "self" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] md:max-w-xl px-4 md:px-6 py-2 md:py-3 rounded-lg ${
                  message.sender === "self"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-white rounded-bl-none shadow"
                }`}
              >
                <p className="text-sm md:text-base">{message.text}</p>
                <span
                  className={`text-xs ${
                    message.sender === "self"
                      ? "text-blue-100"
                      : "text-gray-500 dark:text-zinc-400"
                  } block mt-2`}
                >
                  {message.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-4 bg-white dark:bg-zinc-900 border-t dark:border-zinc-800">
  <div className="flex items-center space-x-2 md:space-x-4">
    <button className="text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 hidden md:block">
      <Smile className="w-5 h-5" />
    </button>

    {/* Input with Paperclip Icon */}
    <div className="relative flex-1">
      <input
        type="text"
        placeholder="Type a message..."
        className="w-full pl-10 pr-3 md:pl-12 md:px-4 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-sm md:text-base"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      />
      <button className="absolute left-3 top-3 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300">
        <Paperclip className="w-5 h-5" />
      </button>
    </div>

    <button
      onClick={handleSend}
      className="bg-blue-500 text-white rounded-lg px-3 md:px-4 py-2 hover:bg-blue-600 flex items-center space-x-2"
    >
      <Send className="w-4 h-4" />
    </button>
  </div>
</div>

      </div>
    </div>
  );
}
