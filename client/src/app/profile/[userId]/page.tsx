"use client";
import ButtonComponent from "@/components/ui/buttonComponent";
import InputComponent from "@/components/ui/inputComponent";
import { storage } from "@/config/firebase";
import { axiosRoot } from "@/lib/axios/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  fetchFailure,
  isFetching,
  logOut,
  signInSuccess,
} from "@/redux/userSlice";
import { logOutService } from "@/services/authServices/logOut";
import { deleteUserService } from "@/services/userServices/updateUserService";
import { ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { deleteListingService } from "@/services/listingsService";

const ProfilePage = ({ params }: { params: { userId: string } }) => {
  const user = useAppSelector((state) => state.user.currentUser);
  const loading = useAppSelector((state) => state.user.loading);
  const dispatch = useAppDispatch();
  const route = useRouter();
  const [editable, setEditable] = useState<boolean>(false);
  const [image, setImage] = useState<any>();
  const [errorMessage, setErrorMessage] = useState("");
  const [showListings, setShowListing] = useState<boolean>(false);
  const [userListings, setUserListings] = useState<any>([]);
  const [showChangPassword, setShowChangPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: user?.name,
    age: user?.age,
    address: user?.address,
    email: user?.email,
    username: user?.username,
    password: "",
  });
  const uploadInputRef = useRef<any>(null);
  const userSvgRef = useRef<any>(null);
  const previewRef = useRef<any>(null);
  const hiddenRef = useRef<any>(null);
  let avatarUrl = user?.avatar?.includes("https://")
    ? user.avatar
    : `https://firebasestorage.googleapis.com/v0/b/auth-a247d.appspot.com/o/images%2F${user?.avatar}?alt=media`;
  const uniqueFileName = image?.name + Date.now().toString();

  useEffect(() => {
    if (user === null || !user.accessToken || !user.id) {
      logOutService();
      dispatch(logOut());
      route.push("/sign-in");
    }
  }, []);

  const uploadImage = async () => {
    if (image === null) return;
    try {
      const fileRef = ref(storage, `images/${uniqueFileName}`);
      await uploadBytes(fileRef, image);
    } catch (error: any) {
      dispatch(fetchFailure(`Fail to upload image ${error.message}`));
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(isFetching());
      if (image !== null) {
        await uploadImage();
      }

      const res = await axiosRoot({
        method: "PATCH",
        url: `users/${user?.id}`,
        data: {
          email: formData.email,
          username: formData.username,
          name: formData.name,
          age: formData.age,
          address: formData.address,
          password: formData.password,
          avatar: !image ? user?.avatar : uniqueFileName,
        },
        headers: {
          token: `bearer ${user?.accessToken}`,
          id: user?.id,
        },
      });

      if (res.data?.status === "OK") {
        const { _id, name, age, address, username, email, avatar } =
          res.data?.data;

        dispatch(
          signInSuccess({
            id: _id,
            username: username,
            email: email,
            avatar: avatar,
            name,
            age,
            address,
            accessToken: user?.accessToken,
          })
        );
        route.push("/");
      }
    } catch (error: any) {
      dispatch(fetchFailure(error?.response?.data?.message || error.message));
      setErrorMessage(error?.response?.data?.message);
    }
  };
  const handleDeleteUser = async () => {
    try {
      const res = await deleteUserService(user?.id!, user?.accessToken!);
      if (res.status === "OK") {
        await logOutService();
        dispatch(logOut());
        route.push("/sign-in");
      }
    } catch (error: any) {
      dispatch(fetchFailure(error?.response?.data?.message || error.message));
      setErrorMessage(error?.response?.data?.message);
    }
  };
  const getUserListings = async () => {
    try {
      if (userListings?.length <= 0 && showListings === false) {
        const res = await axiosRoot({
          method: "GET",
          url: `listings/user/${user?.id}`,
          headers: {
            token: `bearer ${user?.accessToken}`,
            id: user?.id,
          },
        });
        if (res.data?.status === "OK") {
          setUserListings(res.data?.data);
        }
      }
    } catch (error: any) {
      dispatch(fetchFailure(error?.response?.data?.message || error.message));
      setErrorMessage(error?.response?.data?.message);
      setShowListing(false);
    }
  };
  const handleShowListings = async () => {
    setShowListing(!showListings);
    await getUserListings();
  };
  const handleDeleteListing = async (
    listingId: string,
    accessToken: string,
    userId: string
  ) => {
    try {
      const res = await deleteListingService(listingId, accessToken, userId);
      if (res?.status === "OK") {
        const newListings = userListings?.filter(
          (listing: listing) => listing._id !== listingId
        );
        setUserListings(newListings);
      }
    } catch (error: any) {
      dispatch(fetchFailure(error?.response?.data?.message || error.message));
      setErrorMessage(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-[72px] py-8 px-12 flex flex-col lg:flex-row gap-4">
      <div className="flex flex-col gap-2 lg:w-96 w-full ">
        <div className="flex items-center gap-4 bg-[#c8d1d6] p-4 rounded-lg ">
          {user?.avatar ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="border-[3px] border-[#da9b88] object-cover rounded-full w-12 h-12 "
            />
          ) : (
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
          )}
          <h3 className="font-bold capitalize text-[142f3c] ">
            {user?.username}
          </h3>
        </div>
        <div
          className="bg-[#518759] p-4 rounded-lg cursor-pointer"
          onClick={() => {
            route.push("/create-listing");
          }}
        >
          <span className="text-white ">Create Listing</span>
        </div>
        <div
          className="bg-[#c8d1d6] p-4 rounded-lg cursor-pointer"
          onClick={async () => {
            await logOutService();
            dispatch(logOut());
            route.push("/sign-in");
          }}
        >
          <span className="text-[#50788e] ">Log out</span>
        </div>
        <ButtonComponent
          variant="primary"
          classNames="text-left capitalize"
          onClick={handleShowListings}
        >
          Show Listings
        </ButtonComponent>
        <div className="flex flex-col gap-4 duration-700 ">
          {showListings && (
            <h1 className="text-2xl text-center font-bold p-3">
              Your Listings
            </h1>
          )}
          <div className=" overflow-scroll overflow-x-hidden h-[297px] flex flex-col gap-4 pr-2 scroll-smooth">
            {showListings &&
              userListings?.map((listing: listing) => {
                return (
                  <div
                    key={listing._id}
                    className="flex flex-col justify-between p-3 border-[1px] border-gray-300 rounded-lg shadow-md cursor-pointer "
                  >
                    <div
                      className="flex gap-4 items-center"
                      onClick={() => {
                        route.push(`/listing/detail/${listing._id}`);
                      }}
                    >
                      <img
                        src={listing.image[0]}
                        alt="listing"
                        className="object-contain w-24"
                      />
                      <p className="font-medium break-all">{listing.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-red-600 bg-transparent hover:text-red-300 cursor-pointer pt-3 pr-3 "
                        onClick={() =>
                          handleDeleteListing(
                            listing._id,
                            user?.accessToken,
                            user?.id
                          )
                        }
                      >
                        DELETE
                      </button>
                      <button
                        className="text-green-600 bg-transparent hover:text-green-300 cursor-pointer pt-3 pr-3 "
                        onClick={() => {
                          route.push(`/listing/edit/${listing._id}`);
                        }}
                      >
                        EDIT
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <form
        className={`flex-grow bg-[#f9f9f9] shadow-lg border-[#e0e0e0] divide-y-2 rounded-lg] ${
          showChangPassword === false ? "h-[548.8px]" : "h-[600px]"
        }`}
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-4xl p-6">Profile</h2>
          <ButtonComponent
            variant="crimson"
            classNames="w-1/5"
            onClick={handleDeleteUser}
          >
            Delete Account
          </ButtonComponent>
          <span className="text-red-700 p-6">{errorMessage}</span>
        </div>
        <div className="grid grid-cols-2 divide-x-2 ">
          <div className="flex flex-col justify-between gap-2  pl-6 pt-6 pb-6">
            <div>
              <label
                className="font-medium text-[#c1c1c1] lg:text-2xl text-1xl w-24 lg:w-32 inline-block"
                htmlFor="name"
              >
                Name:{" "}
              </label>
              {editable === true ? (
                <InputComponent
                  onChange={handleChange}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  required={false}
                />
              ) : (
                <span className="text-1xl">{formData.name}</span>
              )}
            </div>
            <div>
              <label
                className="font-medium text-[#c1c1c1] lg:text-2xl text-1xl w-24 lg:w-32 inline-block"
                htmlFor="age"
              >
                Age:{" "}
              </label>
              {editable === true ? (
                <InputComponent
                  onChange={handleChange}
                  type="text"
                  id="age"
                  name="age"
                  value={formData.age}
                  required={false}
                />
              ) : (
                <span className="text-1xl">{formData.age}</span>
              )}
            </div>
            <div>
              <label
                className="font-medium text-[#c1c1c1] lg:text-2xl text-1xl w-24 lg:w-32 inline-block"
                htmlFor="address"
              >
                Address:{" "}
              </label>
              {editable === true ? (
                <InputComponent
                  onChange={handleChange}
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  required={false}
                />
              ) : (
                <span className="text-1xl">{formData.address}</span>
              )}
            </div>
            <div>
              <label
                className="font-medium text-[#c1c1c1] lg:text-2xl text-1xl w-24 lg:w-32 inline-block"
                htmlFor="username"
              >
                Username:{" "}
              </label>
              <span className="text-1xl">{formData.username}</span>
            </div>
            <div>
              <label
                className="font-medium text-[#c1c1c1] lg:text-2xl text-1xl w-24 lg:w-32 inline-block"
                htmlFor="email"
              >
                Email:{" "}
              </label>
              <span className="text-1xl">{formData.email}</span>
            </div>
            {showChangPassword && editable && (
              <div>
                <label
                  className="font-medium text-[#c1c1c1] text-2xl w-36 inline-block"
                  htmlFor="password"
                >
                  Password:{" "}
                </label>
                <InputComponent
                  onChange={handleChange}
                  type="text"
                  id="password"
                  name="password"
                />
              </div>
            )}
            <ButtonComponent
              outline="scarlet"
              classNames="w-32 text-[.5rem] lg:w-1/2 lg:text-[1rem]  "
              onClick={() => {
                if (editable === true) {
                  setShowChangPassword(!showChangPassword);
                }
              }}
            >
              Change Password
            </ButtonComponent>
          </div>
          <div className="flex flex-col gap-4 items-center justify-between py-6">
            <input
              disabled={!editable}
              type="file"
              hidden
              ref={uploadInputRef}
              accept="image/*"
              onChange={(e: any) => {
                setImage(e.target.files[0]);
                const reader = new FileReader();
                reader.onload = () => {
                  if (userSvgRef.current) {
                    hiddenRef.current.src = reader.result;
                    hiddenRef.current.hidden = false;
                    userSvgRef.current.style.display = "none";
                  } else if (previewRef.current) {
                    previewRef.current.src = reader.result;
                  }
                };
                if (
                  uploadInputRef.current.files &&
                  uploadInputRef.current.files[0]
                ) {
                  reader.readAsDataURL(uploadInputRef.current.files[0]);
                }
              }}
            />
            <h6 className="text-[#c8cdd0] text-[1.3rem]">Profile Image</h6>
            <img
              ref={hiddenRef}
              hidden
              alt="avatar"
              className="w-40 h-40 cursor-pointer"
              onClick={() => {
                uploadInputRef?.current?.click();
              }}
            />
            {user?.avatar ? (
              <img
                ref={previewRef}
                src={avatarUrl}
                alt="avatar"
                className="w-40 h-40 cursor-pointer"
                onClick={() => {
                  uploadInputRef?.current?.click();
                }}
              />
            ) : (
              <svg
                onClick={() => {
                  uploadInputRef?.current?.click();
                }}
                ref={userSvgRef}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-40 h-40 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            )}
            <ButtonComponent
              type="button"
              classNames="w-32 text-[.5rem] lg:w-1/2 lg:text-[1rem] "
              outline="scarlet"
              onClick={() => {
                uploadInputRef?.current?.click();
              }}
            >
              Upload
            </ButtonComponent>
          </div>
        </div>
        <div className="flex justify-between items-center p-8">
          <ButtonComponent
            variant="crimson"
            classNames="w-40"
            onClick={() => {
              setEditable(!editable);
            }}
          >
            Edit Profile
          </ButtonComponent>
          <ButtonComponent
            disabled={!editable}
            variant="primary"
            classNames="w-40"
            type="submit"
          >
            {loading ? "Loading..." : "Update"}
          </ButtonComponent>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
