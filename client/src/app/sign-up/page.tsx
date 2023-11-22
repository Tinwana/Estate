"use client";
import ButtonComponent from "@/components/ui/buttonComponent";
import InputComponent from "@/components/ui/inputComponent";
import Oauth from "@/feature/auth/Oauth";
import { axiosAuth } from "@/lib/axios/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchFailure, isFetching, signUpSuccess } from "@/redux/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUpPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector((state) => state.user.error);
  const loading = useAppSelector((state) => state.user.loading);
  const user = useAppSelector((state) => state.user.currentUser);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(isFetching());
      const res = await axiosAuth({
        method: "POST",
        url: "auth/sign-up",
        data: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
      });
      if (res.data.status === "OK") {
        dispatch(signUpSuccess());
        router.push("/sign-in");
      }
    } catch (error: any) {
      dispatch(fetchFailure(error?.response?.data?.message || error.message));
      console.log(error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-20">Sign Pn</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <InputComponent
          type="username"
          placeholder="Username..."
          id="username"
          onChange={handleChange}
        />
        <InputComponent
          type="email"
          placeholder="Email..."
          id="email"
          onChange={handleChange}
        />
        <InputComponent
          type="password"
          placeholder="Password..."
          id="password"
          onChange={handleChange}
        />

        <span className="text-red-500">{errorMessage}</span>
        <ButtonComponent type="submit">
          {loading ? "Loading..." : "Sign Up"}
        </ButtonComponent>
        <Oauth />
      </form>
      <p>Have don't account?</p>
      <Link className="font-medium text-blue-500" href="/sign-up">
        Sign Up
      </Link>
    </div>
  );
};

export default SignUpPage;
