import { useFetchMentorProfileImageMutation } from "@/services/apis/MentorApis";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import { IFeedback } from "@/@types/interface/IFeedback";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp, Star, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";
import { Card, CardContent } from "@/components/ui/card";
import { useLikeAndDislikeMutation } from "@/services/apis/UserApis";
import { useGetUser } from "@/hooks/useGetUser";

const FeedbackCard = ({
  feedback,
  btnAcction,
}: {
  feedback: IFeedback;
  btnAcction: boolean;
}) => {
  const [fetchProfileImages] = useFetchMentorProfileImageMutation();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(feedback.like.length || 0);
  const [dislikeCount, setDislikeCount] = useState(
    feedback.dislike.length || 0
  );
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(
    null
  );
  const [likeAndDislike] = useLikeAndDislikeMutation();
  const user = useGetUser();

  // Set initial user reaction based on feedback data
  useEffect(() => {
    if (user?.id) {
      if (feedback.like.includes(user.id)) {
        setUserReaction("like");
      } else if (feedback.dislike.includes(user.id)) {
        setUserReaction("dislike");
      }
    }
  }, [user?.id, feedback.like, feedback.dislike]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (feedback.user.avatar) {
          const imageUrl: IAxiosResponse = await fetchProfileImages([
            `UserProfiles/${feedback.user.avatar}`,
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

  const handleLike = async () => {
    try {
      let remove: boolean = false;
      if (feedback.like.length && feedback.like.includes(user?.id as string))
        remove = true;
      const response: IAxiosResponse = await likeAndDislike({
        id: feedback.id,
        userId: user?.id as string,
        option: "like",
        remove,
      });

      if (response.data) {
        if (userReaction === "like") {
          setLikeCount((prev) => prev - 1);
          setUserReaction(null);
        } else {
          if (userReaction === "dislike") {
            setDislikeCount((prev) => prev - 1);
          }
          setLikeCount((prev) => prev + 1);
          setUserReaction("like");
        }
      } else {
        errorTost(
          "Something went wrong",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      errorTost("Something went wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  const handleDislike = async () => {
    try {
      let remove: boolean = false;
      if (
        feedback.dislike.length &&
        feedback.dislike.includes(user?.id as string)
      )
        remove = true;
      const response: IAxiosResponse = await likeAndDislike({
        id: feedback.id,
        userId: user?.id as string,
        option: "disLike",
        remove,
      });

      if (response.data) {
        if (userReaction === "dislike") {
          setDislikeCount((prev) => prev - 1);
          setUserReaction(null);
        } else {
          if (userReaction === "like") {
            setLikeCount((prev) => prev - 1);
          }
          setDislikeCount((prev) => prev + 1);
          setUserReaction("dislike");
        }
      } else {
        errorTost(
          "Something went wrong",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
      }
    } catch (error) {
      console.error("Error with dislike:", error);
      errorTost("Something went wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const feedbackDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - feedbackDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <Card className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:shadow-lg hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Profile image with enhanced styling */}
          <div className="flex-shrink-0">
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-zinc-700 group-hover:ring-4 group-hover:ring-blue-100 dark:group-hover:ring-blue-900/30 transition-all duration-300">
              <img
                src={profileImage ? profileImage : dummyProfileImage}
                alt={`${feedback.user.name}'s profile`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header with name, rating and date */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feedback.user.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <MessageSquare size={14} />
                    Verified Client
                  </span>
                  {feedback.createdAt && (
                    <>
                      <span>•</span>
                      <span>{formatDate(feedback.createdAt)}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Star rating with enhanced visuals */}
              <div className="flex flex-col items-start sm:items-end gap-1">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-full border border-yellow-200 dark:border-yellow-800">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < feedback.star
                          ? "text-yellow-500 fill-yellow-500 drop-shadow-sm"
                          : "text-gray-300 dark:text-gray-600"
                      } transition-all duration-200`}
                    />
                  ))}
                  <span className="ml-1.5 text-sm font-bold text-yellow-700 dark:text-yellow-400">
                    {feedback.star}.0
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback message with better typography */}
            <div className="relative">
              <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed pl-3">
                {feedback.message}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons with counts and enhanced styling */}
        <div className="flex justify-between items-center mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800">
          <div className="w-full flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              disabled={!btnAcction}
              className={`h-10 px-4 rounded-lg transition-all duration-200 ${
                userReaction === "dislike"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 shadow-sm"
                  : "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
              } ${!btnAcction ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <ThumbsDown
                size={16}
                className={`mr-2 transition-transform ${
                  userReaction === "dislike" ? "fill-current scale-110" : ""
                }`}
              />
              <span className="text-sm font-semibold">{dislikeCount}</span>
            </Button>

            <div className="h-6 w-px bg-gray-200 dark:bg-zinc-700"></div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!btnAcction}
              className={`h-10 px-4 rounded-lg transition-all duration-200 ${
                userReaction === "like"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 shadow-sm"
                  : "hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/50 dark:hover:text-green-400"
              } ${!btnAcction ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <ThumbsUp
                size={16}
                className={`mr-2 transition-transform ${
                  userReaction === "like" ? "fill-current scale-110" : ""
                }`}
              />
              <span className="text-sm font-semibold">{likeCount}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
