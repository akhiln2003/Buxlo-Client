import { z } from "zod";
import { useEffect, useState } from "react";
import { Loader, Star } from "lucide-react";
import dummyProfileImage from "@/assets/images/dummy-profile.webp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import {
  useFetchMentorProfileImageMutation,
  useFetchMentorProfileMutation,
} from "@/services/apis/MentorApis";
import { IMentor } from "@/@types/interface/IMentor";
import { errorTost, successToast } from "@/components/ui/tosastMessage";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetUser } from "@/hooks/useGetUser";
import {
  useConnectMentorMutation,
  useSendFeedbackMutation,
} from "@/services/apis/UserApis";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { feedbackSchema } from "../zodeSchema/feedbackSchema";
import { IFeedback } from "@/@types/interface/IFeedback";

interface MentorProfileDetailsProps {
  setFeedbacks: React.Dispatch<React.SetStateAction<IFeedback[]>>;
}

const MentorProfileDetails: React.FC<MentorProfileDetailsProps> = ({
  setFeedbacks,
}) => {
  const [fetchProfileData] = useFetchMentorProfileMutation();
  const [fetchProfileImages] = useFetchMentorProfileImageMutation();
  const [mentor, setMentor] = useState<Partial<IMentor>>({});
  const [profileImage, setProfileImage] = useState("");
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const user = useGetUser();
  const [connectMentor] = useConnectMentorMutation();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [star, setStar] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errors, setErrors] = useState<{ star?: string; message?: string }>({});
  const [sendFeedBack, { isLoading: sendFeedBackIsLoading }] =
    useSendFeedbackMutation();

  const fetchMentor = async (id: string) => {
    try {
      if (!id) navigate("/notfound");
      const response: IAxiosResponse = await fetchProfileData(id);
      if (response.data.data) {
        setMentor(response.data.data);
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

  const contactMentor = async (userId: string, mentorId: string) => {
    try {
      const response: IAxiosResponse = await connectMentor({
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

  const handleFeedbackSubmit = async () => {
    try {
      const validatedData = feedbackSchema.parse({
        star,
        message: feedbackMessage,
      });

      setErrors({});

      const data = {
        mentorId: mentor.id,
        userId: user?.id,
        ...validatedData,
      };

      const response: IAxiosResponse = await sendFeedBack(data);

      if (response.data) {
        setStar(0);
        setFeedbackMessage("");
        setIsFeedbackModalOpen(false);
        successToast("Feedback sended", "Your feedback sended successfully");
        setFeedbacks((prev: IFeedback[]) => {
          const newFeedback: IFeedback = response.data;
          const updatedFeedbacks = [newFeedback, ...prev];
          if (updatedFeedbacks.length > 5) {
            updatedFeedbacks.pop();
          }
          return updatedFeedbacks;
        });
      } else {
        errorTost(
          "Something went wrong ",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { star?: string; message?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "star") {
            fieldErrors.star = err.message;
          } else if (err.path[0] === "message") {
            fieldErrors.message = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  useEffect(() => {
    fetchMentor(mentorId as string);
  }, []);

  return (
    <>
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
                <Link
                  to={`${UserUrls.booking}/${mentor.id}`}
                  className="flex-1 sm:flex-initial sm:w-24 text-white bg-zinc-900 hover:bg-zinc-950 dark:bg-zinc-800 hover:dark:bg-zinc-900 flex items-center justify-center rounded-md text-sm p-2 "
                >
                  Book Now
                </Link>
                <Button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  variant="outline"
                  size="lg"
                  className="w-32"
                >
                  Feedback
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Modal */}
      <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>
              Share your experience with {mentor.name || "this mentor"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label htmlFor="star">Star Rating *</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStar(s)}
                    onMouseEnter={() => setHoverStar(s)}
                    onMouseLeave={() => setHoverStar(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${
                        s <= (hoverStar || star)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.star && (
                <p className="text-sm text-red-500">{errors.star}</p>
              )}
            </div>

            {/* Feedback Message */}
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback Message *</Label>
              <Textarea
                id="feedback"
                placeholder="Share your experience..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-start">
                <div>
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message}</p>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {feedbackMessage.length}/500
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsFeedbackModalOpen(false);
                setStar(0);
                setFeedbackMessage("");
                setErrors({});
              }}
            >
              Cancel
            </Button>
            {sendFeedBackIsLoading ? (
              <Button>
                <Loader className="animate-spin" />
              </Button>
            ) : (
              <Button onClick={handleFeedbackSubmit}>Submit Feedback</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MentorProfileDetails;
