"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Provider } from "react-redux";
import { persist, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

const inter = Inter({ subsets: ["latin"] });
const tailwindClasses = [
  "p-3 rounded-lg text-white cursor-pointer",
  "bg-slate-700 uppercase hover:bg-slate-500 disabled:opacity-80 w-full",
  "bg-red-700 uppercase hover:bg-red-500 w-full",
  "z-10 bg-slate-100 border rounded-full w-20 h-20 flex justify-center items-center",
  "bg-slate-100 p-2 rounded-lg",
  "flex-col",
  "bg-slate-200 p-2 rounded-lg w-auto",
  "bg-[#de917b] hover:bg-[#e0a898] text-[#491c0f] w-full ",
  "bg-transparent border-[1px] border-[#b2978f]",
  "bg-transparent hover:bg-[#fbede9] border-[1px] border-[#b2978f] text-[#b2978f]",
  "bg-blue-700 hover:bg-blue-500 uppercase text-white w-full",
  "animate-spin",
  // "fixed z-30 scroll-auto w-screen h-screen flex justify-center items-center bg-[rgba(255,255,255,.7)]",
  "bg-transparent hover:bg-[#9fffd5] border-[1px] border-[#8af7c7] text-[#8af7c7]",
];

type ReduxProviderProps = {
  children: React.ReactNode;
};
interface RefreshTokenResponse {
  status: string;
  message: string;
  access_token: string;
}

function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f1f5f1]`}>
        <ReduxProvider>
          <PersistGate persistor={persist} loading={null}>
            <Header />
            {children}
          </PersistGate>
        </ReduxProvider>
      </body>
    </html>
  );
}
