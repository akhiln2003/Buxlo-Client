import { Landmark, Pencil, WalletMinimal, Mail, Phone, NotebookPen } from "lucide-react";
import profileImage from "@/assets/images/dummy-profile.webp";
import banner from '@/assets/images/logoBlack-.png'
const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800 py-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
        {/* Banner Section */}
        <div className="relative h-64">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-purple-900 dark:to-blue-900">
            <div className="absolute inset-0 bg-opacity-50 bg-white dark:bg-black">
            <img
                src={banner}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Image */}
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-700 shadow-lg">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Edit Button */}
          <button className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-zinc-800/80 rounded-full shadow-md hover:bg-white dark:hover:bg-zinc-700 transition-colors">
            <Pencil className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              AKHIL
            </h1>

            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Mail className="w-5 h-5 mr-3" />
                <span className="font-medium">username@email.com</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Phone className="w-5 h-5 mr-3" />
                <span className="font-medium">1234567890</span>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Bank Account Card */}
            <div className="bg-rose-50 dark:bg-zinc-700 rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <Landmark className="w-6 h-6 text-rose-600 dark:text-rose-300" />
                <h2 className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Bank Account
                </h2>
              </div>
              <div className="border-t border-rose-100 dark:border-zinc-600 pt-4">
                <button className="w-full py-3 border-2 border-dashed border-rose-200 dark:border-zinc-500 rounded-lg text-rose-500 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-zinc-600 transition-colors">
                  + Add Bank Account
                </button>
              </div>
            </div>

            {/* Wallet Card */}
            <div className="bg-violet-50 dark:bg-zinc-700 rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <WalletMinimal className="w-6 h-6 text-violet-600 dark:text-violet-300" />
                <h2 className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Buxlo Wallet
                </h2>
              </div>
              <div className="border-t border-violet-100 dark:border-zinc-600 pt-4">
                <button className="w-full py-3 border-2 border-dashed border-violet-200 dark:border-zinc-500 rounded-lg text-violet-500 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-zinc-600 transition-colors">
                  + Add Wallet
                </button>
                <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
                  Wallet Not Added
                </p>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="w-full mt-8">
            {/*Mentor Card */}
            <div className="bg-zinc-50 dark:bg-zinc-700 rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <NotebookPen className="w-6 h-6 text-zinc-600 dark:text-zinc-50" />
                <h2 className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Mentors
                </h2>
              </div>
              <div className="border-t border-violet-100 dark:border-zinc-600 pt-4">
               
                <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
                  Mentor Not available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
