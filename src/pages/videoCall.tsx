import { Mic,  VideoOff, Voicemail } from "lucide-react";
import { useState } from "react";

const VideoCall = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleContainerClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <div
    className="w-full h-screen  flex flex-col justify-center items-center"
    onClick={handleContainerClick}
  >
    <div className="w-3/4 h-4/5 bg-zinc-200 dark:bg-zinc-800 rounded-md p-3">
      <div className="w-full h-4/5 flex items-start justify-end">
        <div className="w-3/12 h-2/6 bg-black rounded-lg mb-2"></div>
      </div>

      <div className="w-full h-1/5 flex justify-center">
        {isClicked && ( // Only show the button divs when clicked
          <div className="min-w-fit  h-16 px-5 flex justify-center items-center rounded-full space-x-5 bg-zinc-300 dark:bg-zinc-900">
            {/* Mic Button */}
            <div className="relative group">
              <div className="w-12 h-12 rounded-full flex justify-center items-center bg-zinc-300 dark:bg-zinc-800 hover:bg-gray-400 dark:hover:bg-gray-600">
                <Mic />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 hidden group-hover:flex items-center justify-center bg-zinc-600 text-white text-sm rounded-md px-2 py-1 whitespace-nowrap">
                Mute/Unmute
              </div>
            </div>

            {/* Call Cut Button */}
            <div className="relative group">
              <div
                style={{ backgroundColor: "rgb(255, 0, 0)" }}
                className="w-12 h-12 rounded-full flex justify-center items-center hover:brightness-90"
              >
                <Voicemail className="transform rotate-180" color="white" />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 hidden group-hover:flex items-center justify-center bg-zinc-600 text-white text-sm rounded-md px-2 py-1 whitespace-nowrap">
                End Call
              </div>
            </div>

            {/* Video Off Button */}
            <div className="relative group">
              <div className="w-12 h-12 rounded-full flex justify-center items-center bg-zinc-300 dark:bg-zinc-800 hover:bg-gray-400 dark:hover:bg-gray-600">
                <VideoOff />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 hidden group-hover:flex items-center justify-center bg-zinc-600 text-white text-sm rounded-md px-2 py-1 whitespace-nowrap">
                Turn Off Video
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default VideoCall;