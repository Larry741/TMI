import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/app/api/user/profile-upload";
import Crypto from "@/server/models/Crypto.mongo";
import Activity from "@/server/models/Activities.mongo";

export default handler().post(
	genericAuth,
	async (req: CustomReq, res: NextApiResponse) => {
		try {
			const trade = await Crypto.create({
				...req.body,
				userId: req.user._id,
			});

			req.user.balance.crypto[trade.baseCoin] -= trade.total;
			req.user.balance.crypto[trade.quoteCoin] += trade.quoteTotal;

			await req.user.save();
			await Promise.all([
				req.user.save(),
				Activity.create({
					userId: req.user._id,
					activity: `You sold ${trade.total}${
						trade.baseCoin
					} for ${trade.quoteTotal.toLocaleString()}${trade.quoteCoin}`,
				}),
			]);

			return successDispatcher(
				res,
				200,
				"Your trade was placed successfully",
				trade
			);
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(
				res,
				400,
				"Could not place trade. Please try again"
			);
		}
	}
);
