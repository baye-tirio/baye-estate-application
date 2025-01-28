import { Router } from "express";
import {
  createListing,
  getUserListings,
  deleteUserListing,
  updateUserListing,
  getListingDetails,
  getListings,
} from "../controllers/listing.controllers.mjs";
import { verifyToken } from "../utils/verifyUser.mjs";
const router = Router();
//This is for posting Listings into the database
router.post("/create", verifyToken, createListing);
//This is for retrieving Particular User Listings from the database
router.get("/user/:id", verifyToken, getUserListings);
//This is for deleting particular user listing
router.delete("/delete/:user_id/:listing_id", verifyToken, deleteUserListing);
//This is for updating a listing
router.post("/update/:id", verifyToken, updateUserListing);
//This route is for getting the details of a particular listing based on the id
router.get("/:id", getListingDetails);
// This route is for pagination
router.get("/search/get-listings",getListings);
export default router;
