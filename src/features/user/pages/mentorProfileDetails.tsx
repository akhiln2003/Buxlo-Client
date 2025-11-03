import { Card, CardContent } from "@/components/ui/card";
import MentorProfileDetails from "../components/MentorProfileDetails";
import { useCallback, useEffect, useState } from "react";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { PageNation } from "@/components/ui/pageNation";
import { errorTost } from "@/components/ui/tosastMessage";
import FeedbackCard from "../../../components/common/feedback/FeedbackCard";
import { useFetchFeedbackMutation } from "@/services/apis/CommonApis";
import { useParams } from "react-router-dom";
import { IFeedback } from "@/@types/interface/IFeedback";

// Main component
const MentorProfile = () => {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]|[]>([]);
  const [pageNationData, setPageNationData] = useState({
    pageNum: 1,
    totalPages: 0,
  });
  const [fetchFeedbacks, { isLoading: fetchFeedbacksIsLoading }] =
    useFetchFeedbackMutation();

  const { mentorId } = useParams();

  const fetchFeedbackDatas = useCallback(
    async (page: number = 1) => {
      try {
        if (!mentorId || mentorId == undefined) return;
        const response: IAxiosResponse = await fetchFeedbacks({
          page,
          mentorId,
        });

        if (response.data) {
          setFeedbacks(response.data.feedbacks);
          setPageNationData((prev) => ({
            ...prev,
            totalPages: response.data.totalPages,
            pageNum: page,
          }));
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

  const handlePageChange = useCallback(
    async (page: number) => {
      await fetchFeedbackDatas(page);
    },
    [fetchFeedbackDatas]
  );

  useEffect(() => {
    fetchFeedbackDatas(1);
  }, [fetchFeedbackDatas, mentorId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Main mentor profile */}
        <div className="mb-8">
          <MentorProfileDetails setFeedbacks={setFeedbacks}  />
        </div>

        {/* Feedback section header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Client Feedback
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {feedbacks.length > 0 && `Showing ${feedbacks.length} reviews`}
          </p>
        </div>

        {/* Feedback cards with loading state */}
        {fetchFeedbacksIsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        ) : feedbacks.length > 0 ? (
          <div className="space-y-4">
            {feedbacks.map((feedback, index) => (
              <FeedbackCard key={index} feedback={feedback} btnAcction={true} />
            ))}

            {/* Pagination */}
            <div className="flex justify-center pt-8 pb-4">
              <PageNation
                pageNationData={pageNationData}
                fetchUserData={handlePageChange}
                setpageNationData={setPageNationData}
              />
            </div>
          </div>
        ) : (
          <Card className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No feedback available yet
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MentorProfile;
