import axios from "axios";
export const apiUrl = "https://gn.kassir.kg"
export const api = axios.create({
  baseURL: apiUrl   ,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
    }

    return Promise.reject(error);
  }
);