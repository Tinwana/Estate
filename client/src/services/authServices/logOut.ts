import { axiosAuth } from "@/lib/axios/axiosInstance";

export const logOutService = async () => {
  try {
    const res = await axiosAuth({
      method: "POST",
      url: "auth/log-out",
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
