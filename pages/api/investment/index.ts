import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/pages/api/user/profile-upload";
import Investment from "@/server/models/Investment.mongo";
import { CURRENCY_SYMBOLS, INVESTMENT_TYPES } from "@/utils/constants";
import Activity from "@/server/models/Activities.mongo";

export default handler()
	.post(genericAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			if (
				req.user.balance.fiat[req.user.currency] <
				INVESTMENT_TYPES[req.body.type.toLowerCase() as "gold"].amount
			) {
				return errorDispatcher(
					res,
					400,
					`Insufficient funds in your ${req.user.currency} account`
				);
			}

			const activeinvestment = await Investment.findOne({
				userId: req.user._id,
				status: "active",
			});

			let isBelowActiveLevel = false;
			if (
				activeinvestment &&
				INVESTMENT_TYPES[activeinvestment.type as "gold"].level >=
					INVESTMENT_TYPES[req.body.type.toLowerCase() as "gold"].level
			) {
				isBelowActiveLevel = true;
			}

			if (isBelowActiveLevel) {
				return errorDispatcher(
					res,
					400,
					"You cannot subscribe to a lower investment plan"
				);
			}

			let investment;
			if (activeinvestment) {
				activeinvestment.amount +=
					INVESTMENT_TYPES[req.body.type.toLowerCase() as "gold"].amount;
				activeinvestment.type = req.body.type;
				activeinvestment.level =
					INVESTMENT_TYPES[req.body.type.toLowerCase() as "gold"].level;

				await activeinvestment.save();

				investment = activeinvestment;
			} else {
				investment = await Investment.create({
					amount:
						INVESTMENT_TYPES[req.body.type.toLowerCase() as "gold"].amount,
					type: req.body.type,
					userId: req.user._id,
					level: INVESTMENT_TYPES[req.body.type.toLowerCase() as "gold"].level,
					currency: req.user.currency,
				});
			}

			const user = req.user;
			user.balance.fiat[req.user.currency] -=
				INVESTMENT_TYPES[req.body.type.toLowerCase() as "gold"].amount;

			await Promise.all([
				user.save(),
				Activity.create({
					userId: req.user._id,
					activity: `${
						activeinvestment
							? `You upgraded to ${req.body.type.toUpperCase()} investment plan for a total of ${
									CURRENCY_SYMBOLS[req?.user?.currency as "GBP"]
							  }${investment.amount} invested funds`
							: `You invested ${
									CURRENCY_SYMBOLS[req?.user?.currency as "GBP"]
							  }${
									investment.amount
							  } in ${req.body.type.toUpperCase()} investment plan`
					} `,
				}),
			]);

			return successDispatcher(
				res,
				200,
				`Your ${req.body.type} investment was successfully started`,
				investment
			);
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(
				res,
				400,
				"Could not create investment. Please try again"
			);
		}
	})
	.get(genericAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			const investments = await Investment.find({ userId: req.user._id });
			const count = await Investment.countDocuments({
				userId: req.user._id,
			});
			return successDispatcher(res, 200, "User investments fetched", {
				investments,
				count,
			});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(
				res,
				400,
				"User investments data could not be fetched"
			);
		}
	});
