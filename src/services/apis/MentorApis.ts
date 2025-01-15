import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { MentorApiEndPoints } from "../endPoints/MentorEndPoints";

export const mentorApi = createApi({
  reducerPath: "mentorApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Mentor"],
  endpoints: (builder) => ({
    // Fetch mentor profile
    fetchMentorProfile: builder.mutation({
      query: (id: string) => ({
        url: `${MentorApiEndPoints.fetchProfile}/${id}`,
        method: "GET",
      }),
    }),

    // Update mentor profile
    updateMentorProfile: builder.mutation({
      query: (data) => ({
        url: MentorApiEndPoints.updateProfile,
        method: "PUT",
        headers:{
          "Content-Type": "multipart/form-data",
        },
        data: data,
      }),
    }),

     // Fetch mentor profileImage
     fetchMentorProfileImage: builder.mutation({
      query: (key: string) => ({
        url: `${MentorApiEndPoints.fetchProfileImage}/${key}`,
        method: "GET",
      }),
    }),

  }),
  
});

// Export the hook directly from the API slice
export const { useFetchMentorProfileMutation, useUpdateMentorProfileMutation , useFetchMentorProfileImageMutation } =
  mentorApi;
