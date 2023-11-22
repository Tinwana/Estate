import express from "express";
import listingController from "../controllers/listing.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { listingsServiceMiddleware } from "../middlewares/listingsServiceMiddleware.js";

const listingRoute = express.Router();

listingRoute.patch(
  "/:listingId",
  authMiddleware,
  listingController.updateListing
);
listingRoute.get(
  "/user/:userId",
  authMiddleware,
  listingController.getUserListing
);
listingRoute.get("/:listingId", listingController.getDetailListing);
listingRoute.delete(
  "/:listingId",
  authMiddleware,
  listingController.deleteListing
);
listingRoute.post("/", authMiddleware, listingController.createListing);
listingRoute.get(
  "/",
  listingsServiceMiddleware,
  listingController.getAllListings
);

export default listingRoute;
