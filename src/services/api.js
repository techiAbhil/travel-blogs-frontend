import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Check for success flag in the response data
    if (response.data && response.data.success === false) {
      // Create a specific error object or reject with the response to be handled by catch
      const error = new Error(response.data.msg || 'API Error');
      error.response = response;
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., clear token and redirect to login)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optional: Trigger a redirect or global state update here
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
