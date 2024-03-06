import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import User from "@/server/models/User.mongo";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "../profile-upload";
import KYC from "@/server/models/KYC.mongo";

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: "orion147",
	api_key: "545339117628811",
	api_secret: "c3iL0qbKlKxtEDmON114CSNa69A",
});

const multerUpload = multer({
	storage: multer.memoryStorage(),
	limits: { files: 2, fileSize: 2 * 1024 * 1024 }, // 2MB limit
	fileFilter: (req: any, file: any, cb: any) => {
		// Check if the file is an image
		if (!file.mimetype.startsWith("image/")) {
			return cb(new Error("Only image files are allowed!"), false);
		}
		cb(null, true);
	},
});

export default handler().post(
	genericAuth,
	multerUpload.any(),
	async (req: CustomReq, res: NextApiResponse) => {
		if (!req.files || !Array.isArray(req.files) || req.files.length < 1) {
			return errorDispatcher(res, 400, "Missing KYC images");
		}

		try {
			const userKycImages: any[] = [];

			for (let img of req.files) {
				await cloudinary.uploader
					.upload_stream(
						{ resource_type: "image", folder: "Top metro/kyc" },
						async (error: any, result: any) => {
							if (error) {
								throw new Error("Error uploading KYC image");
							}

							userKycImages.push(result.secure_url);
						}
					)
					.end(img);
			}

			req.user.isKYCVerified = true;
			await Promise.all([
				req.user.save(),
				KYC.create({
					...req.body,
					userId: req.user._id,
					frontImg: userKycImages[0],
					backImg: userKycImages[1],
				}),
			]);

			return successDispatcher(res, 200, "KYC completed successfully", {});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(
				res,
				400,
				"An error ocurred while saving your KYC details."
			);
		}
	}
);
