import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import User from "@/server/models/User.mongo";
import { NextApiResponse } from "next";
import { adminAuth } from "@/server/middleware/auth";
import { CustomReq } from "../profile-upload";
import { sendEmail } from "@/utils/mailUser";

export default handler().put(
	adminAuth,
	async (req: CustomReq, res: NextApiResponse) => {
		try {
			const users = User.find({});

			const message = `
			<h2>Top Metro Investment</h1>
	
			<p>${req.body.message}</p>
		`;

			users.array.forEach(async (user: any) => {
				await sendEmail(user.email, req.body.subject, message);
			});

			return successDispatcher(
				res,
				200,
				"User details updated successfully",
				{}
			);
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(
				res,
				400,
				"An error ocurred while updating user details"
			);
		}
	}
);
