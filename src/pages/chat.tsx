import { useContext, useEffect, useState } from "react";
import { useGetUser } from "@/hooks/useGetUser";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";
import {
  useFetchContactsMutation,
  useFetchUserProfileImageMutation,
} from "@/services/apis/UserApis";
import { useFetchMentorProfileImageMutation } from "@/services/apis/MentorApis";
import { USER_ROLE } from "@/@types/userRoleEnum";
import { ChatSidebar } from "@/components/common/chat/ChatSidebar";
import { ChatHeader } from "@/components/common/chat/ChatHeader";
import { ChatMessages } from "@/components/common/chat/ChatMessages";
import { ChatInputContainer } from "@/components/common/chat/ChatInput";
import { useFetchMessageMutation } from "@/services/apis/CommonApis";
import { MessageCircle } from "lucide-react";
import { SocketContext } from "@/contexts/socketContext";

// Interfaces remain unchanged
export interface IparticipantDetails {
  avatar: string;
  createdAt: string;
  email: string;
  name: string;
  role: "mentor" | "user";
  status: boolean;
  updatedAt: string;
  _id: string;
}

export interface Icontacts {
  id: string;
  participantDetails: IparticipantDetails[];
  lastMessage: string;
  unreadCount?: number;
}

// src/@types/InewMessage.ts
export interface InewMessage {
  createdAt: string | number | Date;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string | File | Blob;
  contentType: "text" | "image" | "video" | "audio" | "document";
  status: "sent" | "delivered" | "received" | "read";
  deleted?: "me" | "everyone";
  replyTo?: string;
  id?: string;
}

export default function Chat() {
  const [activeChat, setActiveChat] = useState<Icontacts | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [messages, setMessages] = useState<InewMessage[]>([]);
  const [contacts, setContacts] = useState<Icontacts[]>([]);
  const [getContacts] = useFetchContactsMutation();
  const [fetchMentorProfileImages] = useFetchMentorProfileImageMutation();
  const [fetchUserProfileImages] = useFetchUserProfileImageMutation();
  const [profileImage, setProfileImage] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [myProfile, setMyProfile] = useState("");
  const [getMessages] = useFetchMessageMutation();
  const user = useGetUser();
  const socketContext = useContext(SocketContext);

  const fetchContacts = async (id: string) => {
    try {
      const response: IaxiosResponse = await getContacts(id);
      if (response.data) {
        setContacts(response.data.constats);
        const avatars: string[] = response.data.constats.flatMap(
          (contact: Icontacts) =>
            contact.participantDetails.map((participant: IparticipantDetails) =>
              participant.avatar
                ? participant.role == USER_ROLE.MENTOR
                  ? `MentorProfiles/${participant.avatar}`
                  : `UserProfiles/${participant.avatar}`
                : ""
            )
        );
        if (avatars.length) {
          const imageUrl: IaxiosResponse = await fetchMentorProfileImages(
            avatars
          );
          if (imageUrl.data) {
            setProfileImage(imageUrl.data.imageUrl);
          } else {
            errorTost(
              "Something went wrong",
              imageUrl.error.data.error || [
                { message: "Please try again later" },
              ]
            );
          }
        }
      } else {
        errorTost(
          "Something went wrong",
          response.error.data.error || [{ message: "Please try again later" }]
        );
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
      errorTost("Something went wrong", [{ message: "Please try again" }]);
    }
  };

  const fetchMyProfile = async () => {
    try {
      const imageUrl: IaxiosResponse =
        user?.role === USER_ROLE.MENTOR
          ? await fetchMentorProfileImages([`MentorProfiles/${user?.avatar}`])
          : await fetchUserProfileImages([`UserProfiles/${user?.avatar}`]);

      if (imageUrl.data) {
        setMyProfile(imageUrl.data.imageUrl[0]);
      } else {
        errorTost(
          "Something went wrong",
          imageUrl.error.data.error || [{ message: "Please try again later" }]
        );
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      errorTost("Something went wrong", [{ message: "Please try again" }]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchContacts(user.id as string);
      if (user.avatar) {
        fetchMyProfile();
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (socketContext?.socket?.connected) {
      socketContext.socket.emit("active_user", user?.id as string);
      socketContext.socket.emit("online", user?.id as string);
    }
    socketContext?.socket?.on("active_user", (data) => {
      setOnlineUsers(new Set(data));
    });
    socketContext?.socket?.on("online", ({ userId }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });
    socketContext?.socket?.on("leave", (userId: string) => {
      setOnlineUsers((prev) => {
        const updatedUsers = new Set(prev);
        updatedUsers.delete(userId);
        return updatedUsers;
      });
    });

    return () => {
      socketContext?.socket?.emit("leave", user?.id as string);
      socketContext?.socket?.on("leave", (userId: string) => {
        setOnlineUsers((prev) => {
          const updatedUsers = new Set(prev);
          updatedUsers.delete(userId);
          return updatedUsers;
        });
      });

      socketContext?.socket?.off("active_user");
      socketContext?.socket?.off("online");
    };
  }, [socketContext?.socket?.connected]);

  const handleChatSelect = async (contact: Icontacts) => {
    try {
      setActiveChat(contact);
      const response: IaxiosResponse = await getMessages(contact.id);
      if (response.data) {
        setMessages(response.data.messages);
      } else {
        errorTost(
          "Something went wrong",
          response.error.data.error || [{ message: "Please try again later" }]
        );
      }
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    } catch (err) {
      console.error("Error selecting chat:", err);
      errorTost("Something went wrong", [{ message: "Please try again" }]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100 dark:bg-zinc-900">
      <ChatSidebar
        showSidebar={showSidebar}
        onlineUsers={onlineUsers}
        contacts={contacts}
        activeChat={activeChat}
        handleChatSelect={handleChatSelect}
        myProfile={myProfile}
        profileImage={profileImage}
        user={user}
      />
      <div
        className={`flex-1 flex flex-col w-full transition-all duration-300 ${
          showSidebar ? "hidden md:flex" : "flex"
        }`}
      >
        {activeChat ? (
          <div className="flex flex-col h-full">
            <ChatHeader
              activeChat={activeChat}
              onlineUsers={onlineUsers}
              setActiveChat={setActiveChat}
              setShowSidebar={setShowSidebar}
              profileImage={
                profileImage[
                  contacts.findIndex((contact) => contact.id === activeChat.id)
                ]
              }
            />
            <div className="flex-1 overflow-y-auto">
              <ChatMessages
                messages={messages}
                setMessages={setMessages}
                userId={user?.id as string}
                receiverId={activeChat.participantDetails[0]._id}
              />
            </div>
            <ChatInputContainer
              setMessages={setMessages}
              chatId={activeChat.id}
              receiverId={activeChat.participantDetails[0]._id}
              senderId={user?.id as string}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-150 dark:bg-zinc-950">
            <div className="rounded-full bg-gray-200 dark:bg-zinc-800 p-4 mb-4">
              <MessageCircle
                size={32}
                className="text-gray-400 dark:text-zinc-500"
              />
            </div>
            <p className="text-gray-500 dark:text-zinc-400 text-base sm:text-lg font-medium">
              No messages yet
            </p>
            <p className="text-gray-400 dark:text-zinc-500 text-xs sm:text-sm mt-2 text-center max-w-xs">
              Start the conversation by sending a message below
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
