import { manualError } from "../utils/error.mjs";
import listingModel from "../models/listing.model.mjs";
export const createListing = async (req, res, next) => {
  try {
    const newListing = { ...req.body, userRef: req.userToken.id };
    const listing = await listingModel.create(newListing);
    res.status(201).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};
export const getUserListings = async (req, res, next) => {
  if (req.params.id !== req.userToken.id)
    next(manualError(401, "You can only see your own listings!"));
  else {
    try {
      const listings = await listingModel.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  }
};
//controller/middleware to delete a particular user listing
export const deleteUserListing = async (req, res, next) => {
  if (req.userToken.id !== req.params.user_id)
    next(manualError(401, "You can only delete your own listing!"));
  try {
    await listingModel.findByIdAndDelete(req.params.listing_id);
    res.status(200).json("Listing successfully deleted!");
  } catch (error) {
    next(error);
  }
};
//edit a user listing
export const updateUserListing = async (req, res, next) => {
  try {
    const updatedListing = await listingModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          address: req.body.address,
          regularPrice: req.body.regularPrice,
          discountedPrice: req.body.discountedPrice,
          bathrooms: req.body.bathrooms,
          bedrooms: req.body.bedrooms,
          furnished: req.body.furnished,
          parking: req.body.parking,
          type: req.body.type,
          offer: req.body.offer,
          imageUrls: req.body.imageUrls,
        },
      },
      { new: true }
    );
    res.status(200).json({
      message: "Successfully updated the the listing",
      listing: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};
//Get particular listing details based off it's id
export const getListingDetails = async (req, res, next) => {
  try {
    const listing = await listingModel.findById(req.params.id);
    if (!listing) next(manualError(404, "Listing Not Found !"));
    else {
      res.status(200).json(listing);
    }
  } catch (error) {
    next(error);
  }
};
//middleware to handle pagination for the home page typeshit and other pagination needs
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;

    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;

    if (offer === undefined || offer === "false")
      offer = { $in: [true, false] };

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false")
      furnished = { $in: [true, false] };

    let parking = req.query.parking;

    if (parking === undefined || parking === "false")
      parking = { $in: [true, false] };

    let type = req.query.type;

    if (type === undefined || type === "all") type = { $in: ["rent", "sale"] };

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await listingModel
      .find({
        name: { $regex: searchTerm, $options: "i" },
        offer,
        furnished,
        parking,
        type,
      })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
