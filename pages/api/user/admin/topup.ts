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
      if (req.body.updateBal === "fiat") {
        await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $set: { "balance.fiat": req.body.bal } }
        );
      } else if (req.body.updateBal === "crypto") {
        await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $set: { "balance.crypto": req.body.bal } }
        );
      } else if (req.body.updateBal === "commodity") {
        await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $set: { "balance.commodity": req.body.bal } }
        );
      }

      return successDispatcher(
        res,
        200,
        "User details updated successfully",
        {}
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
