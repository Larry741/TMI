import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiResponse } from "next";
import { adminAuth } from "@/server/middleware/auth";
import { CustomReq } from "@/app/api/user/profile-upload";
import Withdrawal from "@/server/models/Withdrawal";
import User from "@/server/models/User.mongo";
import Activity from "@/server/models/Activities.mongo";
import { CURRENCY_SYMBOLS } from "@/utils/constants";

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

      const withdrawals = await Withdrawal.find(dbQuery).populate("userId");
      const count = await Withdrawal.countDocuments(dbQuery);

      return successDispatcher(res, 200, "Withdrawal fetched", {
        withdrawals,
        count
      });
    } catch (err: any) {
      console.log(err?.message);
      return errorDispatcher(res, 400, "Withdrawal data could not be fetched");
    }
  }
);
//
