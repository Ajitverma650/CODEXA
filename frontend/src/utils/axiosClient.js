import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // ✅ use .env variable
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;

