import userModel from "../models/users.model.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { manualError } from "../utils/error.mjs";
export const signUp = async (req, res, next) => {
  try {
    console.log("Signing Up");
    const { username, email, password } = req.body;
    const hashed_password = bcrypt.hashSync(password, 10);
    const newUser = new userModel({
      username,
      email,
      password: hashed_password,
    });
    await newUser.save();
    res.status(201).json({
      message: "The signUp information is :",
      user: newUser,
    });
  } catch (error) {
    //  res.status(500).json(error.message);
    next(error);
  }
};
//sign in middleware/controller
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await userModel.findOne({ email: email });
    //first check if the user is there if not return an error
    if (!validUser) {
      next(manualError(404, "User Not Found!"));
    }
    //Means the user is valid
    else {
      const ValidPassword = bcrypt.compareSync(password, validUser.password);
      // console.log("The value of ValidPassword is : ");
      // console.log(ValidPassword);
      if (!ValidPassword) {
        // console.log("In the wrong password triggering section!");
        next(manualError(401, "Wrong Password!"));
      } else {
        //Generation of the JWT token for the user
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        //saving the token as a cookie
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json({
            message: "Successfull Sign in",
            user: rest,
          });
      }
    }
  } catch (error) {
    next(error);
  }
};
//Sign in with google middleware
export const googleAuth = async (req, res, next) => {
  const { email , name , photo } = req.body;
  try {
    const user = await userModel.findOne({ email });
    //If the user exists then sign in the user
    if (user) {
      //create a token for the user and send it back to the client via the header
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      const {password:pass,...rest} = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({
          message: "Successfull Sign in With Google",
          user: rest,
        });
    }
    //What if the user is not in the database already that means we pose to sign them up
    else {
      //generate a random password
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword,10);
      const newUser = new userModel({
        username:name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email,
        password:hashedPassword,
        avatar:photo
      });
      const savedUser = await newUser.save();
      //create a token for the user and send it back to the client via the header
      const token = jwt.sign({ id: savedUser.id }, process.env.JWT_SECRET);
      const {password:pass,...rest} = savedUser._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({
          message: "Successfull Sign in With Google",
          user: rest,
        });
    }
  } catch (error) {
    next(error);
  }
};
