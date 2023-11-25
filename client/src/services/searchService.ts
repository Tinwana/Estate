import { axiosRoot } from "@/lib/axios/axiosInstance";

export const searchService = async (
  urlQuery: string,
  limit: number = 1,
  page: number = 1
) => {
  try {
    const res = await axiosRoot({
      method: "GET",
      url: `listings?${urlQuery}&page=${page}&limit=${limit}`,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
