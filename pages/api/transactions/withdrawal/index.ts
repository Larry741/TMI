import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/pages/api/user/profile-upload";
import Withdrawal from "@/server/models/Withdrawal";
import Activity from "@/server/models/Activities.mongo";
import { CURRENCY_SYMBOLS } from "@/utils/constants";

export default handler()
	.post(genericAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			const details = { ...req.body, userId: req.user._id };

			await Promise.all([
				Withdrawal.create(details),
				Activity.create({
					userId: req.user._id,
					activity: `You initiated a withdrawal for ${
						CURRENCY_SYMBOLS[req.user?.currency as "GBP"]
					}${Number(details.amount).toLocaleString()}`,
				}),
			]);

			return successDispatcher(res, 200, "Withdrawal initiated", {});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "Withdrawal failed");
		}
	})
	.get(genericAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			const withdrawals = await Withdrawal.find({ userId: req.user._id });
			const count = await Withdrawal.countDocuments({
				userId: req.user._id,
			});

			return successDispatcher(res, 200, "Withdrawal fetched", {
				withdrawals,
				count,
			});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "Withdrawal data could not be fetched");
		}
	});
