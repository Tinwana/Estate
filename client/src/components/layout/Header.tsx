import { useAppDispatch, useAppSelector } from "@/redux/hook";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch, FaUser } from "react-icons/fa";
import Loading from "../ui/loading";
import { axiosAuth, axiosRoot } from "@/lib/axios/axiosInstance";
import { logOutService } from "@/services/authServices/logOut";
import { logOut, signInSuccess } from "@/redux/userSlice";
import { useEffect } from "react";

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const listings = await axiosRoot({
    method: "GET",
    url: "listings",
  });
  const data = listings.data;
  return data?.map((listing: listing) => ({
    slug: listing._id,
  }));
}
// export async function getStaticProps() {
//   return { props: { any: null } };
// }

const Header = () => {
  const user = useAppSelector((state) => state.user.currentUser);

  const loading = useAppSelector((state) => state.user.loading);
  // const { CancelToken } = axios;
  // const source = CancelToken.source();
  const dispatch = useAppDispatch();
  const route = useRouter();
  // const refreshToken = async () => {
  //   try {
  //     const res = await axiosAuth({
  //       method: "POST",
  //       withCredentials: true,
  //       url: "auth/refresh-token",
  //     });
  //     dispatch(
  //       signInSuccess({
  //         id: user?.id,
  //         username: user?.username,
  //         email: user?.email,
  //         avatar: user?.avatar,
  //         name: user?.name,
  //         age: user?.age,
  //         address: user?.address,
  //         accessToken: res.data?.access_token,
  //       })
  //     );

  //     return res.data;
  //   } catch (error: any) {
  //     await logOutService();
  //     dispatch(logOut());
  //   }
  // };
  let avatarUrl = user?.avatar?.includes("https://")
    ? user.avatar
    : `https://firebasestorage.googleapis.com/v0/b/auth-a247d.appspot.com/o/images%2F${user?.avatar}?alt=media`;

  // axiosRoot.interceptors.request.use(
  //   async (config) => {
  //     const currentTime = new Date();
  //     const decoded: any = await jwtDecode(user?.accessToken);

  //     if (decoded?.exp < currentTime.getTime() / 1000) {
  //       const data = await refreshToken();
  //       if (data) {
  //         config.headers["token"] = `bearer ${data?.access_token}`;
  //         config.headers["id"] = user?.id;
  //       }
  //     }
  //     config.cancelToken = source.token;
  //     return config;
  //   },
  //   function (error) {
  //     return Promise.reject(error);
  //   }
  // );

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
        await logOutService();
        dispatch(logOut);
        route.push("/sign-in");
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);
  useEffect(() => {
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
        await logOutService();
        clearTimeout(timeoutId);
        dispatch(logOut);
      }
    }, 1000 * 60);
    return () => clearTimeout(timeoutId);
  }, [user]);

  return (
    <>
      {loading && <Loading />}
      <header className="w-full bg-slate-300 shadow-md p-3 fixed top-0">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <Link href="/" className="flex flex-wrap">
            <span className="text-slate-500 font-bold text-md md:text-lg">
              Sahand
            </span>
            <span className="text-slate-700 font-bold text-md md:text-lg">
              Estate
            </span>
          </Link>
          <form className="bg-slate-100 p-3 rounded-lg flex items-center justify-between w-52 md:w-72">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-4/5"
            />
            <span className="cursor-pointer">
              <FaSearch />
            </span>
          </form>
          {user === null || !user.accessToken || !user.id ? (
            <ul className="flex gap-4 md:gap-8">
              <li className="hover:underline font-medium hidden md:inline-block">
                <Link href="/about">About</Link>
              </li>
              <li className="hover:underline font-medium">
                <Link href="/sign-in">Sign In</Link>
              </li>
              <li className="hover:underline font-medium">
                <Link href="/sign-up">Sign Up</Link>
              </li>
            </ul>
          ) : (
            <ul className="flex gap-4 md:gap-8 items-center">
              <li className="hover:underline font-medium hidden md:inline-block">
                <Link href="/about">About</Link>
              </li>
              {user.avatar ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="rounded-full w-8 h-8 object-cover cursor-pointer"
                  onClick={() => {
                    route.push(`/profile/${user.id}`);
                  }}
                />
              ) : (
                <Link href={`/profile/${user.id}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </Link>
              )}
            </ul>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
