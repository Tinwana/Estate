import { axiosRoot } from "@/lib/axios/axiosInstance";

const getDetailListingService = async (
  listingId: string,
  accessToken: string,
  userId: string
) => {
  console.log("call api");

  try {
    const res = await axiosRoot({
      method: "GET",
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
export default getDetailListingService;
