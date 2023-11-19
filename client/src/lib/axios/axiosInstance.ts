import axios from "axios";

export const axiosRoot = axios.create({
  baseURL: "/api/",
  withCredentials: true,
});
export const axiosAuth = axios.create({
  baseURL: "/api/",
  withCredentials: true,
});
