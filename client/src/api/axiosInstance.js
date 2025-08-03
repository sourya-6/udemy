import axios from "axios";


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACK_END||"https://udemy-l6to.onrender.com/",
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
