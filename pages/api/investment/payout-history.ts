import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/pages/api/user/profile-upload";
import InvestmentPayment from "@/server/models/InvestmentPayment.mongo";

export default handler().get(
	genericAuth,
	async (req: CustomReq, res: NextApiResponse) => {
		try {
			const payouts = await InvestmentPayment.find({
				userId: req.user._id,
			});
			const count = await InvestmentPayment.countDocuments({
				userId: req.user._id,
			});

			return successDispatcher(res, 200, "Investment was closed.", {
				payouts,
				count,
			});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "User investment could not closed.");
		}
	}
);
