import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

const axiosExternal = axios.create({
  baseURL: `${import.meta.env.VITE_PUBLIC_BASE_URL}/v1`,
  withCredentials: true,
});

axiosExternal.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers || new AxiosHeaders();

    const userString = localStorage.getItem("user");
    let user: { accessToken?: string } | null = null;

    try {
      user = userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error parsing user JSON:", error);
    }

    if (user?.accessToken) {
      config.headers.set("x-h-auth", user.accessToken);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosExternal;