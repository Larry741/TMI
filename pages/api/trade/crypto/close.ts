import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/pages/api/user/profile-upload";
import Crypto from "@/server/models/Crypto.mongo";
import CryptoPayment from "@/server/models/CryptoPayment.mongo";

export default handler().put(
	genericAuth,
	async (req: CustomReq, res: NextApiResponse) => {
		try {
			const crypto = await Crypto.findOne({
				userId: req.user._id,
				_id: req.body.tradeId,
			});

			if (!crypto) {
				return errorDispatcher(res, 400, "Trade not found");
			}

			if (crypto.action === "buy") {
				let cryptoId: string = "";
				if (crypto.baseCoin === "BTC") {
					cryptoId = "bitcoin";
				} else if (crypto.baseCoin === "ETH") {
					cryptoId = "ethereum";
				}

				const baseExRates = await fetch(
					`https://api.coincap.io/v2/assets/${cryptoId}`
				);
				const response = await baseExRates.json();

				if (!baseExRates.ok) {
					throw new Error(response.error);
				}

				const { data } = response;

				req.user.balance.crypto[crypto.baseCoin] -= crypto.total;
				req.user.balance.crypto[crypto.quoteCoin] += +data.priceUsd;

				crypto.status = "closed";
				crypto.closedAt = new Date();
				crypto.exitQuotePrice = Number(
					data.priceUsd.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})
				);

				const profitLossTrade = data.priceUsd - crypto.quoteTotal;

				await Promise.all([
					req.user.save(),
					crypto.save(),
					CryptoPayment.create({
						userTradeAmt: crypto.exitQuotePrice,
						userId: req.user._id,
						profit: profitLossTrade,
						tradeId: crypto._id,
					}),
				]);
			} else {
				let cryptoId: string = "";
				if (crypto.baseCoin === "BTC") {
					cryptoId = "bitcoin";
				} else if (crypto.baseCoin === "ETH") {
					cryptoId = "ethereum";
				}

				const baseExRates = await fetch(
					`https://api.coincap.io/v2/assets/${cryptoId}`
				);
				const response = await baseExRates.json();

				if (!baseExRates.ok) {
					throw new Error(response.error);
				}
				const { data } = response;

				req.user.balance.crypto[crypto.baseCoin] += crypto.total;
				req.user.balance.crypto[crypto.quoteCoin] -= +data.priceUsd;

				crypto.status = "closed";
				crypto.closedAt = new Date();
				crypto.exitQuotePrice = Number(
					data.priceUsd.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})
				);
				const profitLossTrade = crypto.quoteTotal - data.priceUsd;

				await Promise.all([
					req.user.save(),
					crypto.save(),
					CryptoPayment.create({
						userTradeAmt: crypto.exitQuotePrice,
						userId: req.user._id,
						profit: profitLossTrade,
						tradeId: crypto._id,
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
