import handler from "@/utils/handler";
import User from "@/server/models/User.mongo";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { sendEmail } from "@/utils/mailUser";
import {
	generateJWT,
	generateSecret,
	generateTotp,
} from "@/server/services/auth.services";
import { NextApiRequest, NextApiResponse } from "next";
import Investment from "@/server/models/Investment.mongo";
import Rates from "@/server/models/Rate.mongo";

export default handler().post(
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			console.log("here");
			return successDispatcher(res, 200, "Signup successfull", {});
		} catch (err: any) {
			console.log(err);

			return errorDispatcher(
				res,
				500,
				"Server error, we could not complete your request"
			);
		}
	}
);
