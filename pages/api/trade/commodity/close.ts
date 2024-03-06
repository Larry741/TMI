import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/app/api/user/profile-upload";
import Commodity from "@/server/models/Commodity.mongo";
import CommodityPayment from "@/server/models/CommodityPayment.mongo";

export default handler().put(
	genericAuth,
	async (req: CustomReq, res: NextApiResponse) => {
		try {
			const trade = await Commodity.findOne({
				userId: req.user._id,
				_id: req.body.tradeId,
			});

			if (!trade) {
				return errorDispatcher(res, 400, "Trade not found");
			}

			if (trade.action === "buy") {
				let commodityId: string = "";
				if (trade.commodity === "GOLD") {
					commodityId = "WTI";
				} else if (trade.commodity === "OIL") {
					commodityId = "BRENT";
				} else if (trade.commodity === "SILVER") {
					commodityId = "BRENT";
				}

				const baseExRates = await fetch(
					`https://api.coincap.io/v2/assets/${commodityId}`
				);
				const response = await baseExRates.json();

				if (!baseExRates.ok) {
					throw new Error(response.error);
				}

				const { data } = response;

				req.user.balance.commodity[trade.commodity] -= trade.total;
				req.user.balance.fiat[trade.tradeCurrency] += +data.priceUsd;

				trade.status = "closed";
				trade.closedAt = new Date();
				trade.exitQuotePrice = Number(
					data.priceUsd.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})
				);

				const profitLossTrade = data.priceUsd - trade.quoteTotal;

				await Promise.all([
					req.user.save(),
					trade.save(),
					CommodityPayment.create({
						userTradeAmt: trade.exitQuotePrice,
						userId: req.user._id,
						profit: profitLossTrade,
						tradeId: trade._id,
					}),
				]);
			} else {
				let commodityId: string = "";
				if (trade.commodity === "GOLD") {
					commodityId = "WTI";
				} else if (trade.commodity === "OIL") {
					commodityId = "BRENT";
				} else if (trade.commodity === "SILVER") {
					commodityId = "BRENT";
				}

				const baseExRates = await fetch(
					`https://api.coincap.io/v2/assets/${commodityId}`
				);
				const response = await baseExRates.json();

				if (!baseExRates.ok) {
					throw new Error(response.error);
				}
				const { data } = response;

				req.user.balance.commodity[trade.commodity] += trade.total;
				req.user.balance.fiat[trade.tradeCurrency] -= +data.priceUsd;

				trade.status = "closed";
				trade.closedAt = new Date();
				trade.exitQuotePrice = Number(
					data.priceUsd.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})
				);
				const profitLossTrade = trade.quoteTotal - data.priceUsd;

				await Promise.all([
					req.user.save(),
					trade.save(),
					CommodityPayment.create({
						userTradeAmt: trade.exitQuotePrice,
						userId: req.user._id,
						profit: profitLossTrade,
						tradeId: trade._id,
					}),
				]);
			}

			return successDispatcher(
				res,
				200,
				"Your trade was closed successfully",
				crypto
			);
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "User trades was not closed");
		}
	}
);
