import Listing from "../models/listing.model.js";

class listingController {
  async createListing(req, res, next) {
    try {
      const create = await Listing.create(req.body);
      if (create) {
        return res.status(201).json({
          status: "OK",
          message: "Create listing successfully!",
          data: create,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async getUserListing(req, res, next) {
    try {
      const userId = req.params.userId;
      const listings = await Listing.find({ userRef: userId });
      if (listings !== null) {
        return res.status(201).json({
          status: "OK",
          message: "Find user listings successfully!",
          data: listings,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async deleteListing(req, res, next) {
    try {
      const listingId = req.params.listingId;
      const deleteListing = await Listing.findByIdAndDelete(listingId);
      if (!listingId) {
        return res.status(400).json({
          status: "error",
          message: "listing Id is required!",
        });
      }
      if (deleteListing) {
        return res.status(200).json({
          status: "OK",
          message: "Delete listing successfully!",
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
export default new listingController();
