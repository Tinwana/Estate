import express from "express";
import listingController from "../controllers/listing.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const listingRoute = express.Router();

listingRoute.post("/", authMiddleware, listingController.createListing);
listingRoute.get("/:userId", authMiddleware, listingController.getUserListing);
listingRoute.delete(
  "/:listingId",
  authMiddleware,
  listingController.deleteListing
);

export default listingRoute;
