"use client";
import ButtonComponent from "@/components/ui/buttonComponent";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = useState({
    filter_value: searchParams.get("filter_value"),
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort_by: "created_at",
    sort: "desc",
  });

  return (
    <div className="mt-[72px] flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
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
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <label htmlFor="">Type</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-5" />
              <label htmlFor="all">Rent & Sale</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <label htmlFor="sale">Sale</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <label htmlFor="">Amenities</label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <label htmlFor="parking">Parking</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <label htmlFor="furnished">Furnished</label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort">Sort</label>
            <select id="sort_by" className="border rounded-lg p-3">
              <option value="">Price low to hight</option>
              <option value="">Price high to low</option>
              <option value="">Latest</option>
              <option value="">Oldest</option>
            </select>
          </div>
          <ButtonComponent type="submit">Search</ButtonComponent>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 mt-5">
          Listings Result:
        </h1>
      </div>
    </div>
  );
};

export default SearchPage;
