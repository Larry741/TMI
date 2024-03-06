import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/app/api/user/profile-upload";
import Investment from "@/server/models/Investment.mongo";
import { CURRENCY_SYMBOLS, INVESTMENT_TYPES } from "@/utils/constants";
import Activity from "@/server/models/Activities.mongo";

export default handler().put(
	genericAuth,
	async (req: CustomReq, res: NextApiResponse) => {
		try {
			const investment = await Investment.findOne({
				userId: req.user._id,
				status: "active",
			});

			if (!investment) {
				return errorDispatcher(res, 400, "Your investment could not be found");
			}

			investment.status = "closed";
			req.user.balance.fiat[investment.currency] += investment.amount;
			req.user.balance.fiat[investment.currency] += investment.profits;

			await Promise.all([
				req.user.save(),
				investment.save(),
				Activity.create({
					userId: req.user._id,
					activity: `${`You opted out of ${req.body.type.toUpperCase()} investment plan. Your total profits was ${
						CURRENCY_SYMBOLS[investment.currency as "GBP"]
					}${investment.profits}`} `,
				}),
			]);

			return successDispatcher(res, 200, "Investment was closed.", {});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "User investment could not closed.");
		}
	}
);
