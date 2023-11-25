import { useRouter } from "next/navigation";

const ListingItem = ({ listing }) => {
  const router = useRouter();
  return (
    <>
      <div
        onClick={() => {
          router.push(`/listing/detail/${listing._id}`);
        }}
        className="cursor-pointer rounded-lg shadow-md p-3 flex flex-col gap-3"
      >
        <img
          src={listing.image[0]}
          alt="listingAlt"
          className="h-[320px] sm:h-[220px] w-full object-contain p-2 hover:scale-105 transition-scale duration-300 "
        />
        <div className="text-center">
          <p className="text-lg font-semibold truncate text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-2 truncate">
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
            <p className="text-center">{listing.address}</p>
          </div>
          <p className="text-start">{listing.description}</p>
        </div>
        <p className="font-semibold">
          <span>$ </span>
          {listing.regularPrice}{" "}
          {listing.type === "rent" ? <span>/ month</span> : "  "}
        </p>
        <div className="text-sm font-semibold flex gap-4">
          <p>{listing.bedrooms} beds</p>
          <p>{listing.bathrooms} baths</p>
        </div>
      </div>
    </>
  );
};

export default ListingItem;
