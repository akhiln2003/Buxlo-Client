import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios";
import { UserApiEndPoints } from "../endPoints/UserEndPoints";
import {
  InewUserData,
  IresendOtpData,
  IsignInData,
  IverifyOtpData,
} from "@/@types/interface/IuserApisQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({ baseUrl: import.meta.env.VITE_AUTH_API_URl }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // signUp new User
    signUpUser: builder.mutation({
      query: (newUser: InewUserData) => ({
        url: UserApiEndPoints.signUp,
        method: "POST",
        data: newUser,
      }),
    }),

    // signUp new User
    verifyUser: builder.mutation({
      query: (data: IverifyOtpData) => ({
        url: UserApiEndPoints.verifyOtp,
        method: "POST",
        data: data,
      }),
    }),

    // Resend OTP
    resendOtpUser: builder.mutation({
      query: (data: IresendOtpData) => ({
        url: UserApiEndPoints.resendOtp,
        method: "POST",
        data: data,
      }),
    }),

    // signIn User
    signInUser: builder.mutation({
      query: (data: IsignInData) => ({
        url: UserApiEndPoints.signIn,
        method: "POST",
        data: data,
      }),
    }),
  }),
});

// Export the hook directly from the API slice
export const {
  useSignUpUserMutation,
  useVerifyUserMutation,
  useResendOtpUserMutation,
  useSignInUserMutation,
} = userApi;
