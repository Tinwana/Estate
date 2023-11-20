"use client";

import ButtonComponent from "@/components/ui/buttonComponent";
import InputComponent from "@/components/ui/inputComponent";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  fetchFailure,
  fetchingSuccess,
  isFetching,
  logOut,
} from "@/redux/userSlice";
import { axiosRoot } from "@/lib/axios/axiosInstance";
import { useRouter } from "next/navigation";
import { logOutService } from "@/services/authServices/logOut";

const CreateListingPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.currentUser);
  const router = useRouter();
  const inputFileRef = useRef<any>(null);
  const [files, setFiles] = useState([]);
  const [uploadError, setUploadError] = useState<boolean | string>(false);
  const [formData, setFormData] = useState({
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
  const handleSubmitUpLoad = (e: any) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storageImage(files[i]));
      }
      Promise.all(promises)
        .then((urls: any) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploadError(false);
          setFiles([]);
          inputFileRef.current.value = null;
        })
        .catch((error: any) => {
          setUploadError("Upload failed: " + error.message);
        });
    } else {
      setUploadError("you only upload 6 images per listing");
    }
  };

  const storageImage = (file: File) => {
    return new Promise((resolve, reject) => {
      dispatch(isFetching());
      const fileName = new Date().getTime() + file.name;
      const fileRef = ref(storage, `listings/${fileName}`);
      const uploadTask = uploadBytesResumable(fileRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        () => {
          dispatch(fetchingSuccess());
          getDownloadURL(uploadTask.snapshot.ref).then((url) => resolve(url));
        }
      );
    });
  };

  const handleRemoveImage = (
    index: number
  ): MouseEventHandler<HTMLButtonElement> | undefined => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
    return;
  };

  const handleChange = (e: any) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "text" ||
      e.target.type === "number" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmitForm = async (e: any) => {
    e.preventDefault();
    try {
      dispatch(isFetching());
      const res = await axiosRoot({
        method: "POST",
        url: "listings",
        data: {
          ...formData,
          image: formData.imageUrls,
          userRef: user?.id,
        },
        headers: {
          token: `bearer ${user?.accessToken}`,
          id: user?.id,
        },
      });
      if (res.data?.status === "OK") {
        dispatch(fetchingSuccess());
        router.push(`/listing/detail/${res.data?.data?._id}`);
      }
    } catch (error: any) {
      dispatch(fetchFailure(error?.response?.data?.message || error.message));
    }
  };
  useEffect(() => {
    if (!user?.id) {
      logOutService();
      dispatch(logOut());
      router.push("/sign-in");
    }
  }, []);
  return (
    <form
      className="mt-[72px] p-3 max-w-4xl mx-auto"
      onSubmit={handleSubmitForm}
    >
      <h1 className="mx-auto text-2xl font-bold text-center p-8">
        Create Listing
      </h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-4">
            <InputComponent
              placeholder="Name"
              id="name"
              classNames="bg-[#fff]"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              placeholder="Description"
              id="description"
              required
              className="border p-3 rounded-lg"
              onChange={handleChange}
              value={formData.description}
            />
            <InputComponent
              placeholder="Address"
              classNames="bg-[#fff]"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />
          </div>
          <div className="flex flex-wrap gap-6 ">
            <div className="flex gap-2">
              <InputComponent
                checked={formData.type === "sale"}
                onChange={handleChange}
                type="checkbox"
                id="sale"
                classNames="w-5"
                required={false}
              />
              <label htmlFor="sale" className="text-[1rem] font-normal">
                Sell
              </label>
            </div>
            <div className="flex gap-2">
              <InputComponent
                checked={formData.type === "rent"}
                onChange={handleChange}
                type="checkbox"
                id="rent"
                classNames="w-5"
                required={false}
              />
              <label htmlFor="rent" className="text-[1rem] font-normal">
                Rent
              </label>
            </div>
            <div className="flex gap-2">
              <InputComponent
                checked={formData.parking}
                onChange={handleChange}
                type="checkbox"
                id="parking"
                classNames="w-5"
                required={false}
              />
              <label htmlFor="parking" className="text-[1rem] font-normal">
                Parking spot
              </label>
            </div>
            <div className="flex gap-2">
              <InputComponent
                checked={formData.furnished}
                onChange={handleChange}
                type="checkbox"
                id="furnished"
                classNames="w-5"
                required={false}
              />
              <label htmlFor="furnished" className="text-[1rem] font-normal">
                Furnished
              </label>
            </div>
            <div className="flex gap-2">
              <InputComponent
                checked={formData.offer}
                onChange={handleChange}
                type="checkbox"
                id="offer"
                classNames="w-5"
                required={false}
              />
              <label htmlFor="offer" className="text-[1rem] font-normal">
                Offer
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <InputComponent
                type="number"
                id="bedrooms"
                required
                classNames="bg-[#fff] w-20"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <label htmlFor="bedrooms" className="text-[1rem] font-normal">
                Beds
              </label>
            </div>
            <div className="flex items-center gap-2">
              <InputComponent
                type="number"
                id="bathrooms"
                required
                classNames="bg-[#fff] w-20"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <label
                htmlFor="bathrooms"
                className="text-[1rem] font-normal text-center"
              >
                Bath
              </label>
            </div>
            <div className="flex items-center gap-2">
              <InputComponent
                type="number"
                id="regularPrice"
                required
                classNames="bg-[#fff] w-28"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <label
                htmlFor="regularPrice"
                className="text-[1rem] font-normal text-center"
              >
                <p>Regular Price</p>
                <span className="text-[.8rem]">($ / month)</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <InputComponent
                type="number"
                id="discountPrice"
                required
                classNames="bg-[#fff] w-28"
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <label
                htmlFor="discountPrice"
                className="text-[1rem] font-normal text-center"
              >
                <p>Discount Price</p>
                <span className="text-[.8rem]">($ / month)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <p>
            <span className="font-bold">Images:</span> The first image will be
            the cover (max 6)
          </p>
          <div className="flex items-center gap-4 mb-3">
            <input
              type="file"
              className="p-3 border-[2px] cursor-pointer border-gray-300 rounded-lg w-full h-16"
              id="images"
              accept="image/*"
              multiple
              ref={inputFileRef}
              onChange={(e: any) => {
                setFiles(e.target.files);
              }}
            />
            <ButtonComponent
              onClick={handleSubmitUpLoad}
              outline="scarlet"
              classNames="w-32 h-16"
              type="button"
            >
              Upload
            </ButtonComponent>
          </div>
          <span className="text-red-500 -mt-6">
            {uploadError && uploadError}
          </span>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((image, index) => (
              <div
                className="flex justify-between items-center border-[1px] border-red-500 rounded p-3 "
                key={image}
              >
                <img
                  src={image}
                  alt="listing"
                  className="object-cover w-28 h-28"
                />
                <button
                  type="button"
                  className="text-red-700 border-red-400 bg-transparent hover:bg-red-100 rounded px-4 py-3 border-[2px] "
                  onClick={() => {
                    handleRemoveImage(index);
                  }}
                >
                  DELETE
                </button>
              </div>
            ))}
          <ButtonComponent type="submit">Create Listing</ButtonComponent>
        </div>
      </div>
    </form>
  );
};

export default CreateListingPage;
