import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
})

export default api;