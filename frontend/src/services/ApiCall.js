import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const commonrequest = async(methods, url, body, header) => {
    let config = {
        method: methods,
        url,
        headers: header ? header : {
            "Content-Type": "application/json"
        },
        data: body
    }

    try {
        const response = await api(config);
        return response;
    } catch (error) {
        console.error('API Error:', error);
        return error;
    }
}

// Export the api instance for direct use
export { api };