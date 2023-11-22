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
  async updateListing(req, res, next) {
    try {
      const listingId = req.params.listingId;
      const listing = await Listing.findById(listingId);
      const updateListing = await Listing.findByIdAndUpdate(
        listingId,
        req.body,
        { new: true }
      );
      if (!listingId) {
        return res.status(400).json({
          status: "error",
          message: "listing Id is required!",
        });
      }
      if (!listing) {
        return res.status(400).json({
          status: "error",
          message: "listing not found!",
        });
      }
      if (updateListing) {
        return res.status(200).json({
          status: "OK",
          message: "Update listing successfully!",
          data: updateListing,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async getDetailListing(req, res, next) {
    try {
      const listingId = req.params.listingId;
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(400).json({
          status: "error",
          message: "listing not found!",
        });
      } else {
        return res.status(200).json({
          status: "OK",
          message: "listing has found!",
          data: listing,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getDetailListing(req, res, next) {
    try {
      const listingId = req.params.listingId;
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(400).json({
          status: "error",
          message: "listing not found!",
        });
      } else {
        return res.status(200).json({
          status: "OK",
          message: "listing has found!",
          data: listing,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async getAllListings(req, res, next) {
    try {
      return res.status(200).json({
        status: "OK",
        message: "listings has found!",
        data: req.listingService,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default new listingController();
