import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import User from "@/server/models/User.mongo";
import { NextApiResponse } from "next";
import z from "zod";
import { adminAuth } from "@/server/middleware/auth";
import { CustomReq } from "../profile-upload";

export default handler().put(
  adminAuth,
  async (req: CustomReq, res: NextApiResponse) => {
    try {
      const { method, currency, amount, userId } = z
        .object({
          method: z.string(),
          currency: z.string(),
          amount: z.number(),
          userId: z.string()
        })
        .strict()
        .parse(req.body);

      const user = await User.findOne({
        _id: userId
      });

      user.balance[method][currency] += amount;
      user.save();

      return successDispatcher(
        res,
        200,
        "User details updated successfully",
        user
      );
    } catch (err: any) {
      console.log(err?.message);
      return errorDispatcher(
        res,
        400,
        "An error ocurred while updating user details"
      );
    }
  }
);
