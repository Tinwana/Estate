"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  fetchFailure,
  fetchingSuccess,
  isFetching,
  logOut,
} from "@/redux/userSlice";
import { logOutService } from "@/services/authServices/logOut";
import { getDetailListingService } from "@/services/listingsService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ButtonComponent from "@/components/ui/buttonComponent";
import { FaBath, FaBed, FaChair, FaParking } from "react-icons/fa";

const ListingDetailPage = ({ params }: { params: { listingId: string } }) => {
  SwiperCore.use([Navigation]);
  const { listingId } = params;
  const user = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [listings, setListings] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  useEffect(() => {
    if (!user?.id) {
      logOutService();
      dispatch(logOut());
      router.push("/sign-in");
    }
    const getDetailListing = async () => {
      try {
        dispatch(isFetching());
        const res = await getDetailListingService(
          listingId,
          user?.accessToken,
          user?.id
        );
        if (res?.status === "OK") {
          setListings({
            name: res.data?.name,
            address: res.data?.address,
            bathrooms: res.data?.bathrooms,
            bedrooms: res.data?.bedrooms,
            description: res.data?.description,
            discountPrice: res.data?.discountPrice,
            furnished: res.data?.furnished,
            imageUrls: res.data?.image,
            offer: res.data?.offer,
            parking: res.data?.parking,
            regularPrice: res.data?.regularPrice,
            type: res.data.type,
          });
          dispatch(fetchingSuccess());
        }
      } catch (error: any) {
        dispatch(fetchFailure(error?.response?.data?.message || error.message));
      }
    };
    getDetailListing();
  }, []);
  return (
    <div className="mt-[72px]">
      <Swiper className=" relative" navigation loop={true}>
        <ButtonComponent
          classNames="absolute top-12 right-12 w-16  h-16  "
          variant="share"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
        </ButtonComponent>
        {listings.imageUrls?.map((url) => {
          return (
            <SwiperSlide key={url}>
              <div
                className="h-[550px]"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
        <p className="text-2xl font-semibold">
          <span>{listings.name}</span> - ${" "}
          <span>
            {listings.offer
              ? listings.discountPrice.toLocaleString("en-US")
              : listings.regularPrice.toLocaleString("en-US")}
            {listings.type === "rent" && " / month"}
          </span>
        </p>
        <div className="flex flex-col items-start gap-2">
          <p className="flex gap-2 items-center ">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </span>
            <span className="font-medium text-sm">{listings.address}</span>
          </p>
          <ButtonComponent
            classNames="sm:w-1/4 w-1/3 text-[.7rem] sm:text-xl py-1"
            variant="scarlet"
          >
            For {listings.type}
          </ButtonComponent>
        </div>
        <p className="font-medium">
          Description - <span>{listings.description}</span>
        </p>
        <div className="flex gap-4 flex-wrap">
          <p className="flex items-center font-medium gap-2">
            <span>
              <FaBed />
            </span>{" "}
            <span> {listings.bedrooms} Bed</span>
          </p>
          <p className="flex items-center font-medium gap-2">
            <span>
              <FaBath />
            </span>{" "}
            <span> {listings.bathrooms} Bath</span>
          </p>
          {listings.parking && (
            <p className="flex items-center font-medium gap-2">
              <span>
                <FaParking />
              </span>{" "}
              <span>Parking spot</span>
            </p>
          )}
          <p className="flex items-center font-medium gap-2">
            <span>
              <FaChair />
            </span>{" "}
            <span>{listings.furnished ? "Have" : "Not"} furnished</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
