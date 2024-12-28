import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { axiosInstance } from "./axiosInstance";
import { store } from "@/redux/store";
import { addUser } from "@/redux/slices/userSlice";

// Define interface for pending request
interface PendingRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

// Define custom error type
interface ApiError {
  message: string;
  status: number;
}

// Flag to track if we're currently regenerating the token
let isRegenerating = false;

// Store pending requests with proper typing
let pendingRequests: PendingRequest[] = [];

const processPendingRequests = (error: Error | null = null) => {
  pendingRequests.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  pendingRequests = [];
};

// Response interceptor with proper typing
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle unauthorized error (token expired or missing)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRegenerating) {
        // If already regenerating, queue the request with proper typing
        return new Promise<unknown>((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err: Error) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRegenerating = true;

      try {
        // Call regenerate token endpoint with proper typing
        console.log("thsi is inside resonse intercepter");
  
        await axiosInstance.post<AxiosResponse>(`/user/profile/refreshtoken`);

        // Process any pending requests
        processPendingRequests();
        return axiosInstance(originalRequest);
      } catch (regenerateError) {
        const error = regenerateError as Error;
        processPendingRequests(error);
        store.dispatch(addUser(null));
        return Promise.reject(error);
      } finally {
        isRegenerating = false;
      }
    }

    // const errorMessage = error.response?.data?.message || error.message;

    // switch (error.response?.status) {
    //   case 400:
    //     console.error("Bad Request:", error.response.data);
    //     throw new Error(errorMessage || "Invalid request");

    //   case 403:
    //     console.error("Forbidden:", error.response.data);
    //     if (window.location.pathname !== "/login") {
    //       window.location.href = "/login";
    //     }
    //     throw new Error("Access denied");

    //   case 404:
    //     console.error("Not Found:", error.response.data);
    //     throw new Error("Resource not found");

    //   case 500:
    //     console.error("Server Error:", error.response.data);
    //     throw new Error("Internal server error");

    //   case 502:
    //     console.error("Bad Gateway:", error.response.data);
    //     throw new Error("Service temporarily unavailable");

    //   default:
    //     console.error("Network Error:", error);
    //     throw new Error("An unexpected error occurred");
    // }
  }
);

