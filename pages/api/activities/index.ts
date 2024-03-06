import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { NextApiRequest, NextApiResponse } from "next";
import { genericAuth } from "@/server/middleware/auth";
import Activity from "@/server/models/Activities.mongo";
import { CustomReq } from "../user/profile-upload";

export default handler().get(
  genericAuth,
  async (req: CustomReq, res: NextApiResponse) => {
    try {
      const activities = await Activity.find({ userId: req?.user._id });
      const count = await Activity.countDocuments({
        userId: req.user._id
      });

      return successDispatcher(
        res,
        200,
        "Ticket created successfully. We will respond to your request shortly",
        { activities, count }
      );
    } catch (err: any) {
      console.log(err.message);
      return errorDispatcher(
        res,
        400,
        "An error ocurred while subscribing to newsletter"
      );
    }
  }
);
