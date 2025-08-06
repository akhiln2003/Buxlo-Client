import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { IcontactUsData } from "@/@types/interface/IuserApisQuery";
import { CommonApiEndPoints } from "../endPoints/CommonEndPoints";
import { Inotification } from "@/@types/interface/Inotification";

export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Common"],
  endpoints: (builder) => ({
    ///////////////////////////////--User--///////////////////////////////

    // Change Password
    chanegePassword: builder.mutation({
      query: (data: {
        userId: string;
        currentPassword: string;
        newPassword: string;
      }) => ({
        url: CommonApiEndPoints.changePassword,
        method: "PATCH",
        data: data,
      }),
    }),

    // signUp new
    contactUs: builder.mutation({
      query: (data: IcontactUsData) => ({
        url: CommonApiEndPoints.countactUs,
        method: "POST",
        data: data,
      }),
    }),

    // Send message
    sendMessage: builder.mutation({
      query: (formData: FormData) => ({
        url: CommonApiEndPoints.sendMessage,
        method: "POST",
        data: formData,
      }),
    }),

    // Fetch  messages
    fetchMessage: builder.mutation({
      query: ({ id, receiverId }) => ({
        url: `${CommonApiEndPoints.fetchMessages}?id=${id}&&receiverId=${receiverId}`,
        method: "GET",
      }),
    }),

    // Fetch images , video and audio
    fetchMessageFromS3: builder.mutation({
      query: (keys: string[]) => ({
        url: CommonApiEndPoints.fetchMessageFromS3,
        method: "POST",
        data: { keys },
      }),
    }),

    // Fetch Wallet
    fetchUserWallet: builder.mutation({
      query: (id) => ({
        url: `${CommonApiEndPoints.fetchWallet}?id=${id}`,
        method: "GET",
      }),
    }),

    // Update Wallet Name
    updateWalletName: builder.mutation({
      query: ({ id, name }: { id: string; name: string }) => ({
        url: `${CommonApiEndPoints.updateWalletName}/${id}`,
        method: "PATCH",
        data: { name },
      }),
    }),

    // Create Wallet
    createWallet: builder.mutation({
      query: (data) => ({
        url: CommonApiEndPoints.createWallet,
        method: "POST",
        data: { data },
      }),
    }),

    // Create Notification
    createNotification: builder.mutation({
      query: (data: Inotification) => ({
        url: CommonApiEndPoints.createNotification,
        method: "POST",
        data: { data },
      }),
    }),

    // Fetch Notifications
    fetchNotifications: builder.mutation({
      query: ({ userId, page, status, searchData }) => ({
        url: `${CommonApiEndPoints.fetchNotifications}?userId=${userId}&&page=${page}&&status=${status}&&searchData=${searchData}`,
        method: "GET",
      }),
    }),

    // Read Notifications
    readNotifications: builder.mutation({
      query: (updates: { id: string; status: "unread" | "read" }[]) => ({
        url: CommonApiEndPoints.readNotifications,
        method: "PATCH",
        data: { updates },
      }),
    }),

    // Delete Notifications
    deleteNotifications: builder.mutation({
      query: (ids: string[]) => ({
        url: CommonApiEndPoints.deleteNotifications,
        method: "DELETE",
        data: { ids },
      }),
    }),

    //  fetch SubscriptionPlan
    fetchSubscriptionPlan: builder.mutation({
      query: () => ({
        url: CommonApiEndPoints.fetchSubscriptionPlan,
        method: "GET",
      }),
    }),

    // Create Checkout Session
    createCheckoutSession: builder.mutation({
      query: ({
        amount,
        mentorName,
        slotId,
      }: {
        amount: number;
        mentorName: string;
        slotId: string;
      }) => ({
        url: CommonApiEndPoints.createCheckoutSession,
        method: "POST",
        headers: { "Content-Type": "application/json" },

        data: { amount, mentorName, slotId },
      }),
    }),

    //////////////////////////////////////////////////////////////////////////////////
  }),
});

export const {
  useChanegePasswordMutation,
  useContactUsMutation,
  useFetchMessageMutation,
  useSendMessageMutation,
  useFetchMessageFromS3Mutation,
  useFetchUserWalletMutation,
  useUpdateWalletNameMutation,
  useCreateWalletMutation,
  useCreateNotificationMutation,
  useFetchNotificationsMutation,
  useReadNotificationsMutation,
  useDeleteNotificationsMutation,
  useFetchSubscriptionPlanMutation,
  useCreateCheckoutSessionMutation,
} = commonApi;
