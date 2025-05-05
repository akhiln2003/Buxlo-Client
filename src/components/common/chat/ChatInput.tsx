import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Paperclip, Mic } from "lucide-react";
import { ChatAttachmentMenu } from "./ChatAttachmentMenu";
import { ChatRecordingControls } from "./ChatRecordingControls";
import { ChatTextInput } from "./ChatTextInput";
import { InewMessage } from "@/pages/chat";
import { ChatAttachmentPreview } from "./ChatAttachmentPreview";
import { ChatCameraPreview } from "./ChatCameraPreview";
import { useSendMessageMutation } from "@/services/apis/CommonApis";

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
  const [newMessage, setNewMessage] = useState<InewMessage >({
    chatId,
    senderId,
    receiverId,
    content: "",
    contentType: "text",
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sendMessage = async (message: InewMessage) => {
    const formData = new FormData();
    formData.append("chatId", message.chatId);
    formData.append("senderId", message.senderId);
    formData.append("receiverId", message.receiverId);
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
      
      const response = await sendMsg(formData);
      // resetInput();
      console.log("Message sent successfully:", response);
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
      throw error;
    }
  };

  const handleSend = async () => {
    if (newMessage.content && (newMessage.content as string).trim()) {
      const messagePayload = {
        ...newMessage,
        content: (newMessage.content as string).trim(),
      };
      try {
        // Append the new message to the existing array
        setMessages((prevMessages) => [...prevMessages, messagePayload]);
        await sendMessage(messagePayload);
        resetInput();
      } catch (error) {
        console.error("Failed to send message:", error);
        // Optionally revert optimistic update
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
      };
      try {
        // Append the new message
        setMessages((prevMessages) => [...prevMessages, messagePayload]);
        await sendMessage(messagePayload);
        resetInput();
      } catch (error) {
        console.error("Failed to upload file:", error);
        // Optionally revert optimistic update
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
          type: "audio/mp3",
        });
        const messagePayload: InewMessage = {
          chatId,
          senderId,
          receiverId,
          content: audioBlob,
          contentType: "audio",
        };
        // Append the new message
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
    };
    // Append the new message
    setMessages((prevMessages) => [...prevMessages, messagePayload]);
    sendMessage(messagePayload);
    setPreviewFile(null);
    resetInput();
  };

  return (
    <div className="relative flex items-center space-x-2 p-2 bg-gray-100 dark:bg-zinc-800 border-t dark:border-zinc-700">
      <button
        onClick={() => {
          setShowAttachmentMenu(!showAttachmentMenu);
          setShowEmojiPicker(false);
        }}
        className="p-2 text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 transition-colors"
      >
        <Paperclip size={24} />
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
              setNewMessage({ ...newMessage, content })
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
              <Mic size={24} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
