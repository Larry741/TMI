import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/pages/api/user/profile-upload";
import Deposit from "@/server/models/Deposit.mongo";
import Activity from "@/server/models/Activities.mongo";
import { CURRENCY_SYMBOLS } from "@/utils/constants";

export default handler()
	.post(genericAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			const details = { ...req.body, status: "pending", userId: req.user._id };

			await Promise.all([
				Deposit.create(details),
				Activity.create({
					userId: req.user._id,
					activity: `You initiated a Deposit for ${
						CURRENCY_SYMBOLS[req.user?.currency as "GBP"]
					}${Number(details.amount).toLocaleString()}`,
				}),
			]);
			return successDispatcher(res, 200, "Deposit initiated", {});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "Deposit failed");
		}
	})
	.get(genericAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			const deposits = await Deposit.find({ userId: req.user._id });
			const count = await Deposit.countDocuments({
				userId: req.user._id,
			});

			return successDispatcher(res, 200, "Withdrawal fetched", {
				deposits,
				count,
			});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "Withdrawal data could not be fetched");
		}
	});
