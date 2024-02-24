import axios from "axios";
const axiosInstance = axios.create({
  baseURL: process.env.URL || "http://localhost:5000/",
});

export default axiosInstance;
