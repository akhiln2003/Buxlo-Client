import { AuthApiClient } from "../axios";
import { UserApiEndPoints } from "../endPoints/UserEndPoints";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { AuthUnexpectedErrorTost } from "@/components/ui/authUnexpectedErrorTost";

interface ErrorResponse {
    error: string;
}




export class UserApis {
    static async signIn(email: string, password: string): Promise<any> {
        try {
            const response = await AuthApiClient.post(UserApiEndPoints.signIn, { email, password });
            return response
        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>
            if (axiosError.response && axiosError.response.data) {
                console.log(axiosError.response);
                
                toast({
                    title: axiosError.response.data.error ,
                    description: "You entered invalid otp try one more time to currect otp",
                    className: "text-red-700 border bg-gray-200 mb-6",
                });
            } else {

                // Handle unexpected error shapes
                AuthUnexpectedErrorTost
            }

            throw axiosError;
        }
    }
    static async signUp(name: string, email: string, password: string): Promise<any> {
        try {
            const response = await AuthApiClient.post(UserApiEndPoints.signUp, { name, email, password });            
            return response
        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;

            // Check if the error has a response and a data object
            if (axiosError.response && axiosError.response.data) {
                toast({
                    title: axiosError.response.data.error,
                    description: "This email is already used, try with another email.",
                    className: "text-red-700 border bg-gray-200 mb-6",
                });
            } else {
                // Handle unexpected error shapes
                toast({
                    title: "An unexpected error occurred",
                    description: "Please try again later.",
                    className: "text-red-700 border bg-gray-200 mb-6",
                });
            }

            throw axiosError;
        }
    }
    static async verifyOtp(otp: string, email: string): Promise<any> {
        try {
            const response = await AuthApiClient.post(UserApiEndPoints.verifyOtp, { otp, email });
            console.log( 'this is verify OTP  response : ' ,response);

            return response
        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;

            // Check if the error has a response and a data object
            if (axiosError.response && axiosError.response.data) {
                toast({
                    title: axiosError.response.data.error || 'Invalid OTP',
                    description: "You entered invalid otp try one more time to currect otp",
                    className: "text-red-700 border bg-gray-200 mb-6",
                });
            } else {

                // Handle unexpected error shapes
                AuthUnexpectedErrorTost
            }

            throw axiosError;

        }
    }

    static async resendOtp(email: string, name: string) {
        try {

            const response = await AuthApiClient.post(UserApiEndPoints.resendOtp, { email, name });
            return response

        } catch (err) {
            const axiosError = err as AxiosError<ErrorResponse>;

            if (axiosError.response && axiosError.response.data) {
                toast({
                    title: axiosError.response.data.error,
                    description: "",
                    className: "text-red-700 border bg-gray-200 mb-6",
                })
            } else {
                AuthUnexpectedErrorTost
            }
            throw axiosError
        }
    }
}