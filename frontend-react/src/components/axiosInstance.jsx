import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API
const axiosInstance = axios.create({
    baseURL: baseURL,
})

// Request Interceptor
axiosInstance.interceptors.request.use(
    function(config){
        return config;
    }
)

export default axiosInstance