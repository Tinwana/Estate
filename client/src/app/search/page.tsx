"use client";
import ButtonComponent from "@/components/ui/buttonComponent";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchingSuccess, isFetching } from "@/redux/userSlice";
import { searchService } from "@/services/searchService";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import ListingItem from "@/components/ui/listingsItem";

const SearchPage = () => {
  const loading = useAppSelector((state) => state.user.loading);
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [listings, setListings] = useState<any>([]);
  const [showMore, setShowMore] = useState(1);
  const searchParamsValue = searchParams.get("filter_value");
  const decodedParamsValue =
    searchParamsValue !== null ? decodeURIComponent(searchParamsValue) : "";
  const [sidebarData, setSidebarData] = useState<any>({
    filter_value: decodedParamsValue,
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort_by: "createdAt",
    sort: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchValueUrl = urlParams.get("filter_value");
    const decodedSearchValue =
      searchValueUrl !== null ? decodeURIComponent(searchValueUrl) : "";
    const typeUrl = urlParams.get("type");
    const parkingUrl = urlParams.get("parking");
    const furnishedUrl = urlParams.get("furnished");
    const offerUrl = urlParams.get("offer");
    const sortUrl = urlParams.get("sort");
    const sort_byUrl = urlParams.get("sort_by");
    if (
      searchValueUrl ||
      typeUrl ||
      parkingUrl ||
      furnishedUrl ||
      offerUrl ||
      sortUrl ||
      sort_byUrl
    ) {
      setSidebarData({
        ...sidebarData,
        filter_value: decodedSearchValue || "",
        type: typeUrl || "all",
        parking: parkingUrl === "true" ? true : false,
        furnished: furnishedUrl === "true" ? true : false,
        offer: offerUrl === "true" ? true : false,
        sort_by: sort_byUrl || "createdAt",
        sort: sortUrl || "desc",
      });
    }
    const fetchListings = async () => {
      dispatch(isFetching());
      const searchQuery = urlParams.toString();
      try {
        const res = await searchService(searchQuery, 2, showMore);
        if (res?.status === "OK") {
          dispatch(fetchingSuccess());
          setListings(res?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchListings();
  }, [location.search, showMore]);

  const handleChange = (e: any) => {
    if (
      e.target.id === "all" ||
      e.target.id === "sale" ||
      e.target.id === "rent"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }
    if (e.target.id === "filter_value") {
      setSidebarData({ ...sidebarData, filter_value: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_by") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebarData({ ...sidebarData, sort: order, sort_by: sort });
    }
  };
  const handleSearchSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const urlParams = new URLSearchParams();
      urlParams.set("filter_value", sidebarData.filter_value);
      urlParams.set("type", sidebarData.type);
      urlParams.set("parking", sidebarData.parking);
      urlParams.set("furnished", sidebarData.furnished);
      urlParams.set("offer", sidebarData.offer);
      urlParams.set("sort", sidebarData.sort);
      urlParams.set("sort_by", sidebarData.sort_by);
      const searchQuery = urlParams.toString();
      router.push(`/search?${searchQuery}`);
      fetchListings(searchQuery);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchListings = async (search: string) => {
    dispatch(isFetching());
    try {
      const res = await searchService(search, 2, showMore);
      if (res?.status === "OK") {
        dispatch(fetchingSuccess());
        setListings(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(listings);

  return (
    <div className="mt-[72px] flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label
              className="whitespace-nowrap font-semibold"
              htmlFor="filter_value"
            >
              Search:{" "}
            </label>
            <input
              type="text"
              id="filter_value"
              placeholder="Search..."
              onChange={handleChange}
              value={sidebarData.filter_value}
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <label htmlFor="">Type</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <label htmlFor="all">Rent & Sale</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <label htmlFor="sale">Sale</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <label htmlFor="">Amenities</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <label htmlFor="parking">Parking</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort">Sort</label>
            <select
              id="sort_by"
              className="border rounded-lg p-3"
              onChange={handleChange}
              defaultValue="createdAt_desc"
            >
              <option value="regularPrice_asc">Price low to hight</option>
              <option value="regularPrice_desc">Price high to low</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <ButtonComponent type="submit">Search</ButtonComponent>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 mt-5">
          Listings Result:
        </h1>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-7">
          {!loading && listings?.Listings?.length === 0 && (
            <p className="text-xl text-slate-700 font-semibold">
              No listing found!
            </p>
          )}
          {!loading &&
            listings?.Listings?.length > 0 &&
            listings?.Listings?.map((listing: listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>
        <div className="flex justify-between p-3">
          <p
            className="text-xl text-blue-400 font-bold cursor-pointer"
            onClick={() => {
              if (showMore === 1) {
                setShowMore(1);
              } else {
                setShowMore((pre) => pre - 1);
              }
            }}
          >
            Pre
          </p>
          <p
            className="text-xl text-blue-400 font-bold cursor-pointer"
            onClick={() => {
              if (showMore === listings?.totalPages) {
                setShowMore(showMore);
              } else {
                setShowMore((pre) => pre + 1);
              }
            }}
          >
            Next
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
