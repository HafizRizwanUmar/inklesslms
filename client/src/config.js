// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD 
    ? 'https://inklessbackend.vercel.app' 
    : 'http://localhost:5015'); // Local backend

export default API_BASE_URL;
