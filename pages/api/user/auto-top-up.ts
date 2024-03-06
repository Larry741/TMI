import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import User from "@/server/models/User.mongo";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "./profile-upload";
import AutoTopUp from "@/server/models/TopUpDetails";

export default handler().post(
	genericAuth,
	async (req: CustomReq, res: NextApiResponse) => {
		try {
			req.user.autoTopUpEnabled = true;
			await Promise.all([
				req.user.save(),
				AutoTopUp.create({
					...req.body,
					userId: req.user,
				}),
			]);

			return successDispatcher(res, 200, "Auto Top-up enabled", {});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(
				res,
				400,
				"Error enabling Auto Top-up, Please try again."
			);
		}
	}
);
