import axios from "axios";

const createAPI = axios.create({
  baseURL: "http://localhost:2511",
  headers: {
    "Content-Type": "application/json",
  },
});

createAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default createAPI;