import isEmail from "validator/lib/isEmail";
import handler from "@/utils/handler";
import Newsletter from "@/server/models/Newsletter.mongo";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { disconnectDb } from "@/utils/mongo";
import { NextApiRequest, NextApiResponse } from "next";

export default handler().post(
	async (req: NextApiRequest, res: NextApiResponse) => {
		const { email } = req.body;

		if (typeof email !== "string" || !email || !isEmail(email)) {
			return errorDispatcher(res, 400, "Invalid email address");
		}

		try {
			await Newsletter.findOneAndUpdate({ email }, { email }, { upsert: true });
			return successDispatcher(
				res,
				200,
				"Newsletter subscribed successfully",
				{}
			);
		} catch (err: any) {
			console.log(err.message);
			return errorDispatcher(
				res,
				400,
				"An error ocurred while subscribing to newsletter"
			);
		}
	}
);
