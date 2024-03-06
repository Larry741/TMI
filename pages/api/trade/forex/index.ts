import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/pages/api/user/profile-upload";
import Forex from "@/server/models/Forex.mongo";
import Activity from "@/server/models/Activities.mongo";
import { CURRENCY_SYMBOLS } from "@/utils/constants";

export default handler()
	.post(genericAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			const trade = await Forex.create({
				...req.body,
				userId: req.user._id,
				tradeCurrency: req.user.currency,
			});

			const user = req.user;
			// user.balance.fiat[trade.baseCurrency] += trade.basePositionAmt;
			user.balance.fiat[trade.tradeCurrency] -= trade.userTradeAmt;

			await Promise.all([
				user.save(),
				Activity.create({
					userId: req.user._id,
					activity: `You placed a ${trade.action} order on ${
						trade.pair.split(":")[1]
					} pair for ${
						CURRENCY_SYMBOLS[trade.tradeCurrency as "GBP"]
					}${trade.userTradeAmt.toLocaleString()}`,
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

			const trades = await Forex.find(queryParams);
			const count = await Forex.countDocuments(queryParams);

			return successDispatcher(res, 200, "User trades fetched", {
				trades,
				count,
			});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "User trades data could not be fetched");
		}
	});
