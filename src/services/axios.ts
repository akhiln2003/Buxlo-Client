import axios, { AxiosInstance } from 'axios'

export const AuthApiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_AUTH_API_URl,
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials: true
});
