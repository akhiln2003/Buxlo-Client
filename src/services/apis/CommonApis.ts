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
      query: ({
        id,
        name,
        data,
      }: {
        id: string;
        name: string;
        data: { name: string };
      }) => ({
        url: `${CommonApiEndPoints.updateWalletName}/${id}/${name}`,
        method: "PATCH",
        data: data,
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

    // Fetch contacts
    fetchContacts: builder.mutation({
      query: (id) => ({
        url: `${CommonApiEndPoints.fetchContacts}?id=${id}`,
        method: "GET",
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
    //  fetch by id SubscriptionPlan
    fetchSubscriptionPlanById: builder.mutation({
      query: (id) => ({
        url: `${CommonApiEndPoints.fetchSubscriptionPlanById}/${id}`,
        method: "GET",
      }),
    }),

    // Create Bookingn Checkout Session
    createBookingCheckoutSession: builder.mutation({
      query: ({ data, userId, type }) => ({
        url: `${CommonApiEndPoints.createBookingCheckoutSession}/${userId}/${type}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: data,
      }),
    }),

    // Create Subscription Checkout Session
    createSubscriptionCheckoutSession: builder.mutation({
      query: ({ data, userId, type }) => ({
        url: `${CommonApiEndPoints.createSubscriptionCheckoutSession}/${userId}/${type}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: data,
      }),
    }),

    // Create Subscription Checkout Session
    useUpdateSubscriptionPlan: builder.mutation({
      query: ({ data, id }) => ({
        url: `${CommonApiEndPoints.updateSubscriptionPaymet}/${id}`,
        method: "POST",
        data: data,
      }),
    }), // Create Subscription Checkout Session
    useUpdateBookingPlan: builder.mutation({
      query: ({ data, id }) => ({
        url: `${CommonApiEndPoints.updateBookingPaymet}/${id}`,
        method: "POST",
        data: data,
      }),
    }),

    // fetch one Payment
    fetchOnePaymet: builder.mutation({
      query: (id) => ({
        url: `${CommonApiEndPoints.fetchOnePaymet}/${id}`,
        method: "GET",
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
  useFetchContactsMutation,
  useCreateNotificationMutation,
  useFetchNotificationsMutation,
  useReadNotificationsMutation,
  useDeleteNotificationsMutation,
  useFetchSubscriptionPlanMutation,
  useFetchSubscriptionPlanByIdMutation,
  useCreateBookingCheckoutSessionMutation,
  useCreateSubscriptionCheckoutSessionMutation,
  useUseUpdateBookingPlanMutation,
  useUseUpdateSubscriptionPlanMutation,
  useFetchOnePaymetMutation,
} = commonApi;
