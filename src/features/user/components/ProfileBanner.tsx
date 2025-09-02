import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import banner from "@/assets/images/landingPageBG.jpg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { Camera, Key, Settings, User } from "lucide-react";

interface ProfileBannerProps {
  setShowEditData: (value: boolean) => void;
  setShowChangePassword: (value: boolean) => void;
  setIsPhotoDialogOpen: (value: boolean) => void;
  profileImage: string;
}

const ProfileBanner = ({
  setShowEditData,
  setShowChangePassword,
  setIsPhotoDialogOpen,
  profileImage,
}: ProfileBannerProps) => {
  return (
    <div className="relative h-48 sm:h-64">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-purple-900 dark:to-blue-900">
        <div className="absolute inset-0 bg-opacity-50 bg-white dark:bg-black">
          <img
            src={banner}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-2 sm:px-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-zinc-700 transition-all duration-200 group">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300 group-hover:rotate-90 transition-transform duration-200" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
              Settings
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4 sm:mr-10 mt-2 w-48 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl backdrop-blur-sm">
          <DropdownMenuItem
            className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors first:rounded-t-lg"
            onClick={() => setShowEditData(true)}
          >
            <User className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Edit Profile
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 border-t border-gray-200 dark:border-zinc-700" />
          <DropdownMenuItem
            onClick={() => setShowChangePassword(true)}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors last:rounded-b-lg"
          >
            <Key className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Change Password
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8 group">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-700 shadow-xl">
          <img
            src={profileImage || dummyProfileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setIsPhotoDialogOpen(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <div className="flex flex-col items-center space-y-1">
              <Camera className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              <span className="text-xs text-white font-medium">Edit Photo</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
