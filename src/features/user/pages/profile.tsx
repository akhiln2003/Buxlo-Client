import { useEffect, useState } from "react";
import { Camera, User, Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditUserProfile } from "../components/EditProfileForm";
import { IUser } from "@/@types/interface/IUser";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { useGetUser } from "@/hooks/useGetUser";
import {
  useFetchUserProfileImageMutation,
  useFetchUserProfileMutation,
} from "@/services/apis/UserApis";
import EditProfilePhoto from "../components/EditProfilePhoto";

import { ChangePasswordForm } from "@/components/ui/ChangePasswordForm";
import { ChangePasswordSchema } from "../zodeSchema/ChangePasswordSchema";
import {
  useChanegePasswordMutation,
  useFetchSubscriptionPlanByIdMutation,
} from "@/services/apis/CommonApis";
import { z } from "zod";
import SubscriptionModal from "@/components/common/subscription/SubscriptionModal";
import ProfileBanner from "../components/ProfileBanner";
import ProfileInfo from "../components/ProfileInfo";
import SubscriptionCard from "../components/SubscriptionCard";
import WalletCard from "../components/WalletCard";
import MentorCard from "../components/MentorCard";
import { ISubscription } from "@/@types/interface/ISubscription";

type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;

const Profile = () => {
  const [showEditData, setShowEditData] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [fetchProfileData] = useFetchUserProfileMutation();
  const [profileImage, setProfileImage] = useState("");
  const [subscription, setSubscription] = useState<ISubscription>({
    duration: 0,
    offer: 0,
    price: 0,
    type: "",
  });
  const [fetchProfileImages] = useFetchUserProfileImageMutation();
  const [users, setUsers] = useState<Partial<IUser>>({});
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [updatePassword, { isLoading: isLoadingChangePassword }] =
    useChanegePasswordMutation();
  const [fetchSubscriptionData, { isLoading: fetchSubscriptionIsloading }] =
    useFetchSubscriptionPlanByIdMutation();
  const storUserData = useGetUser();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] =
    useState<boolean>(false);

  const onSubmitChangePassword = async (data: ChangePasswordType) => {
    try {
      const response: IAxiosResponse = await updatePassword({
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
        const response: IAxiosResponse = await fetchProfileData(
          storUserData!.id
        );
        if (response.data.data) {
          setUsers(response.data.data);
          if (response.data.data.avatar) {
            const imageUrl: IAxiosResponse = await fetchProfileImages([
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

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (!users.premiumId) return;
        const response: IAxiosResponse = await fetchSubscriptionData(
          users.premiumId
        );

        if (response.data) {
          setSubscription(response.data);
        } else {
          errorTost(
            "Subscription Load Failed",
            response.error.data.error || [
              { message: `${response.error.data} please try again later` },
            ]
          );
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
        errorTost("Data Load Failed", [
          { message: "Something went wrong please try again" },
        ]);
      }
    };

    fetchSubscription();
  }, [users.premiumId]);

  const handleSubscriptionClick = (): void => {
    setIsSubscriptionModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPlanTypeDisplay = (type: string) => {
    switch (type) {
      case "Day":
        return "Daily Plan";
      case "Month":
        return "Monthly Plan";
      case "Year":
        return "Yearly Plan";
      default:
        return "Premium Plan";
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case "Day":
        return "from-green-500 to-emerald-600";
      case "Month":
        return "from-blue-500 to-indigo-600";
      case "Year":
        return "from-purple-500 to-violet-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const isSubscriptionActive = () => {
    if (!users.premiumEndDate) return false;
    return new Date(users.premiumEndDate) > new Date();
  };

  const getTimeRemaining = () => {
    if (!users.premiumEndDate) return null;
    const endDate = new Date(users.premiumEndDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return diffDays === 1 ? "1 day remaining" : `${diffDays} days remaining`;
    }
    return "Expired";
  };

  const getPlanFeatures = (type: string) => {
    switch (type) {
      case "Day":
        return [
          "24-hour premium access",
          "Priority support",
          "Advanced features",
        ];
      case "Month":
        return [
          "Full monthly access",
          "Priority support",
          "Advanced features",
          "Monthly reports",
          "Data backup",
        ];
      case "Year":
        return [
          "Full yearly access",
          "VIP support",
          "All premium features",
          "Monthly reports",
          "Priority data backup",
          "Exclusive content",
          "Early feature access",
        ];
      default:
        return ["Premium features"];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800 py-4 px-4 sm:py-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
        <ProfileBanner
          setShowEditData={setShowEditData}
          setShowChangePassword={setShowChangePassword}
          setIsPhotoDialogOpen={setIsPhotoDialogOpen}
          profileImage={profileImage}
        />
        <ProfileInfo users={users} />
        <div className="px-4 sm:px-8 pb-8">
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <SubscriptionCard
              users={users}
              subscription={subscription}
              fetchSubscriptionIsloading={fetchSubscriptionIsloading}
              handleSubscriptionClick={handleSubscriptionClick}
              formatDate={formatDate}
              getPlanTypeDisplay={getPlanTypeDisplay}
              getPlanColor={getPlanColor}
              isSubscriptionActive={isSubscriptionActive}
              getTimeRemaining={getTimeRemaining}
              getPlanFeatures={getPlanFeatures}
            />
            <WalletCard
              userId={users.id}
              isPremium={users.premiumId ? true : false}
            />
          </div>
          <div className="w-full mt-8">
            <MentorCard userId={users.id} />
          </div>
        </div>

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

        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
          currentSubscription={subscription?.id}
          currentSubscriptionDuration={subscription?.duration} 
        />
      </div>
    </div>
  );
};

export default Profile;
