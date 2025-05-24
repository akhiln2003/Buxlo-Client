import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { AdminApiEndPoints } from "../endPoints/AdminEndPoints";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    ///////////////////////////////--User--///////////////////////////////

    // create new adv
    createAdv: builder.mutation({
      query: (data) => ({
        url: AdminApiEndPoints.createAdv,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      }),
    }),

    // Fetch adv data
    fetchAdvsData: builder.mutation({
      query: (page) => ({
        url: `${AdminApiEndPoints.fetchAdvData}?page=${page}`,
        method: "GET",
      }),
    }),

    // Fetch  advImage
    fetchAdvImage: builder.mutation({
      query: (data) => ({
        url: AdminApiEndPoints.fetchAdvImage,
        method: "POST",
        data: data,
      }),
    }),

    //  Delete  AdvImage
    deleteAdvImage: builder.mutation({
      query: ({ key, id }: { key: string; id: string }) => ({
        url: `${AdminApiEndPoints.deleteAdvImage}/${id}/${key}`,
        method: "DELETE",
      }),
    }),

    // Edit Adv
    editAdv: builder.mutation({
      query: (data) => ({
        url: AdminApiEndPoints.editAdv,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      }),
    }),

    // create new trustedUs
    createTrustedUs: builder.mutation({
      query: (data) => ({
        url: AdminApiEndPoints.createTrustedUs,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      }),
    }),

    // Fetch trustedUs data
    fetchtrustedUsData: builder.mutation({
      query: (page) => ({
        url: `${AdminApiEndPoints.fetchTrustedUsData}?page=${page}`,
        method: "GET",
      }),
    }),

    // Fetch  trustedUsImage
    fetchTrustedUsImage: builder.mutation({
      query: (data) => ({
        url: AdminApiEndPoints.fetchTrustedUsImage,
        method: "POST",
        data: data,
      }),
    }),

    // Delete  trustedUsImage
    deleteTrustedUsImage: builder.mutation({
      query: ({ key, id }: { key: string; id: string }) => ({
        url: `${AdminApiEndPoints.deleteTrustedUsImage}/${id}/${key}`,
        method: "DELETE",
      }),
    }),

    //  fetch SubscriptionPlan
    fetchSubscriptionPlan: builder.mutation({
      query: () => ({
        url: AdminApiEndPoints.fetchSubscriptionPlan,
        method: "GET",
      }),
    }),

    // Add subscription plans
    addSubscriptionPlan: builder.mutation({
      query: (data) => ({
        url: AdminApiEndPoints.addSubscriptionPlan,
        method: "POST",
        data: data,
      }),
    }),

    //  Update SubscriptionPlan
    UpdateSubscriptionPlan: builder.mutation({
      query: (data) => ({
        url: AdminApiEndPoints.updateSubscriptionPlan,
        method: "PUT",
        data: {data},
      }),
    }),
    // Fetch verify profile data
    fetchVerifyProfileData: builder.mutation({
      query: ({ page, verified }) => ({
        url: `${AdminApiEndPoints.fetchVerifyProfileData}?page=${page}&&verified=${verified}`,
        method: "GET",
      }),
    }),

    // Fetch verify profile Image
    fethAadhaarImages: builder.mutation({
      query: (keys) => ({
        url: AdminApiEndPoints.fethAadhaarImages,
        method: "POST",
        data: keys,
      }),
    }),

    // Update profile verification
    adminUpdateVerifyProfile: builder.mutation({
      query: ({ id, verified, unsetData }) => ({
        url: AdminApiEndPoints.verifyprofile,
        method: "PUT",
        data: { id, verified, unsetData },
      }),
    }),

    ///////////////////////////////////////////////////////////////////////////////
  }),
});

// Export the hook directly from the API slice
export const {
  useCreateTrustedUsMutation,
  useCreateAdvMutation,
  useFetchtrustedUsDataMutation,
  useFetchAdvsDataMutation,
  useFetchTrustedUsImageMutation,
  useFetchAdvImageMutation,
  useDeleteTrustedUsImageMutation,
  useDeleteAdvImageMutation,
  useEditAdvMutation,
  useFetchSubscriptionPlanMutation,
  useAddSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useFetchVerifyProfileDataMutation,
  useFethAadhaarImagesMutation,
  useAdminUpdateVerifyProfileMutation,
} = adminApi;
