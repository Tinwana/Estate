import { axiosRoot } from "@/lib/axios/axiosInstance";

export const deleteUserService = async (id: string, token: string) => {
  try {
    const res = await axiosRoot({
      method: "DELETE",
      url: `users/${id}`,

      headers: {
        token: `bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
