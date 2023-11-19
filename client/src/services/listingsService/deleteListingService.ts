import { axiosRoot } from "@/lib/axios/axiosInstance";

const deleteListingService = async (
  listingId: string,
  accessToken: string,
  userId: string
) => {
  try {
    const res = await axiosRoot({
      method: "DELETE",
      url: `listings/${listingId}`,
      headers: {
        token: `bearer ${accessToken}`,
        id: userId,
      },
    });
    return res.data;
  } catch (error: any) {
    return error?.response?.data?.message;
  }
};
export default deleteListingService;
