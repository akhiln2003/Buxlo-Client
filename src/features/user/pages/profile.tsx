import { useEffect, useState } from "react";
import {
  Landmark,
  WalletMinimal,
  Mail,
  NotebookPen,
  Camera,
  Settings,
  User,
  Key,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import banner from "@/assets/images/landingPageBG.jpg";
import { EditUserProfile } from "../components/EditProfileForm";
import { Iuser } from "@/@types/interface/Iuser";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { useGetUser } from "@/hooks/useGetUser";
import {
  useFetchUserProfileImageMutation,
  useFetchUserProfileMutation,
} from "@/services/apis/UserApis";
import EditProfilePhoto from "../components/EditProfilePhoto";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { ChangePasswordForm } from "@/components/ui/ChangePasswordForm";
import { ChangePasswordSchema } from "../zodeSchema/ChangePasswordSchema";
import { useChanegePasswordMutation } from "@/services/apis/CommonApis";
import { z } from "zod";

type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;

const Profile = () => {
  const [showEditData, setShowEditData] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [fetchProfileData] = useFetchUserProfileMutation();
  const [profileImage, setProfileImage] = useState("");
  const [fetchProfileImages] = useFetchUserProfileImageMutation();
  const [users, setUsers] = useState<Partial<Iuser>>({});
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [updatePassword, { isLoading: isLoadingChangePassword }] =
    useChanegePasswordMutation();

  const storUserData = useGetUser();

  const onSubmitChangePassword = async (data: ChangePasswordType) => {
    try {
      const response: IaxiosResponse = await updatePassword({
        userId: storUserData?.id as string,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (response.data) {
        successToast(
          "Password Updated",
          response.data.result.message || "Password updated successfully"
        );
        setShowChangePassword(false);
      } else {
        errorTost(
          "Update Failed",
          response.error.data.error || [
            { message: "Something went wrong please try again" },
          ]
        );
      }
    } catch (error) {
      console.error("Error updating password", error);
      errorTost("Update Failed", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response: IaxiosResponse = await fetchProfileData(
          storUserData!.id
        );
        if (response.data.data) {
          setUsers(response.data.data);
          if (response.data.data.avatar) {
            const imageUrl: IaxiosResponse = await fetchProfileImages([
              `UserProfiles/${response.data.data.avatar}`,
            ]);
            if (imageUrl.data.imageUrl) {
              setProfileImage(imageUrl.data.imageUrl[0]);
            } else {
              errorTost(
                "Image Load Failed",
                imageUrl.error.data.error || [
                  { message: `${imageUrl.error.data} please try again later` },
                ]
              );
            }
          }
        } else {
          errorTost(
            "Data Load Failed",
            response.error.data.error || [
              { message: `${response.error.data} please try again later` },
            ]
          );
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        errorTost("Data Load Failed", [
          { message: "Something went wrong please try again" },
        ]);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800 py-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
        {/* Banner Section */}
        <div className="relative h-64">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-purple-900 dark:to-blue-900">
            <div className="absolute inset-0 bg-opacity-50 bg-white dark:bg-black">
              <img
                src={banner}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Enhanced Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-zinc-700 transition-all duration-200 group">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:rotate-90 transition-transform duration-200" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Settings
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-10 mt-2 w-48 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl backdrop-blur-sm">
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

          {/* Enhanced Profile Image */}
          <div className="absolute -bottom-16 left-8 group">
            <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-700 shadow-xl">
              <img
                src={profileImage || dummyProfileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {/* Enhanced Profile Picture Edit Button */}
              <button
                onClick={() => setIsPhotoDialogOpen(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <div className="flex flex-col items-center space-y-1">
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-xs text-white font-medium">
                    Edit Photo
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {users.name || "User Name"}
              </h1>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Mail className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-medium">
                  {users.email || "email@example.com"}
                </span>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Bank Account Card */}
            <div className="bg-rose-50 dark:bg-zinc-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Landmark className="w-6 h-6 text-rose-600 dark:text-rose-300" />
                <h2 className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Bank Account
                </h2>
              </div>
              <div className="border-t border-rose-100 dark:border-zinc-600 pt-4">
                <button className="w-full py-3 border-2 border-dashed border-rose-200 dark:border-zinc-500 rounded-lg text-rose-500 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-zinc-600 transition-colors font-medium">
                  + Add Bank Account
                </button>
              </div>
            </div>

            {/* Wallet Card */}
            <div className="bg-violet-50 dark:bg-zinc-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <WalletMinimal className="w-6 h-6 text-violet-600 dark:text-violet-300" />
                <h2 className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Buxlo Wallet
                </h2>
              </div>
              <div className="border-t border-violet-100 dark:border-zinc-600 pt-4">
                <button className="w-full py-3 border-2 border-dashed border-violet-200 dark:border-zinc-500 rounded-lg text-violet-500 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-zinc-600 transition-colors font-medium">
                  + Add Wallet
                </button>
                <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
                  Wallet Not Added
                </p>
              </div>
            </div>
          </div>

          {/* Mentor Card */}
          <div className="w-full mt-8">
            <div className="bg-zinc-50 dark:bg-zinc-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <NotebookPen className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
                <h2 className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Mentors
                </h2>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-600 pt-4">
                <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
                  No mentors available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Edit Profile Dialog */}
      <Dialog open={showEditData} onOpenChange={setShowEditData}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-500" />
              <span>Edit Profile</span>
            </DialogTitle>
          </DialogHeader>
          <EditUserProfile
            setIsOpen={setShowEditData}
            setUsers={setUsers}
            users={users}
          />
        </DialogContent>
      </Dialog>

      {/* Enhanced Edit Profile Photo Dialog */}
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-purple-500" />
              <span>Edit Profile Photo</span>
            </DialogTitle>
          </DialogHeader>
          <EditProfilePhoto
            id={users.id as string}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            setIsPhotoDialogOpen={setIsPhotoDialogOpen}
            setUsers={setUsers}
            avatar={users.avatar as string}
          />
        </DialogContent>
      </Dialog>

      {/* Enhanced Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-green-500" />
              <span>Change Password</span>
            </DialogTitle>
          </DialogHeader>
          <ChangePasswordForm
            onSubmit={onSubmitChangePassword}
            isLoading={isLoadingChangePassword}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
