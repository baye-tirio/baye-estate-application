import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
//returns the url of the avatar
export const uploadAvatar = async (imageFile, userId) => {
  //   console.log("The profile picture to be uploaded is");
  //   console.log(imageFile);
  console.log("UserId in the uploadAvatar function");
  console.log(userId);
  const uploadResult = await (async () => {
    // if the image already exists let's delete it so that we upload a new one
    const deletionResult = await cloudinary.uploader
      .destroy(`Avatar-${userId}`)
      .catch((error) => {
        console.log(
          "Error deleting old avatar from cloudinary and the error is :"
        );
        console.log(error);
      });
    console.log("After awaiting deletion result");
    console.log({ deletionResult });
    // Upload an image
    const uploadResult = await cloudinary.uploader
      .upload(imageFile, {
        public_id: `Avatar-${userId}`,
      })
      .catch((error) => {
        console.log("Error while uploading the avatar and the error is : ");
        console.log(error);
      });
    console.log(uploadResult);
    return uploadResult;
  })();
  console.log("Avatar cloudinary upload result : ");
  console.log(uploadResult);
  return uploadResult;
};
// returns the url of the uploaded image
export const uploadListingImage = async (imageFile) => {
  //   console.log("Uploading the listing image to cloudinary! and the image is : ");
  //   console.log(imageFile);
  const uploadResult = await (async () => {
    const uploadResult = await cloudinary.uploader
      .upload(imageFile)
      .catch((error) => {
        console.log("error uploading image:");
        console.log(error);
      });
   // console.log(uploadResult);
    return uploadResult;
  })();
  console.log("Result of listing-image upload");
  console.log(uploadResult);
  return uploadResult;
};
//returns the deletion status
export const deleteListingImageFromCloudinary = async (imageUrl) => {
  try {
    const publicId = imageUrl.split("//")[1].split("/").pop().split(".")[0];
    console.log("The public of id of the image trying to be deleted is:");
    console.log(publicId);
    //attempt to delete the image from cloudinary
    const deletionResult = await cloudinary.uploader
      .destroy(publicId)
      .catch((error) => console.log(error));
    console.log({ deletionResult });
    return deletionResult;
  } catch (error) {
    console.log("Unable to delete the image from cloudinary!");
    console.log(error.message);
  }
};
