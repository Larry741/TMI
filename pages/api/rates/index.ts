import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import Ticket from "@/server/models/Ticket.mongo";
import { NextApiRequest, NextApiResponse } from "next";
import Rates from "@/server/models/Rate.mongo";

export default handler().get(
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			await Rates.findOne({ id: "larry1" });
			return successDispatcher(
				res,
				200,
				"Ticket created successfully. We will respond to your request shortly",
				Rates
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
