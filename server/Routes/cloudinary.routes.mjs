import { Router } from "express";
import {
  uploadAvatar,
  uploadListingImage,
} from "../utils/uploadToCloudinary.mjs";
import userModel from "../models/users.model.mjs";
const router = Router();
router.post("/listing-image", async (req, res, next) => {
  try {
    const { image } = req.body;
    const result = await uploadListingImage(image);
    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/avatar", async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userToken.id);
    const { avatar } = req.body;
    const result = await uploadAvatar(avatar, user._id);
    res.status(200).json({
      success: true,
      avatarUrl: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
