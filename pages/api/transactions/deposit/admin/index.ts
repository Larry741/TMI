import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { adminAuth, genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/pages/api/user/profile-upload";
import Deposit from "@/server/models/Deposit.mongo";
import Activity from "@/server/models/Activities.mongo";
import { CURRENCY_SYMBOLS } from "@/utils/constants";
import Withdrawal from "@/server/models/Withdrawal";
import User from "@/server/models/User.mongo";

export default handler().get(
	adminAuth,
	async (req: CustomReq, res: NextApiResponse) => {
		try {
			const dbQuery: { [key in string]: string | string[] } = {};

			if (req.query.withdrawId) {
				dbQuery._id = req.query.withdrawId;
			} else if (req.query.status) {
				dbQuery.status = req.query.status;
			} else if (req.query.userId) {
				dbQuery.userId = req.query.userId;
			}

			const deposits = await Deposit.find(dbQuery).populate("userId");
			const count = await Deposit.countDocuments(dbQuery);

			return successDispatcher(res, 200, "Deposits fetched", {
				deposits,
				count,
			});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(res, 400, "Deposit data could not be fetched");
		}
	}
);
//
