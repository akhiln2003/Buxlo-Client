import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import { useFetchMentorProfileImageMutation } from "@/services/apis/MentorApis";
import { Imentor } from "@/@types/interface/Imentor";

interface MentorCardProps {
  mentor: Imentor;
  rating: number;
  availability: string;
}

export const MentorListCard: React.FC<MentorCardProps> = ({
  mentor,
  rating,
  availability,
}) => {
  const [fetchProfileImages] = useFetchMentorProfileImageMutation();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (mentor.avatar) {
          const imageUrl: IaxiosResponse = await fetchProfileImages([
            `MentorProfiles/${mentor.avatar}`,
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
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Card className="mb-4 w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Profile image - smaller on mobile */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-md overflow-hidden">
              <img
                src={profileImage ? profileImage : dummyProfileImage}
                alt="Mentor profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mentor details */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2 sm:gap-0">
              <div>
                <p className="text-sm mb-1 text-center sm:text-left">
                  <span className="text-gray-500 font-medium">Name: </span>
                  <span>{mentor.name}</span>
                </p>
              </div>
              {rating > 0 && (
                <div className="flex mb-2 sm:mb-0">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < rating ? "text-yellow-400" : "text-gray-200"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-sm mb-1 text-center sm:text-left">
              <span className="text-gray-500 font-medium">Title: </span>
              <span>{mentor.bio}</span>
            </p>

            <p className="text-sm mb-1 text-center sm:text-left">
              <span className="text-gray-500 font-medium">Experience: </span>
              <span>{mentor.yearsOfExperience}</span>
            </p>

            <p className="text-sm text-center sm:text-left">
              <span className="text-gray-500 font-medium">Availability: </span>
              <span className="text-xs sm:text-sm">{availability}</span>
            </p>
          </div>
        </div>

        <Separator className="my-3 sm:my-4" />

        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="font-medium mb-3 sm:mb-0 text-center sm:text-left">
            Salary:{" "}
            <span className="text-primary">₹ {mentor.salary || 0}/hr</span>
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link
              className="flex-1 sm:flex-initial sm:w-24 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 hover:dark:bg-gray-900 flex items-center justify-center rounded-md text-sm "
              to={`${UserUrls.mentorProfile}/${mentor.id}`}
            >
              More
            </Link>
            <Button
              variant="default"
              size="sm"
              className="flex-1 sm:flex-initial sm:w-24 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800  hover:dark:bg-zinc-900   dark:text-white"
            >
              Hire
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
