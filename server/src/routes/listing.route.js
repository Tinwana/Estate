import express from "express";
import listingController from "../controllers/listing.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const listingRoute = express.Router();

listingRoute.post("/", authMiddleware, listingController.createListing);
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
listingRoute.get(
  "/:listingId",
  authMiddleware,
  listingController.getDetailListing
);
listingRoute.delete(
  "/:listingId",
  authMiddleware,
  listingController.deleteListing
);

export default listingRoute;
