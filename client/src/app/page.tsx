"use client";
import { axiosAuth } from "@/lib/axios/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logOut, signInSuccess } from "@/redux/userSlice";
import { logOutService } from "@/services/authServices/logOut";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "@/components/ui/listingsItem";

export default function Home() {
  const user = useAppSelector((state) => state.user.currentUser);
  const route = useRouter();
  const dispatch = useAppDispatch();
  const [offerListings, setOfferListings] = useState<listing[] | []>([]);
  const [saleListings, setSaleListings] = useState<listing[] | []>([]);
  const [rentListings, setRentListings] = useState<listing[] | []>([]);
  const refreshToken = async () => {
    try {
      const res = await axiosAuth({
        method: "POST",
        withCredentials: true,
        url: "auth/refresh-token",
      });

      return res.data;
    } catch (error: any) {
      console.log("log out!");
      await logOutService();
      dispatch(logOut());
    }
  };
  useEffect(() => {
    if (user === null || !user.accessToken || !user.id) {
      logOutService();
      dispatch(logOut());
      route.push("/sign-in");
    }
    const timeoutId = setTimeout(async () => {
      const res = await refreshToken();
      if (res?.status === "OK") {
        dispatch(
          signInSuccess({
            id: user?.id,
            email: user?.email,
            username: user?.username,
            avatar: user?.avatar,
            name: user?.name,
            age: user?.age,
            address: user?.address,
            accessToken: res?.access_token,
          })
        );
      } else {
        clearTimeout(timeoutId);
        dispatch(logOut);
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);
  // useEffect(() => {
  //   const timeoutId = setTimeout(async () => {
  //     const res = await refreshToken();
  //     if (res?.status === "OK") {
  //       dispatch(
  //         signInSuccess({
  //           id: user?.id,
  //           email: user?.email,
  //           username: user?.username,
  //           avatar: user?.avatar,
  //           name: user?.name,
  //           age: user?.age,
  //           address: user?.address,
  //           accessToken: res?.access_token,
  //         })
  //       );
  //     } else {
  //       clearTimeout(timeoutId);
  //       dispatch(logOut);
  //     }
  //   }, 1000 * 60);
  //   return () => clearTimeout(timeoutId);
  // }, [user]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listings?offer=true&limit=4", {
          cache: "no-store",
          method: "GET",
        });
        const data = await res.json();
        setOfferListings(data.data.Listings);
        await fetchRentListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listings?type=rent&limit=4", {
          cache: "no-store",
          method: "GET",
        });
        const data = await res.json();
        setRentListings(data.data.Listings);
        await fetchSaleListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listings?type=sale&limit=4", {
          cache: "no-store",
          method: "GET",
        });
        const data = await res.json();
        setSaleListings(data.data.Listings);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <main className="mt-[72px]">
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-6xl font-bold text-slate-700">
          Find your next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <p className="text-sm text-slate-400">
          Sahand Estate will help you find your home fast, easy and comfortable.{" "}
          <br />= Our expert support are always available.
        </p>
        <Link
          href="/search"
          className="text-blue-800 text-xs sm:text-sm font-bold hover:underline"
        >
          Let's Start now
        </Link>
      </div>
      <Swiper className=" relative" navigation loop={true}>
        {offerListings.length > 0 &&
          offerListings.map((listing: listing) => {
            return (
              <SwiperSlide key={listing?._id}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${listing?.image[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            );
          })}
      </Swiper>
      <div className="my-10 px-3 max-w-6xl mx-auto">
        <h3 className="font-semibold text-2xl text-slate-600">Recent offers</h3>
        <Link
          className="text-sm text-blue-700 hover:underline font-light"
          href="/search?offer=true"
        >
          Show more offers
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {offerListings.map((listing: listing) => {
            return <ListingItem listing={listing} key={listing._id} />;
          })}
        </div>
      </div>

      <div className="my-10 px-3 max-w-6xl mx-auto">
        <h3 className="font-semibold text-2xl text-slate-600">
          Recent places for rent
        </h3>
        <Link
          className="text-sm text-blue-700 hover:underline font-light"
          href="/search?type=rent"
        >
          Show more places for rent
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {rentListings.map((listing: listing) => {
            return <ListingItem listing={listing} key={listing._id} />;
          })}
        </div>
      </div>

      <div className="my-10 px-3 max-w-6xl mx-auto">
        <h3 className="font-semibold text-2xl text-slate-600">
          Recent places for sale
        </h3>
        <Link
          className="text-sm text-blue-700 hover:underline font-light"
          href="/search?type=sale"
        >
          Show more places for sale
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {saleListings.map((listing: listing) => {
            return <ListingItem listing={listing} key={listing._id} />;
          })}
        </div>
      </div>
    </main>
  );
}
