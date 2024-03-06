import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/pages/api/user/profile-upload";
import Commodity from "@/server/models/Commodity.mongo";
import Activity from "@/server/models/Activities.mongo";
import { CURRENCY_SYMBOLS } from "@/utils/constants";

export default handler()
	.post(genericAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			const trade = await Commodity.create({
				...req.body,
				userId: req.user._id,
			});

			req.user.balance.commodity[trade.commodity] += trade.total;
			req.user.balance.fiat[trade.tradeCurrency] -= trade.quoteTotal;

			await Promise.all([
				req.user.save(),
				Activity.create({
					userId: req.user._id,
					activity: `You bought ${trade.tradeTotal.toLocaleString(undefined, {
						minimumFractionDigits: 0,
						maximumFractionDigits: 4,
					})}${trade.tradeWeight} of ${trade.commodity} for ${
						CURRENCY_SYMBOLS[trade.tradeCurrency as "GBP"]
					}${trade.quoteTotal.toLocaleString(undefined, {
						minimumFractionDigits: 0,
						maximumFractionDigits: 4,
					})}`,
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
	})
	.get(genericAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			const query = req.query;

			const queryParams: any = { userId: req.user._id };
			if (query) {
				queryParams.status = query.status;
			}

			const trades = await Commodity.find(queryParams);
			const count = await Commodity.countDocuments(queryParams);

			return successDispatcher(res, 200, "User trades fetched", {
				trades,
				count,
			});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "User trades data could not be fetched");
		}
	});
