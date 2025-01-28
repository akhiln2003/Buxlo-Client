import { logOut } from "@/redux/slices/userSlice";
import { Store } from "@reduxjs/toolkit";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { UserApiEndPoints } from "../endPoints/UserEndPoints";



// Create a variable to hold the store
let store: Store ;

// Create the injection function
export const injectStore = (_store: Store) => {
  store = _store;
};


// Define custom interface for the config that includes _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URl,
  withCredentials: true,
});

// Track if we're currently refreshing token
let isRefreshing = false;
// Store pending requests
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};


// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log the request body (data)
    console.log('Request Body:', config.data);
    return config;
  },
  (error) => {
    // Log any request errors
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call your refresh token endpoint
        const response = await refreshTokenApi();

        if (response.status === 200) {
          // Token refresh successful
          isRefreshing = false;
          processQueue();
          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh token failure
        isRefreshing = false;
        processQueue(refreshError);
        // Redirect to login or handle as needed
        store.dispatch(logOut());
        return Promise.reject(refreshError);
      }
    }

    if(error.response?.status as number < 600 && error.response?.status as number >= 500  ){
      window.location.href = '/servererror';    }

    // Handle other errors
    return Promise.reject(error);
  }
);

const refreshTokenApi = async () => {
  return axios.post(
    `${import.meta.env.VITE_AUTH_API_URl}${UserApiEndPoints.tokenGen}`,
    {},
    {
      withCredentials: true,
    }
  );
};

export default axiosInstance;
