import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/app/api/user/profile-upload";
import Forex from "@/server/models/Forex.mongo";
import User from "@/server/models/User.mongo";
import ForexPayment from "@/server/models/ForexPayment.mongo";

export default handler().put(
	genericAuth,
	async (req: CustomReq, res: NextApiResponse) => {
		try {
			const forex = await Forex.findOne({
				userId: req.user._id,
				_id: req.body.tradeId,
			});

			if (!forex) {
				return errorDispatcher(res, 400, "Trade not found");
			}

			// user.balance.fiat[forex.baseCurrency] -= forex.basePositionAmt;

			const baseExRates = await fetch(
				`https://v6.exchangerate-api.com/v6/9eee23490d7ea87ee1f8cb2b/latest/${forex.baseCurrency}`
			);
			const response = await baseExRates.json();

			if (!baseExRates.ok) {
				throw new Error(response.error);
			}
			const { conversion_rates } = response;

			const entryCostBase = forex.basePositionAmt * forex.entryExRate;
			const exitCostBase =
				forex.basePositionAmt * conversion_rates[forex.quoteCurrency];
			const profitLossBase = exitCostBase - entryCostBase;
			const profitLossTrade =
				profitLossBase * conversion_rates[forex.tradeCurrency];
			req.user.balance.fiat[forex.tradeCurrency] +=
				profitLossTrade + forex.userTradeAmt;

			forex.status = "closed";
			forex.closedAt = new Date();
			forex.exitExRate = conversion_rates[forex.quoteCurrency];

			await Promise.all([
				req.user.save(),
				forex.save(),
				ForexPayment.create({
					userTradeAmt: forex.userTradeAmt,
					userId: req.user._id,
					profit: profitLossTrade,
					tradeId: forex._id,
				}),
			]);

			return successDispatcher(
				res,
				200,
				"Your trade was closed successfully",
				forex
			);
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "User trades was not closed");
		}
	}
);
