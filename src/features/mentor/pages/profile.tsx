import { useEffect, useState } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Phone,
  Pencil,
  Camera,
  ShieldCheck,
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
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";
import { useGetUser } from "@/hooks/useGetUser";
import {
  useFetchMentorProfileImageMutation,
  useFetchMentorProfileMutation,
} from "@/services/apis/MentorApis";
import { Imentor } from "@/@types/interface/Imentor";
import { EditMentorProfile } from "../components/EditProfileForm";
import EditProfilePhoto from "../components/EditProfilePhoto";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import KycVerificationForm from "../components/KycVerificationForm";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [verifyIsOpen, setVerifyIsOpen] = useState(false);

  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [fetchProfileData] = useFetchMentorProfileMutation();
  const [fetchProfileImages] = useFetchMentorProfileImageMutation();
  const [users, setUsers] = useState<Partial<Imentor>>({});
  const [profileImage, setProfileImage] = useState("");
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
              response.data.data.avatar as string
            );
            if (imageUrl.data.imageUrl) {
              setProfileImage(imageUrl.data.imageUrl);
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

  const profile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    about:
      "Passionate developer with expertise in frontend technologies and a keen eye for user experience.",
    expertise: ["React", "JavaScript", "UI/UX", "Node.js"],
    yearsOfExperience: 5,
    rating: 4.5,
    image: "/api/placeholder/128/128",
    feedback: [
      {
        id: 1,
        name: "Sarah Johnson",
        image: "/api/placeholder/40/40",
        comment:
          "Excellent work on our latest project! Very professional and delivered on time.",
        rating: 5,
        likes: 12,
        dislikes: 1,
      },
      {
        id: 2,
        name: "Mike Smith",
        image: "/api/placeholder/40/40",
        comment: "Great communication skills and technical expertise.",
        rating: 4,
        likes: 8,
        dislikes: 0,
      },
    ],
  };

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

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Profile Header */}
        <Card className="bg-white dark:bg-zinc-900 relative border border-gray-200 dark:border-zinc-800">
          <div className="absolute top-4 right-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-300 dark:border-zinc-700"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-gray-100">
                    Edit Profile
                  </DialogTitle>
                </DialogHeader>
                <EditMentorProfile
                  users={users as Imentor}
                  setIsOpen={setIsOpen}
                  setUsers={setUsers}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="absolute bottom-2 right-4">
            <Dialog open={verifyIsOpen} onOpenChange={setVerifyIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 text-green-800 hover:text-green-800 border-gray-200 dark:bg-zinc-800  dark:hover:bg-zinc-700 dark:text-green-800 dark:border-zinc-700"
                >
                  <ShieldCheck className="w-4 h-4" color="green" />
                  Verify
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-gray-100">
                  Verify Profile
                  </DialogTitle>
                </DialogHeader>
                <KycVerificationForm
                  users={users as Imentor}
                  setIsOpen={setIsOpen}
                  setUsers={setUsers}
                />
              </DialogContent>
            </Dialog>
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {users.name}
                </h1>
                <div className="flex flex-col space-y-3 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span>{users.email}</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span>{1111111111111}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  {renderStars(5)}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    ({profile.rating})
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
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {users.yearsOfExperience} years of experience
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-gray-600 dark:text-gray-400 leading-relaxed">
                    Experience not available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Section */}
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {profile.feedback.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-200 dark:border-zinc-800 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-full ring-2 ring-gray-100 dark:ring-zinc-800"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(item.rating)}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">{item.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                            <span className="text-sm">{item.dislikes}</span>
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {item.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
