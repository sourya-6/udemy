import axios from "axios";


const axiosInstance = axios.create({
  baseURL: import.meta.env.FRONT_END,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);
export default axiosInstance;
