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
        data: {name},
      }),
    }),
    //////////////////////////////////////////////////////////////////////////////////
  }),
});

export const {
  useContactUsMutation,
  useFetchMessageMutation,
  useSendMessageMutation,
  useFetchMessageFromS3Mutation,
  useFetchUserWalletMutation,
  useUpdateWalletNameMutation,
} = commonApi;
