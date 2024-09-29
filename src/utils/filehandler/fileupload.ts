import dotenv from "dotenv";
dotenv.config()

import multer from "multer";
import cloudiary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudiary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudiary.v2,
});

const parser = multer({ storage });

export const singleUpload = parser.single("image");
export const multipleUpload = parser.array("images", 10);
