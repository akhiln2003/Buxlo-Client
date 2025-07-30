import { useState, useRef, useEffect, ChangeEvent, useContext } from "react";
import { Paperclip, Mic } from "lucide-react";
import { ChatAttachmentMenu } from "./ChatAttachmentMenu";
import { ChatRecordingControls } from "./ChatRecordingControls";
import { ChatTextInput } from "./ChatTextInput";
import { ChatAttachmentPreview } from "./ChatAttachmentPreview";
import { ChatCameraPreview } from "./ChatCameraPreview";
import {
  useCreateNotificationMutation,
  useSendMessageMutation,
} from "@/services/apis/CommonApis";
import { SocketContext } from "@/contexts/socketContext";
import { InewMessage } from "@/pages/chat";
import { errorTost } from "@/components/ui/tosastMessage";
import { useGetUser } from "@/hooks/useGetUser";
import sendMessageSound from "@/assets/sounds/message.mp3";

interface ChatInputProps {
  setMessages: React.Dispatch<React.SetStateAction<InewMessage[]>>;
  senderId: string;
  receiverId: string;
  chatId: string;
}

export function ChatInputContainer({
  setMessages,
  senderId,
  receiverId,
  chatId,
}: ChatInputProps) {
  const [newMessage, setNewMessage] = useState<InewMessage>({
    chatId,
    senderId,
    receiverId,
    content: "",
    contentType: "text",
    status: "sent",
    createdAt: new Date().toISOString(),
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showCameraPreview, setShowCameraPreview] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [sendMsg] = useSendMessageMutation();
  const [createNotification] = useCreateNotificationMutation();
  const socketContext = useContext(SocketContext);
  const user = useGetUser();
  const sendSoundRef = useRef<HTMLAudioElement | null>(null);

  const sendMessage = async (message: InewMessage) => {
    const formData = new FormData();
    formData.append("chatId", message.chatId);
    formData.append("senderId", message.senderId);
    formData.append("receiverId", receiverId);
    formData.append("contentType", message.contentType);
    if (message.contentType === "text") {
      formData.append("content", message.content as string);
    } else {
      formData.append("content", message.content as File | Blob);
    }
    if (message.replyTo) {
      formData.append("replyTo", message.replyTo);
    }
    try {
      const response = await sendMsg(formData).unwrap();

      setMessages((prev) => {
        const array = [...prev];
        array.pop();

        return [...array, { ...message, ...response.message }];
      });

      await sendNotification(receiverId);

      socketContext?.socket?.emit("direct_message", {
        ...message,
        ...response.message,
      });
      socketContext?.socket?.emit("chat_updated", {
        ...response.message,
      });

      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
      throw error;
    }
  };

  const sendNotification = async (receiverId: string) => {
    try {
      const response = await createNotification({
        recipient: receiverId,
        type: "message",
        message: `You have a new message from ${user?.name || "a user"}`,
        status: "unread",
      }).unwrap();
      if (response.notification) {
        socketContext?.notificationSocket?.emit("direct_notification", {
          receiverId,
          notification: response.notification,
        });
      } else {
        console.error("No notification data returned", response.error);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      errorTost("Something went wrong", [
        { message: "Please try again later" },
      ]);
    }
  };

  const handleSend = async () => {
    if (
      newMessage.content &&
      (newMessage.contentType === "text"
        ? newMessage.content
        : newMessage.content)
    ) {
      const messagePayload: InewMessage = {
        ...newMessage,
        content:
          newMessage.contentType === "text"
            ? newMessage.content
            : newMessage.content,
        status: "sent",
        createdAt: new Date().toISOString(),
      };
      try {
        setMessages((prevMessages) => [...prevMessages, messagePayload]);

        await sendMessage(messagePayload);
        playSendSound();
        resetInput();
      } catch (error) {
        console.error("Failed to send message:", error);
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg !== messagePayload)
        );
      }
    }
  };

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    type: InewMessage["contentType"]
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const messagePayload: InewMessage = {
        chatId,
        senderId,
        receiverId,
        content: file,
        contentType: type,
        status: "sent",
        createdAt: new Date().toISOString(),
      };
      try {
        setMessages((prevMessages) => [...prevMessages, messagePayload]);
        await sendMessage(messagePayload);
        playSendSound();
        resetInput();
      } catch (error) {
        console.error("Failed to upload file:", error);
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg !== messagePayload)
        );
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) =>
        audioChunksRef.current.push(event.data);
      mediaRecorder.start();
      setIsRecording(true);
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      mediaRecorder.onstop = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        stream.getTracks().forEach((track) => track.stop());
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to record audio.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      const startTime = Date.now() - recordingDuration * 1000;
      timerRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
  };

  const stopAndSendRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const messagePayload: InewMessage = {
          chatId,
          senderId,
          receiverId,
          content: audioBlob,
          contentType: "audio",
          status: "sent",
          createdAt: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, messagePayload]);
        sendMessage(messagePayload);
        resetInput();
      };
    }
  };

  const deleteRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      resetInput();
    }
  };

  const handleVoiceRecording = () => {
    if (!isRecording) {
      setShowEmojiPicker(false);
      setShowAttachmentMenu(false);
      startRecording();
    }
  };

  const resetInput = () => {
    setNewMessage({
      chatId,
      senderId,
      receiverId,
      content: "",
      contentType: "text",
      status: "sent",
      createdAt: new Date().toISOString(),
    });
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
    setIsRecording(false);
    setIsPaused(false);
    setRecordingDuration(0);
    setPreviewFile(null);
    setShowCameraPreview(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSendAttachment = (file: File) => {
    const messagePayload: InewMessage = {
      chatId,
      senderId,
      receiverId,
      content: file,
      contentType: file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("video")
        ? "video"
        : "document",
      status: "sent",
      createdAt: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, messagePayload]);
    sendMessage(messagePayload);
    setPreviewFile(null);
    playSendSound();
    resetInput();
  };
  const playSendSound = () => {
    if (sendSoundRef.current) {
      sendSoundRef.current.currentTime = 0; // rewind to start
      sendSoundRef.current.play().catch((err) => {
        console.warn("Send sound failed:", err);
      });
    }
  };

  useEffect(() => {
    if (
      showEmojiPicker ||
      isRecording ||
      (typeof newMessage.content === "string" && newMessage.content.trim())
    ) {
      setShowAttachmentMenu(false);
    }
  }, [showEmojiPicker, isRecording, newMessage.content]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    sendSoundRef.current = new Audio(sendMessageSound);
  }, []);

  return (
    <div className="relative flex items-center space-x-2 p-2 sm:p-3 bg-gray-100 dark:bg-zinc-800 border-t dark:border-zinc-700 sticky bottom-0 z-10">
      <button
        onClick={() => {
          setShowAttachmentMenu(!showAttachmentMenu);
          setShowEmojiPicker(false);
        }}
        className="p-2 text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 transition-colors"
      >
        <Paperclip size={20} />
      </button>
      <ChatAttachmentMenu
        showAttachmentMenu={showAttachmentMenu}
        handleFileUpload={handleFileUpload}
        onCameraClick={() => {
          setShowCameraPreview(true);
          setShowAttachmentMenu(false);
        }}
      />
      {showCameraPreview && (
        <ChatCameraPreview
          isOpen={showCameraPreview}
          onSend={handleSendAttachment}
          onClose={() => setShowCameraPreview(false)}
        />
      )}
      {previewFile && (
        <ChatAttachmentPreview
          file={previewFile}
          onSend={handleSendAttachment}
          onClose={() => setPreviewFile(null)}
        />
      )}
      {isRecording ? (
        <ChatRecordingControls
          isPaused={isPaused}
          recordingDuration={recordingDuration}
          pauseRecording={pauseRecording}
          resumeRecording={resumeRecording}
          deleteRecording={deleteRecording}
          stopAndSendRecording={stopAndSendRecording}
        />
      ) : (
        <>
          <ChatTextInput
            newMessage={newMessage.content as string}
            setNewMessage={(content) =>
              setNewMessage({ ...newMessage, content, status: "sent" })
            }
            handleSend={handleSend}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            isMobile={isMobile}
          />
          {!newMessage.content && (
            <button
              onClick={handleVoiceRecording}
              className="p-2 text-white dark:text-zinc-400 bg-blue-500 hover:bg-blue-600 dark:hover:text-zinc-200 transition-colors rounded-md"
            >
              <Mic size={20} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
