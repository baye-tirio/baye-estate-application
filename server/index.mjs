import express from "express";
import mongoose from "mongoose";
import UserRoutes from "./Routes/user.route.mjs";
import AuthenticationRoutes from "./Routes/auth.routes.mjs";
import ListingRoutes from "./Routes/listing.routes.mjs";
import path from "path";
import cookieParser from "cookie-parser";
import CloudinaryRoutes from "./Routes/cloudinary.routes.mjs";
import dotenv from "dotenv";
import { verifyToken } from "./utils/verifyUser.mjs";
dotenv.config();
const PORT = process.env.PORT;
mongoose
  .connect(process.env.DB_REMOTE)
  .then((connection) => {
    console.log(
      "Successfully connected to the database on : ",
      connection.connection.host
    );
  })
  .catch((error) => {
    console.log(error);
    console.log("Failed to connect to the database ");
  });
const __dirname = path.resolve();
console.log({__dirname});
const app = express();
app.use(express.json({ limit: "200mb" }));
app.use(cookieParser());
app.use("/api/user", UserRoutes);
app.use("/api/authenticate", AuthenticationRoutes);
app.use("/api/listing", ListingRoutes);
app.use("/api/cloudinary", verifyToken, CloudinaryRoutes);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.use((err, req, res, next) => {
  // console.log(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
