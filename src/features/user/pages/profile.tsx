import { useEffect, useState } from "react";
import {
  Landmark,
  Pencil,
  WalletMinimal,
  Mail,
  Phone,
  NotebookPen,
  Camera,
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
import { errorTost } from "@/components/ui/tosastMessage";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { useGetUser } from "@/hooks/useGetUser";
import { useFetchUserProfileImageMutation, useFetchUserProfileMutation } from "@/services/apis/UserApis";
import EditProfilePhoto from "../components/EditProfilePhoto";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
// import EditProfileBanner from "../components/EditProfileBanner";

const Profile = () => {
  const [showEditData, setShowEditData] = useState(false);
  // const [showEditBanner, setShowEditBanner] = useState(false);
  const [fetchProfileData] = useFetchUserProfileMutation();
  const [profileImage, setProfileImage] = useState("");
  const [fetchProfileImages] = useFetchUserProfileImageMutation();
  const [users, setUsers] = useState<Partial<Iuser>>({});
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);

  const storUserData = useGetUser();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response: IaxiosResponse = await fetchProfileData(
          storUserData!.id
        );
        if (response.data.data) {
          setUsers(response.data.data);
          if (response.data.data.avatar) {            
            const imageUrl: IaxiosResponse = await fetchProfileImages(
              [`UserProfiles/${response.data.data.avatar}`] 
            );            
            if (imageUrl.data.imageUrl) {
              setProfileImage(imageUrl.data.imageUrl[0]);
              console.log(imageUrl.data.imageUrl[0]);
              
            } else {
              
              errorTost(
                "Something went wrong ",
                imageUrl.error.data.error || [
                  { message: `${imageUrl.error.data} please try again later` },
                ]
              );
            }
          }
        } else {
          errorTost(
            "Something went wrong ",
            response.error.data.error || [
              { message: `${response.error.data} please try again later` },
            ]
          );
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        errorTost("Something wrong", [
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
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Banner Edit Button */}
          {/* <button
            onClick={() => setShowEditBanner(true)}
            className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-zinc-800/80 rounded-full shadow-md hover:bg-white dark:hover:bg-zinc-700 transition-colors"
          >
            <Camera className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button> */}

          {/* Profile Image */}
          <div className="absolute -bottom-16 left-8 group">
            <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-700 shadow-lg">
              <img
                src={profileImage ? profileImage : dummyProfileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {/* Profile Picture Edit Button */}
              <button
                onClick={() => setIsPhotoDialogOpen(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {users.name}
              </h1>
              {/* Edit Profile Button */}
              <button
                onClick={() => setShowEditData(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-zinc-700 rounded-lg hover:bg-purple-100 dark:hover:bg-zinc-600 transition-colors"
              >
                <Pencil className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                  Edit Profile
                </span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Mail className="w-5 h-5 mr-3" />
                <span className="font-medium">{users.email}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Phone className="w-5 h-5 mr-3" />
                <span className="font-medium">{9098777650}</span>
              </div>
            </div>
          </div>

          {/* Rest of the component remains the same */}
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

          {/* Mentor Card */}
          <div className="w-full mt-8">
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

      {/* Edit Profile Dialog */}
      <Dialog open={showEditData} onOpenChange={setShowEditData}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <EditUserProfile
            setIsOpen={setShowEditData}
            setUsers={setUsers}
            users={users}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Profile Photo */}
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
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

      {/* Edit Profile Banner */}
      {/* <Dialog open={showEditBanner} onOpenChange={setShowEditBanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <EditProfileBanner
            id={user?.id as string}
            profileImage=""
            setShowEditImage={setShowEditImage}
          />
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default Profile;
