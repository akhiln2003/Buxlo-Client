import { useCallback, useEffect, useState } from "react";
import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { PageNation } from "@/components/ui/pageNation";
import { errorTost } from "@/components/ui/tosastMessage";
import FeedbackCard from "../../../components/common/feedback/FeedbackCard";
import SearchInput from "@/components/ui/searchInput";
import { MessageSquare } from "lucide-react";
import { useFetchFeedbackMutation } from "@/services/apis/CommonApis";
import { useGetUser } from "@/hooks/useGetUser";

const MentorFeedbackListing = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pageNationData, setPageNationData] = useState({
    pageNum: 1,
    totalPages: 0,
  });
  const [fetchFeedbacks] = useFetchFeedbackMutation();
  const mentor = useGetUser();

  const fetchFeedbackDatas = useCallback(
    async (page: number = 1, searchData = searchQuery) => {
      try {
        if (!mentor?.id) return;
        setLoading(true);
        const response: IAxiosResponse = await fetchFeedbacks({
          page,
          mentorId: mentor?.id as string,
          searchData,
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
      } finally {
        setLoading(false);
      }
    },
    [fetchFeedbacks]
  );

  const handlePageChange = useCallback(
    async (page: number) => {
      await fetchFeedbackDatas(page, searchQuery);
    },
    [fetchFeedbackDatas, searchQuery]
  );

  useEffect(() => {
    if (searchQuery !== undefined) {
      fetchFeedbackDatas(1, searchQuery);
    }
  }, [searchQuery, fetchFeedbackDatas]);

  useEffect(() => {
    fetchFeedbackDatas(1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Client Feedback
              </h1>
              <p className="text-gray-500 mt-1">
                View and manage all feedback from your mentees
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
          <SearchInput
            onSearch={(value) => setSearchQuery(value)}
            debounceDelay={400}
            placeholder="Search by mentee name, feedback content..."
            className=""
          />
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : feedbacks.length > 0 ? (
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

            {/* Pagination */}
            <div className="w-full h-14 py-2 flex justify-center mt-8">
              <PageNation
                pageNationData={pageNationData}
                fetchUserData={handlePageChange}
                setpageNationData={setPageNationData}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Feedback Found
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchQuery
                ? "No feedback matches your search. Try adjusting your search query."
                : "You haven't received any feedback yet. Keep mentoring to start receiving reviews!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorFeedbackListing;
