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
      query: ({ page, availability }) => ({
        url: `${UserApiEndPoints.fetchMentorsList}?page=${page}&&availability=${availability}`,
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

    // Fetch contacts
    fetchContacts: builder.mutation({
      query: (id) => ({
        url: `${UserApiEndPoints.fetchContacts}?id=${id}`,
        method: "GET",
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
  useFetchContactsMutation,
  useMoneyCategorizeMutation,
  useFetchMoneyCategorizeMutation,
  
} = userApi;
