import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import User from "@/server/models/User.mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyJWT } from "@/server/services/auth.services";
import { genericAuth } from "@/server/middleware/auth";
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");

cloudinary.config({
  cloud_name: "orion147",
  api_key: "545339117628811",
  api_secret: "c3iL0qbKlKxtEDmON114CSNa69A"
});

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 1, fileSize: 2 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req: any, file: any, cb: any) => {
    // Check if the file is an image
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  }
});

export interface CustomReq extends NextApiRequest {
  file?: {
    path: string;
    buffer: any;
  };
  files?: {
    path: string;
    buffer: any;
  }[];
  user?: any;
}

export default handler().put(
  genericAuth,
  multerUpload.single("avatar"),
  async (req: CustomReq, res: NextApiResponse) => {
    try {
      const resizedImageBuffer = await sharp(req?.file?.buffer)
        .toFormat("webp")
        .resize({ width: 500, height: 500 })
        .toBuffer();

      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "Top metro" },
          async (error: any, result: any) => {
            if (error) {
              return errorDispatcher(res, 400, "Error uploading image");
            }

            await User.findOneAndUpdate(
              {
                _id: req.user?._id
              },
              { avatar: result.secure_url }
            );

            return successDispatcher(res, 200, "User Profile image updated", {
              avatar: result.secure_url
            });
          }
        )
        .end(resizedImageBuffer);
    } catch (err: any) {
      console.log(err?.message);
      return errorDispatcher(res, 400, "User Profile image update failed");
    }
  }
);

export const config = {
  api: {
    bodyParser: false
  }
};
