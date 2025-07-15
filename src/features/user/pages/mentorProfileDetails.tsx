import React, { useEffect, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import {
  useFetchMentorProfileImageMutation,
  useFetchMentorProfileMutation,
} from "@/services/apis/MentorApis";
import { Imentor } from "@/@types/interface/Imentor";
import { errorTost } from "@/components/ui/tosastMessage";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUser } from "@/hooks/useGetUser";
import { useConnectMentorMutation } from "@/services/apis/UserApis";
import { UserUrls } from "@/@types/urlEnums/UserUrls";

interface FeedbackCardProps {
  name: string;
  rating: number;
  feedback: string;
}

const AccountantProfile = () => {
  const [fetchProfileData] = useFetchMentorProfileMutation();
  const [fetchProfileImages] = useFetchMentorProfileImageMutation();
  const [mentor, setMentor] = useState<Partial<Imentor>>({});
  const [profileImage, setProfileImage] = useState("");
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const user = useGetUser();
  const [connectMentor] = useConnectMentorMutation();

  const fetchMentor = async (id: string) => {
    try {
      if (!id) navigate("/notfount");
      const response: IaxiosResponse = await fetchProfileData(id);
      if (response.data.data) {
        setMentor(response.data.data);
        if (response.data.data.avatar) {
          const imageUrl: IaxiosResponse = await fetchProfileImages([
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

  const contactMentor = async (userId: string, mentorId: string) => {
    try {
      const response: IaxiosResponse = await connectMentor({
        userId,
        mentorId,
      });
      if (response.data) {
        navigate(UserUrls.chat, { state: { Id: mentorId } });
      } else {
        errorTost(
          "Something went wrong ",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
      }
    } catch (err) {
      console.error("Error connecting to mentor:", err);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };
  useEffect(() => {
    fetchMentor(mentorId as string);
  }, []);

  return (
    <Card className="w-full bg-zinc-50 dark:bg-zinc-900 shadow-sm mb-6">
      <CardContent className="p-8">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold mb-6 w-full text-center">
            Chartered Accountants
          </h1>

          <div className="flex flex-col md:flex-row w-full gap-6 mb-6">
            {/* Profile image */}
            <div className="mx-auto md:mx-0">
              <div className="w-32 h-32 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={profileImage ? profileImage : dummyProfileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Accountant details */}
            <div className="flex-1 text-left">
              <div className="flex justify-between mb-2">
                <div>
                  <p className="text-lg mb-1">
                    <span className="font-medium">Name: </span>
                    <span>{mentor.name}</span>
                  </p>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-lg mb-2">
                <span className="font-medium">Title: </span>
                <span>{mentor.bio}</span>
              </p>

              <p className="text-lg mb-2">
                <span className="font-medium">Experience: </span>
                <span>{mentor.yearsOfExperience}</span>
              </p>

              <p className="text-lg mb-2">
                <span className="font-medium">Availability: </span>
                <span className="text-green-600">{"availability"}</span>
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center w-full border-t pt-4">
            <p className="text-xl font-medium">
              Salary: <span className="text-primary">$ {mentor.salary}/hr</span>
            </p>
            <div className="flex gap-3 bg">
              <Button
                onClick={() =>
                  contactMentor(user?.id as string, mentorId as string)
                }
                variant="outline"
                size="lg"
                className="w-32"
              >
                Contact
              </Button>
              <Button
                variant="default"
                size="lg"
                className="w-32 bg-black hover:bg-zinc-800 dark:text-white"
              >
                Hire
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Individual feedback card component
const FeedbackCard: React.FC<FeedbackCardProps> = ({
  name,
  rating,
  feedback,
}) => {
  return (
    <Card className="w-full bg-zinc-50 dark:bg-zinc-900 shadow-sm mb-4">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Small profile image */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
              <img
                src="/api/placeholder/48/48"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-base font-medium">{name}</p>
                <p className="text-sm text-gray-500">Feedback</p>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < rating ? "text-yellow-400" : "text-gray-200"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-base mt-2">{feedback}</p>
          </div>
        </div>

        <div className="flex justify-end mt-3 gap-3">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <ThumbsDown size={18} />
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <ThumbsUp size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
const MentorProfile: React.FC = () => {
  // Sample feedback data
  const feedbacks = [
    {
      name: "Sarah Johnson",
      rating: 5,
      feedback:
        "John helped me organize my business finances and saved me thousands in taxes. Highly recommended!",
    },
    {
      name: "Michael Chen",
      rating: 4,
      feedback:
        "Very professional and knowledgeable. Responds quickly to all questions.",
    },
    {
      name: "Lisa Rodriguez",
      rating: 5,
      feedback:
        "Excellent service! John made tax season so much less stressful for our small business.",
    },
    {
      name: "Robert Williams",
      rating: 5,
      feedback:
        "Best chartered accountant I've worked with. Very detail-oriented and explains complex concepts clearly.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-800 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Main accountant profile */}
        <AccountantProfile />

        <h2 className="text-xl font-bold my-6">Client Feedback</h2>

        {/* Feedback cards */}
        <div className="space-y-4 mt-4">
          {feedbacks.map((feedback, index) => (
            <FeedbackCard
              key={index}
              name={feedback.name}
              rating={feedback.rating}
              feedback={feedback.feedback}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
