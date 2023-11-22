"use client";
import { axiosAuth } from "@/lib/axios/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logOut, signInSuccess } from "@/redux/userSlice";
import { logOutService } from "@/services/authServices/logOut";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const user = useAppSelector((state) => state.user.currentUser);
  const route = useRouter();
  const dispatch = useAppDispatch();
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

  return (
    <main className="w-screen h-screen flex items-center justify-center"></main>
  );
}
