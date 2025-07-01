import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { IcontactUsData } from "@/@types/interface/IuserApisQuery";
import { CommonApiEndPoints } from "../endPoints/CommonEndPoints";

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
      query: (id) => ({
        url: `${CommonApiEndPoints.fetchMessages}?id=${id}`,
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

    createWallet: builder.mutation({
      query: (data) => ({
        url: CommonApiEndPoints.createWallet,
        method: "POST",
        data: { data },
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
} = commonApi;
