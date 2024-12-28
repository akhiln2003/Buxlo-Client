import axios from "axios";

// Create axios instance
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_AUTH_API_URl,
    withCredentials: true,
  });
