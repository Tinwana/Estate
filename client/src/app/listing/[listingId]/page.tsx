import React from "react";

const ListingDetailPage = ({ params }: { params: { listingId: string } }) => {
  const { listingId } = params;
  return (
    <div className="mt-[72px]">
      <h1>{listingId}</h1>
    </div>
  );
};

export default ListingDetailPage;
