import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { IContactUsData } from "@/@types/interface/IUserApisQuery";
import { CommonApiEndPoints } from "../endPoints/CommonEndPoints";
import { INotification } from "@/@types/interface/INotification";
import { IPaymentHistoryStatus } from "@/@types/IPaymentStatus";
import { PaymentStatus } from "@/@types/paymentEnum";

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
      query: (data: IContactUsData) => ({
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
      query: (data: INotification) => ({
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
    }),

    // Create Subscription Checkout Session
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

    // fetch  Bookings
    fetchBookings: builder.mutation({
      query: ({
        userId,
        page,
        status,
      }: {
        userId: string;
        page: number;
        status: PaymentStatus | "all";
      }) => ({
        url: `${CommonApiEndPoints.fetchBookings}?userId=${userId}&&page=${page}&&status=${status}`,
        method: "GET",
      }),
    }),

    // Cancle booking
    cancelBooking: builder.mutation({
      query: (id: string) => ({
        url: `${CommonApiEndPoints.cancelBooking}/${id}`,
        method: "PATCH",
      }),
    }),

    // fetch  PaymentHistory
    fetchPaymentHistory: builder.mutation({
      query: ({
        userId,
        page,
        status,
        searchData,
      }: {
        userId: string;
        page: number;
        status: IPaymentHistoryStatus | "all";
        searchData?: string;
      }) => ({
        url: `${CommonApiEndPoints.fetchPaymentHistory}?userId=${userId}&&page=${page}&&status=${status}&&searchData=${searchData}`,
        method: "GET",
      }),
    }),

    // Upload payment history
    addPaymetHistory: builder.mutation({
      query: (data) => ({
        url: CommonApiEndPoints.addPaymetHistory,
        method: "POST",
        data: data,
      }),
    }),

    // Upload bank statement
    uploadBankStatement: builder.mutation({
      query: ({ data, userId }) => ({
        url: `${CommonApiEndPoints.uploadBankStatement}?userId=${userId}`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      }),
    }),

    // Fetch Feedback
    fetchFeedback: builder.mutation({
      query: ({
        page,
        mentorId,
        searchData = "",
      }: {
        page: number;
        mentorId: string;
        searchData?: string;
      }) => ({
        url: `${CommonApiEndPoints.fetchFeedback}?page=${page}&&mentorId=${mentorId}&&searchData=${searchData}`,
        method: "GET",
      }),
    }),

    // fetch All advs
    fetchAllAdvs: builder.mutation({
      query: () => ({
        url: CommonApiEndPoints.fetchAllAdvs,
        method: "GET",
      }),
    }),

    // fetch All trustedUs
    fetchAllTrustedUs: builder.mutation({
      query: () => ({
        url: CommonApiEndPoints.fetchAllTrustedus,
        method: "GET",
      }),
    }),

    // fetch random adv's
    fetchRandomAdv: builder.mutation({
      query: () => ({
        url: CommonApiEndPoints.fetchRandomAdv,
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
  useFetchBookingsMutation,
  useCancelBookingMutation,
  useFetchPaymentHistoryMutation,
  useAddPaymetHistoryMutation,
  useUploadBankStatementMutation,
  useFetchFeedbackMutation,
  useFetchAllAdvsMutation,
  useFetchAllTrustedUsMutation,
  useFetchRandomAdvMutation
} = commonApi;
