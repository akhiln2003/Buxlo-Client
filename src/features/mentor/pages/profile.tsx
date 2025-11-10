import { useCallback, useEffect, useState } from "react";
import {
  Star,
  Mail,
  Pencil,
  Camera,
  ShieldCheck,
  Settings,
  Lock,
  ChevronDown,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { useGetUser } from "@/hooks/useGetUser";
import {
  useFetchMentorProfileImageMutation,
  useFetchMentorProfileMutation,
} from "@/services/apis/MentorApis";
import { IMentor } from "@/@types/interface/IMentor";
import { EditMentorProfile } from "../components/EditProfileForm";
import EditProfilePhoto from "../components/EditProfilePhoto";
import KycVerificationForm from "../components/KycVerificationForm";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import { ChangePasswordForm } from "@/components/ui/ChangePasswordForm";
import { z } from "zod";
import { ChangePasswordSchema } from "@/features/user/zodeSchema/ChangePasswordSchema";
import {
  useChanegePasswordMutation,
  useFetchFeedbackMutation,
} from "@/services/apis/CommonApis";
import FeedbackCard from "@/components/common/feedback/FeedbackCard";
import { MentorUrl } from "@/@types/urlEnums/MentorUrl";

type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;

const Profile = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [fetchProfileData] = useFetchMentorProfileMutation();
  const [fetchProfileImages] = useFetchMentorProfileImageMutation();
  const [users, setUsers] = useState<Partial<IMentor>>({});
  const [profileImage, setProfileImage] = useState("");
  const storUserData = useGetUser();
  const [updatePassword, { isLoading: isLoadingChangePassword }] =
    useChanegePasswordMutation();
  const [fetchFeedbacks] = useFetchFeedbackMutation();

  const onSubmitChangePassword = async (data: ChangePasswordType) => {
    try {
      const response: IAxiosResponse = await updatePassword({
        userId: storUserData?.id as string,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (response.data) {
        successToast(
          "Updated",
          response.data.result.message || "password updated successfully"
        );
        setIsChangePasswordOpen(false);
      } else {
        errorTost(
          "Something went wrong ",
          response.error.data.error || [
            { message: "Something went wrong please try again" },
          ]
        );
      }
    } catch (error) {
      console.error("Error updating password", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSettingsOpen]);

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
              `MentorProfiles/${response.data.data.avatar}`,
            ]);
            if (imageUrl.data.imageUrl) {
              setProfileImage(imageUrl.data.imageUrl[0]);
            } else {
              errorTost(
                "Something went wrong ",
                imageUrl.error.data.error || [
                  { message: `${imageUrl.error.data} please try again later` },
                ]
              );
            }
          }
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

  const fetchFeedbackDatas = useCallback(
    async (page: number = 1) => {
      try {
        if (!storUserData?.id) return;
        const response: IAxiosResponse = await fetchFeedbacks({
          page,
          mentorId: storUserData?.id as string,
        });

        if (response.data) {
          setFeedbacks(response.data.feedbacks);
        } else {
          const errorMessage = response.error?.data?.error || [
            {
              message: `${
                response.error?.data || "Unknown error"
              } please try again later`,
            },
          ];
          errorTost("Something went wrong", errorMessage);
          setFeedbacks([]);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        errorTost("Something went wrong", [
          { message: "Something went wrong please try again" },
        ]);
        setFeedbacks([]);
      }
    },
    [fetchFeedbacks]
  );

  useEffect(() => {
    fetchFeedbackDatas(1);
  }, [fetchFeedbackDatas, storUserData?.id]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : index < rating
            ? "fill-yellow-400 text-yellow-400 opacity-50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleSettingsAction = (action: string) => {
    setIsSettingsOpen(false);
    switch (action) {
      case "editProfile":
        setIsEditProfileOpen(true);
        break;
      case "verifyProfile":
        setIsVerifyOpen(true);
        break;
      case "changePassword":
        setIsChangePasswordOpen(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Profile Header */}
        <Card className="bg-white dark:bg-zinc-900 relative border border-gray-200 dark:border-zinc-800">
          <div className="absolute top-4 right-4">
            <div className="relative">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSettingsOpen(!isSettingsOpen);
                }}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-300 dark:border-zinc-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform ${
                    isSettingsOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-lg rounded-lg py-1 z-50">
                  <button
                    onClick={() => handleSettingsAction("editProfile")}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700 text-left"
                  >
                    <Pencil className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Edit Profile
                    </span>
                  </button>

                  {users.verified === "applicationPending" && (
                    <>
                      <div className="border-t border-gray-200 dark:border-zinc-700 my-1" />
                      <button
                        onClick={() => handleSettingsAction("verifyProfile")}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700 text-left"
                      >
                        <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Verify Profile
                        </span>
                      </button>
                    </>
                  )}

                  <div className="border-t border-gray-200 dark:border-zinc-700 my-1" />
                  <button
                    onClick={() => handleSettingsAction("changePassword")}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700 text-left"
                  >
                    <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Change Password
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="shrink-0 relative group">
                <img
                  src={profileImage ? profileImage : dummyProfileImage}
                  alt={users.name}
                  className="rounded-full w-32 h-32 object-cover ring-4 ring-gray-100 dark:ring-zinc-800 shadow-lg"
                />

                <Dialog
                  open={isPhotoDialogOpen}
                  onOpenChange={setIsPhotoDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full p-2 bg-white dark:bg-zinc-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px] bg-white dark:bg-zinc-900">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-gray-100">
                        Update Profile Photo
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
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-start">
                  {users.name}
                  {users.verified === "verified" && (
                    <ShieldCheck color="green" size={20} className="ml-2" />
                  )}
                  {users.verified === "applicationPending" && (
                    <span className="text-red-600 font-light text-sm pl-5">
                      Profile is not verified{" "}
                    </span>
                  )}
                </h1>
                <div className="flex flex-col space-y-3 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span>{users.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  {renderStars(5)}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    (5.0)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About & Expertise Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.bio ? (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {users.bio}
                </p>
              ) : (
                <p className="w-full h-full flex justify-center items-center text-gray-600 dark:text-gray-400 leading-relaxed">
                  Bio not available
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.expertise ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {users.expertise.split(",").map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-gray-600 dark:text-gray-400 leading-relaxed">
                    Experience not available
                  </div>
                )}

                <div className="text-sm text-zinc-900 dark:text-zinc-200 mt-2 font-cabinet">
                  {!users.yearsOfExperience ? (
                    <p>No experience</p>
                  ) : (users.yearsOfExperience as number) < 1 ? (
                    <p>Fresher</p>
                  ) : (
                    <p>{users.yearsOfExperience} years of experience</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Section */}
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Recent Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedbacks.length > 0 ? (
              <>
                <div className="space-y-4">
                  {feedbacks.map((feedback, index) => (
                    <FeedbackCard
                      key={index}
                      feedback={feedback}
                      btnAcction={false}
                    />
                  ))}
                </div>

                {/* View All Feedback Button */}
                <div className="mt-6 flex justify-center">
                  <Link to={MentorUrl.feedBack}>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 px-6 py-2 border-2 border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      View All Feedback
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Feedback Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  You haven't received any feedback yet. Keep mentoring to start
                  receiving reviews!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Components */}
      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <EditMentorProfile
            users={users as IMentor}
            setIsOpen={setIsEditProfileOpen}
            setUsers={setUsers}
          />
        </DialogContent>
      </Dialog>

      {/* Verify Profile Dialog */}
      <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Verify Profile
            </DialogTitle>
          </DialogHeader>
          <KycVerificationForm
            id={users.id as string}
            setVerifyIsOpen={setIsVerifyOpen}
            setUsers={setUsers}
          />
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Change Password
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