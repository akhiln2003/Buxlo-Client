import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios";
import { UserApiEndPoints } from "../endPoints/UserEndPoints";
import { addUser } from "@/redux/slices/userSlice";


export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: axiosBaseQuery({ baseUrl: import.meta.env.VITE_AUTH_API_URl }),
    tagTypes: ['User'],
    endpoints: (builder) => ({

        // signUp new User
        signUp: builder.mutation({
            query: (newUser) => ({
                url: UserApiEndPoints.signUp,
                method: 'POST',
                data: newUser
            }),
        }),

        // signUp new User
        verify: builder.mutation({
            query: (data) => ({
                url: UserApiEndPoints.verifyOtp,
                method: 'POST',
                data: data
            }),

        }),


        // signIn User
        signIn: builder.mutation({
            query: (data) => ({
                url: UserApiEndPoints.signIn,
                method: "POST",
                data: data
            })
        })

    })
});

// Export the hook directly from the API slice
export const {
    useSignUpMutation,
    useVerifyMutation,
    useSignInMutation
} = userApi;