import axios from "axios";

// API routes are mounted under /api on the server — make sure the base URL
// always includes it, even if the env var is set without the /api suffix
// (e.g. "https://grocnest.vercel.app" -> "https://grocnest.vercel.app/api").
const configuredBaseUrl = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "")

const api = axios.create({
    baseURL: configuredBaseUrl.endsWith("/api") ? configuredBaseUrl : `${configuredBaseUrl}/api`,
    
})

// Inject JWT token from localStorage into every request 

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("auth_token")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle auth errors globally 
api.interceptors.response.use(
    (Response)=> Response,
    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");

            //Only redirect if not already on auth pages

            if(!window.location.pathname.includes("/login") &&
             !window.location.pathname.includes("/register")){
                window.location.href = "/login"
            }
        }

        return Promise.reject(error)
    }
)

export default api;