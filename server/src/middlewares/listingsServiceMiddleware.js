import Listing from "../models/listing.model.js";
import { toBoolean } from "../util/convertBoolen.js";
const listingsServiceMiddleware = async (req, res, next) => {
  if (req.query.sort !== "asc" && req.query.sort !== "desc") {
    req.query.sort = "desc";
  }
  let offer = req.query.offer;
  let furnished = req.query.furnished;
  let parking = req.query.parking;
  let type = req.query.type;
  offer = toBoolean(offer);
  furnished = toBoolean(furnished);
  parking = toBoolean(parking);
  if ((offer === undefined) | (offer === false)) {
    offer = { $in: [false, true] };
  }
  if ((furnished === undefined) | (furnished === false)) {
    furnished = { $in: [false, true] };
  }
  if ((parking === undefined) | (parking === false)) {
    parking = { $in: [false, true] };
  }
  if ((type === undefined) | (type === "all")) {
    type = { $in: ["sale", "rent"] };
  }
  const filterBy = req.query.filter || "name";
  const filterValue =
    req.query.filter_value === undefined ? "" : req.query.filter_value;
  let escapeFilterValue;
  const sort = req.query.sort;
  const sortBy = req.query.sort_by || "createdAt";
  let allListings = await Listing.find();
  if (!!sort || !!sortBy) {
    allListings = await Listing.find().sort({ [sortBy]: sort });
  }
  if (!!filterBy) {
    escapeFilterValue = filterValue.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
    allListings = await Listing.find({
      offer,
      furnished,
      parking,
      type,
      [filterBy]: { $regex: new RegExp(escapeFilterValue, "i") },
    });
  }
  const limit =
    parseInt(req.query.limit) > allListings.length + 1
      ? allListings.length + 1
      : parseInt(req.query.limit) || allListings.length;
  let page =
    parseInt(req.query.limit) > allListings.length + 1
      ? 1
      : parseInt(req.query.page) || 1;
  const totalPages = Math.ceil(allListings.length / limit);
  if (page > totalPages) page = 1;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  let stateGetListing;
  if (limit === allListings.length) {
    stateGetListing = "all";
  } else {
    stateGetListing = "";
  }
  const listingService = allListings.slice(startIndex, endIndex);
  req.listingService = {
    stateGetListing,
    currentPage: page,
    totalPages,
    limit,
    Listings: listingService,
  };
  next();
};
export { listingsServiceMiddleware };
