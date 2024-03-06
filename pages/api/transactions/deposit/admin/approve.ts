import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/app/api/user/profile-upload";
import User from "@/server/models/User.mongo";
import Deposit from "@/server/models/Deposit.mongo";

export default handler().put(
	genericAuth,
	async (req: CustomReq, res: NextApiResponse) => {
		try {
			const dep = await Deposit.findById(req.body.depositId);
			if (!dep) {
				return errorDispatcher(res, 404, "Deposit not found");
			}
			const user = await User.findById(dep.userId);
			if (!user) {
				return errorDispatcher(res, 404, "User not found");
			}

			dep.status = "successfull";
			user.hasDeposited = true;

			await Promise.all([dep.save(), user.save()]);

			return successDispatcher(res, 200, "Deposit approved", {});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "Deposit failed");
		}
	}
);
