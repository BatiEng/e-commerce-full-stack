import { v2 as cloudinary } from "cloudinary";

export const connectCloudinary = async () => {
  try {
    cloudinary.config({
      name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
  } catch (err) {
    console.log(`error occured while connecting cloudinary err: ${err}`);
  }
};
