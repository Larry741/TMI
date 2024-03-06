import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/pages/api/user/profile-upload";
import Commodity from "@/server/models/Commodity.mongo";
import Activity from "@/server/models/Activities.mongo";
import { CURRENCY_SYMBOLS } from "@/utils/constants";

export default handler().post(
	genericAuth,
	async (req: CustomReq, res: NextApiResponse) => {
		try {
			const trade = await Commodity.create({
				...req.body,
				userId: req.user._id,
			});

			req.user.balance.crypto[trade.commodity] -= trade.total;
			req.user.balance.crypto[trade.tradeCurrency] += trade.quoteTotal;

			await Promise.all([
				req.user.save(),
				Activity.create({
					userId: req.user._id,
					activity: `You sold ${trade.total.toLocaleString(undefined, {
						minimumFractionDigits: 0,
						maximumFractionDigits: 4,
					})}${
						trade.commodity === "GOLD" || trade.commodity === "SILVER"
							? "OZ"
							: "barrels"
					} of ${trade.commodity} for ${
						CURRENCY_SYMBOLS[trade.tradeCurrency as "GBP"]
					}${trade.quoteTotal.toLocaleString(undefined, {
						minimumFractionDigits: 0,
						maximumFractionDigits: 4,
					})} `,
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
