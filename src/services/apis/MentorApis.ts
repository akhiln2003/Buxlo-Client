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
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      }),
    }),

    // Fetch  profileImage
    fetchMentorProfileImage: builder.mutation({
      query: (keys: string[]) => ({
        url: MentorApiEndPoints.fetchProfileImage,
        method: "POST",
        data:{keys}
      }),
    }),

    // Delete  profileImage
    deleteMentorProfileImage: builder.mutation({
      query: ({ key, id }: { key: string; id: string }) => ({
        url: `${MentorApiEndPoints.deleteProfileImage}/${id}/${key}`,
        method: "DELETE",
      }),
    }),

      // kyc verification
      kycVerification: builder.mutation({
        query: (data) => ({
          url: MentorApiEndPoints.kycVerification,
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data:data
        }),
      }),
  }),
});

// Export the hook directly from the API slice
export const {
  useFetchMentorProfileMutation,
  useUpdateMentorProfileMutation,
  useFetchMentorProfileImageMutation,
  useDeleteMentorProfileImageMutation,
  useKycVerificationMutation
} = mentorApi;
