import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/app/api/user/profile-upload";
import User from "@/server/models/User.mongo";
import Withdrawal from "@/server/models/Withdrawal";

export default handler().put(
	genericAuth,
	async (req: CustomReq, res: NextApiResponse) => {
		try {
			const withdrawal = await Withdrawal.findById(req.body.withdrawalId);
			if (!withdrawal) {
				return errorDispatcher(res, 404, "Withdrawal not found");
			}

			withdrawal.status = "successfull";

			await Promise.all([withdrawal.save()]);

			return successDispatcher(res, 200, "Withdrawal approved", {});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "Withdrawal update failed");
		}
	}
);
