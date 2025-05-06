import { useEffect, useState } from "react";
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

export interface IparticipantDetails {
  avatar: string;
  createdAt: string;
  email: string;
  name: string;
  role: "mentor" | "user";
  status: boolean;
  updatedAt: string;
  id: string;
}

export interface Icontacts {
  id: string;
  participantDetails: IparticipantDetails[];
  lastMessage: string;
  unreadCount?: number;
}
export interface InewMessage {
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
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
  const [myProfile, setMyProfile] = useState("");
  const [getMessages] = useFetchMessageMutation();
  const user = useGetUser();

  const fetchContacts = async (id: string) => {
    try {
      const response: IaxiosResponse = await getContacts(id);
      if (response.data) {
        setContacts(response.data.constats);
        const avatars: string[] = response.data.constats.flatMap(
          (contact: Icontacts) =>
            contact.participantDetails.map(
              (participant: IparticipantDetails) =>
              participant.avatar ?  `MentorProfiles/${participant.avatar}` : ""
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
      fetchMyProfile();
    }
  }, [user?.id]);

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
      console.error("Error selecting chatfddsfdd:", err);
      errorTost("Something went wrong", [{ message: "Please try again" }]);
    }
  };

  return (
    <div className="flex h-screen -mt-16 pt-16 bg-gray-100 dark:bg-zinc-900">
      <ChatSidebar
        showSidebar={showSidebar}
        contacts={contacts}
        activeChat={activeChat}
        handleChatSelect={handleChatSelect}
        myProfile={myProfile}
        profileImage={profileImage}
        user={user}
      />
      <div
        className={`${
          !showSidebar ? "flex" : "hidden"
        } md:flex flex-1 flex-col`}
      >
        {activeChat ? (
          <>
            <ChatHeader
              activeChat={activeChat}
              setActiveChat={setActiveChat}
              setShowSidebar={setShowSidebar}
              profileImage={
                profileImage[
                  contacts.findIndex((contact) => contact.id === activeChat.id)
                ]
              }
            />
            <ChatMessages messages={messages} userId={user?.id as string} />
            <ChatInputContainer
              setMessages={setMessages}
              chatId={activeChat.id}
              receiverId={activeChat.participantDetails[0].id}
              senderId={user?.id as string}
            />
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 bg-gray-150 dark:bg-zinc-950 flex flex-col items-center justify-center">
            <div className="rounded-full bg-gray-200 dark:bg-zinc-800 p-4 mb-4">
              <MessageCircle
                size={32}
                className="text-gray-400 dark:text-zinc-500"
              />
            </div>
            <p className="text-gray-500 dark:text-zinc-400 text-lg font-medium">
              No messages yet
            </p>
            <p className="text-gray-400 dark:text-zinc-500 text-sm mt-2 text-center max-w-xs">
              Start the conversation by sending a message below
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
