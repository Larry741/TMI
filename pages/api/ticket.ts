import isEmail from "validator/lib/isEmail";
import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { disconnectDb } from "@/utils/mongo";
import Ticket from "@/server/models/Ticket.mongo";
import { NextApiRequest, NextApiResponse } from "next";

export default handler().post(
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			await Ticket.create({ ...req.body });
			return successDispatcher(
				res,
				200,
				"Ticket created successfully. We will respond to your request shortly",
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
