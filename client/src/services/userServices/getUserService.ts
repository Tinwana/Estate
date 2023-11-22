import { axiosRoot } from "@/lib/axios/axiosInstance";

export const getUserService = async (
  userId: string,
  id: string,
  token: string
) => {
  try {
    const res = await axiosRoot({
      method: "GET",
      url: `users/${userId}`,
      headers: {
        token: `bearer ${token}`,
        id: id,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
