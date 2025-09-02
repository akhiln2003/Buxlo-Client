import { Iuser } from "@/@types/interface/Iuser";
import { Mail } from "lucide-react";

interface ProfileInfoProps {
  users: Partial<Iuser>;
}


const ProfileInfo = ({ users }:ProfileInfoProps) => {
  return (
    <div className="pt-16 sm:pt-20 px-4 sm:px-8 pb-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            {users.name || "User Name"}
          </h1>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-3 text-blue-500" />
            <span className="font-medium text-sm sm:text-base">
              {users.email || "email@example.com"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
