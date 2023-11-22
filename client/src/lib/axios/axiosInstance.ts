import axios from "axios";

export const axiosRoot = axios.create({
  baseURL: "/api/",
  withCredentials: true,
  headers: {
    "Cache-Control": "no-store",
  },
});
export const axiosAuth = axios.create({
  baseURL: "/api/",
  withCredentials: true,
  headers: {
    "Cache-Control": "no-store",
  },
});
