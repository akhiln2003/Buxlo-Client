import { Mic, Play, Pause, Trash2, Send } from "lucide-react";

interface RecordingControlsProps {
  isPaused: boolean;
  recordingDuration: number;
  pauseRecording: () => void;
  resumeRecording: () => void;
  deleteRecording: () => void;
  stopAndSendRecording: () => void;
}

export function ChatRecordingControls({
  isPaused,
  recordingDuration,
  pauseRecording,
  resumeRecording,
  deleteRecording,
  stopAndSendRecording,
}: RecordingControlsProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-between w-full  bg-white dark:bg-zinc-700 rounded-lg shadow-md animate-slide-up">
      <div className="flex items-center space-x-2">
        <Mic size={20} className="text-red-500 animate-pulse" />
        <span className="text-sm font-semibold dark:text-white">
          {formatDuration(recordingDuration)}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={isPaused ? resumeRecording : pauseRecording}
          className="p-1 text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200 transition-colors"
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </button>
        <button
          onClick={deleteRecording}
          className="p-1 text-red-500 hover:text-red-600 transition-colors"
        >
          <Trash2 size={20} />
        </button>
        <button
          onClick={stopAndSendRecording}
          className="py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}