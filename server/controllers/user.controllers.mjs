import userModel from "../models/users.model.mjs";
import { manualError } from "../utils/error.mjs";
import bcrypt from "bcrypt";

export const updateUser = async (req, res, next) => {
  if (req.userToken.id !== req.params.id)
    next(manualError(401, "You can only update your own account!"));
  else {
    try {
      //now here is where we have the user update logic
      //encrypt the password if the user wants to update the password
      if (req.body.password)
        req.body.password = bcrypt.hashSync(req.body.password, 10);
      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );
      const { password: pass, ...rest } = updatedUser._doc;
      res.status(200).json({
        message: "Successfully updated the user!",
        user: rest,
      });
    } catch (error) {
      next(error);
    }
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.userToken.id !== req.params.id)
    next(manualError(401, "You can only delete your own account!"));
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).clearCookie('access_token').json('User has been successfully deleted!');
  } catch (error) {
    next(error);
  }
};
//sign-out endpoint
export const signOut = (req,res,next) => {
  try {
    res.clearCookie('access_token').status(200).json('Successfully signed out!');
  } catch (error) {
    next(error);
  }
}
//get user info
export const getUserInfo = async (req,res,next) => {
  try {
    const retrievedUser = await userModel.findById(req.params.id);
    if(!retrievedUser) next(manualError(404,"User Not Found!"));
    else {
      const {password:pass, ...rest} = retrievedUser._doc;
      res.status(200).json({
        message:"successfully retrieved the user",
        landLord:rest
      })
    }
  } catch (error) {
    next(error);
  }
}
