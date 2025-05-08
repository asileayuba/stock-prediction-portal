import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Request Interceptor
axiosInstance.interceptors.request.use(
    function(config){
        console.log('request without auth header==>', config);
        const accessToken = localStorage.getItem('access_token')
        if (accessToken){
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        console.log(config);
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
)

export default axiosInstance