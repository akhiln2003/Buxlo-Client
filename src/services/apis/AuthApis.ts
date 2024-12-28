import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { UserApiEndPoints } from "../endPoints/UserEndPoints";
import {
  InewUserData,
  IresendOtpData,
  IsignInData,
  IverifyOtpData,
} from "@/@types/interface/IuserApisQuery";
import { MentorApiEndPoints } from "../endPoints/MentorEndPoints";
import { AdminApiEndPoints } from "../endPoints/AdminEndPoints";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    ///////////////////////////////--User--///////////////////////////////

    // signUp new
    signUpUser: builder.mutation({
      query: (newUser: InewUserData) => ({
        url: UserApiEndPoints.signUp,
        method: "POST",
        data: newUser,
      }),
    }),

    // signUp new user Otp verification
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

    // signIn
    signInUser: builder.mutation({
      query: (data: IsignInData) => ({
        url: UserApiEndPoints.signIn,
        method: "POST",
        data: data,
      }),
    }),

    // singOut
    signOutUser: builder.mutation({
      query: () => ({
        url: UserApiEndPoints.signOut,
        method: "POST",
      }),
    }),

    // forgotPassword
    forgotPasswordUser: builder.mutation({
      query: (data) => ({
        url: UserApiEndPoints.forgotPassword,
        method: "POST",
        data: data,
      }),
    }),

    // set new password
    setNewPasswordUser: builder.mutation({
      query: (data) => ({
        url: UserApiEndPoints.setNewPassword,
        method: "POST",
        data: data,
      }),
    }),

    // google auth
    googleAuthUser: builder.mutation({
      query: (data) => ({
        url: UserApiEndPoints.googleAuth,
        method: "POST",
        data: data,
      }),
    }),

    ///////////////////////////////--User end--/////////////////////////////

    ///////////////////////////////--Mentor--///////////////////////////////

    // signUp
    signUpMentor: builder.mutation({
      query: (newUser: InewUserData) => ({
        url: MentorApiEndPoints.signUp,
        method: "POST",
        data: newUser,
      }),
    }),

    // signUp Otp verification
    verifyMentor: builder.mutation({
      query: (data: IverifyOtpData) => ({
        url: MentorApiEndPoints.verifyOtp,
        method: "POST",
        data: data,
      }),
    }),

    // Resend OTP
    resendOtpMentor: builder.mutation({
      query: (data: IresendOtpData) => ({
        url: MentorApiEndPoints.resendOtp,
        method: "POST",
        data: data,
      }),
    }),

    // singOut
    signOutMentor: builder.mutation({
      query: () => ({
        url: MentorApiEndPoints.signOut,
        method: "POST",
      }),
    }),

    // signIn
    signInMentor: builder.mutation({
      query: (data: IsignInData) => ({
        url: MentorApiEndPoints.signIn,
        method: "POST",
        data: data,
      }),
    }),

    // forgotPassword
    forgotPasswordMentor: builder.mutation({
      query: (data) => ({
        url: MentorApiEndPoints.forgotPassword,
        method: "POST",
        data: data,
      }),
    }),

    // set new password
    setNewPasswordMentor: builder.mutation({
      query: (data) => ({
        url: MentorApiEndPoints.setNewPassword,
        method: "POST",
        data: data,
      }),
    }),

    // google auth
    googleAuthMent: builder.mutation({
      query: (data) => ({
        url: MentorApiEndPoints.googleAuth,
        method: "POST",
        data: data,
      }),
    }),

    ///////////////////////////////--Mentor end--///////////////////////////

    ///////////////////////////////--Admin--////////////////////////////////

    // singOut
    signOutAdmin: builder.mutation({
      query: () => ({
        url: AdminApiEndPoints.signOut,
        method: "POST",
      }),
    }),

    // signIn
    signInAdmin: builder.mutation({
      query: (data: IsignInData) => ({
        url: AdminApiEndPoints.signIn,
        method: "POST",
        data: data,
      }),
    }),

    // Fetch users
    fetchUsers: builder.mutation({
      query: () => ({
        url: AdminApiEndPoints.fetchUsers,
        method: "GET",
      }),
    }),

    // Fetch mentors
    fetchMentors: builder.mutation({
      query: () => ({
        url: AdminApiEndPoints.fetchMentors,
        method: "GET",
      }),
    }),

     // Block and  unblock user
     blockandunblock: builder.mutation({
      query: (data) => ({
        url: AdminApiEndPoints.blockandunblock,
        method: "PUT",
        data:data
      }),
    }),



    ///////////////////////////////--Mentor end--///////////////////////////
  }),
});

// Export the hook directly from the API slice
export const {
  // User
  useSignUpUserMutation,
  useVerifyUserMutation,
  useResendOtpUserMutation,
  useSignInUserMutation,
  useSignOutUserMutation,
  useForgotPasswordUserMutation,
  useSetNewPasswordUserMutation,
  useGoogleAuthUserMutation,

  // Mentor
  useSignUpMentorMutation,
  useVerifyMentorMutation,
  useResendOtpMentorMutation,
  useSignInMentorMutation,
  useSignOutMentorMutation,
  useForgotPasswordMentorMutation,
  useSetNewPasswordMentorMutation,
  useGoogleAuthMentMutation,

  // Admin
  useSignInAdminMutation,
  useSignOutAdminMutation,
  useFetchUsersMutation,
  useFetchMentorsMutation,
  useBlockandunblockMutation,
} = userApi;
