import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { UserApiEndPoints } from "../endPoints/UserEndPoints";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Fetch user profile
    fetchUserProfile: builder.mutation({
      query: (id: string) => ({
        url: `${UserApiEndPoints.fetchProfile}/${id}`,
        method: "GET",
      }),
    }),

    // Update mentor profile
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: UserApiEndPoints.updateProfile,
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      }),
    }),

    // Fetch  profileImage
    fetchUserProfileImage: builder.mutation({
      query: (keys: string[]) => ({
        url: UserApiEndPoints.fetchProfileImage,
        method: "POST",
        data: { keys },
      }),
    }),

    // Delete  profileImage
    deleteUserProfileImage: builder.mutation({
      query: ({ key, id }: { key: string; id: string }) => ({
        url: `${UserApiEndPoints.deleteProfileImage}/${id}/${key}`,
        method: "DELETE",
      }),
    }),

    // Fetching Mentors
    fetchMentorsList: builder.mutation({
      query: ({ page, experience, rating, salary, searchData }) => ({
        url: `${UserApiEndPoints.fetchMentorsList}?page=${page}&&experience=${experience}&&rating=${rating}&&salary=${salary}&&searchData=${searchData}`,
        method: "GET",
      }),
    }),

    // Contact mentor
    connectMentor: builder.mutation({
      query: ({ userId, mentorId }) => ({
        url: UserApiEndPoints.connectMentor,
        method: "POST",
        data: { userId, mentorId },
      }),
    }),

    // Add a new category
    moneyCategorize: builder.mutation({
      query: (data) => ({
        url: UserApiEndPoints.moneyCategorize,
        method: "POST",
        data: data,
      }),
    }),

    // Fetch money categorize
    fetchMoneyCategorize: builder.mutation({
      query: () => ({
        url: UserApiEndPoints.fetchmoneycategorize,
        method: "GET",
      }),
    }),

    //fetchSlots
    userFetchSlots: builder.mutation({
      query: (mentorId) => ({
        url: `${UserApiEndPoints.fetchSlots}/${mentorId}`,
        method: "GET",
      }),
    }),

    // sendFeedback
    sendFeedback: builder.mutation({
      query: (data) => ({
        url: UserApiEndPoints.sendFeedback,
        method: "POST",
        data: data,
      }),
    }),

    // Lik and dislike Feedback
    likeAndDislike: builder.mutation({
      query: ({
        id,
        userId,
        option,
        remove,
      }: {
        id: string;
        userId: string;
        option: "like" | "disLike";
        remove: boolean;
      }) => ({
        url: UserApiEndPoints.likeAndDislike,
        method: "PATCH",
        data: {
          id,
          userId,
          option,
          remove,
        },
      }),
    }),

    // Lock slot
    lockSlot: builder.mutation({
      query: ({ slotId, userId }) => ({
        url: `${UserApiEndPoints.lockSlot}/${slotId}/${userId}`,
        method: "PATCH",
      }),
    }),

    // Fetch paymet history summary
    fetchPaymentHistorySummary: builder.mutation({
      query: ({
        userId,
        year,
        startMonth,
        endMonth,
        startDate,
        endDate,
      }: {
        userId: string;
        year?: number;
        startMonth?: string;
        endMonth?: string;
        startDate?: string;
        endDate?: string;
      }) => ({
        url: `${UserApiEndPoints.fetchPaymentHistorySummary}?userId=${userId}&&year=${year}&&startMonth=${startMonth}&&endMonth=${endMonth}&&startDate=${startDate}&&endDate=${endDate}`,
        method: "GET",
      }),
    }),
    /////////////////////////////////////////////////////////////////////////
  }),
});

// Export the hook directly from the API slice
export const {
  useFetchUserProfileMutation,
  useUpdateUserProfileMutation,
  useFetchUserProfileImageMutation,
  useDeleteUserProfileImageMutation,
  useFetchMentorsListMutation,
  useConnectMentorMutation,
  useMoneyCategorizeMutation,
  useFetchMoneyCategorizeMutation,
  useUserFetchSlotsMutation,
  useSendFeedbackMutation,
  useLikeAndDislikeMutation,
  useLockSlotMutation,
  useFetchPaymentHistorySummaryMutation,
} = userApi;
