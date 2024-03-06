import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import User from "@/server/models/User.mongo";
import { NextApiResponse } from "next";
import z from "zod";
import { genericAuth } from "@/server/middleware/auth";
import { CustomReq } from "./profile-upload";
import Investment from "@/server/models/Investment.mongo";
import Rates from "@/server/models/Rate.mongo";

export default handler()
	.get(genericAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			const [activeInvestment, rates] = await Promise.all([
				Investment.findOne({ userId: req.user._id, status: "active" }),
				Rates.findOne({ id: "larry1" }),
			]);

			return successDispatcher(res, 200, "User fetched", {
				...req.user.toObject(),
				activeInvestment,
				rates,
			});
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(
				res,
				400,
				"An error ocurred while fetching user details"
			);
		}
	})
	.put(genericAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			const updateData = z
				.object({
					password: z.string().optional(),
					firstName: z.string().min(1).optional(),
					lastName: z.string().min(1).optional(),
					phone: z.string().optional(),
					address: z.string().optional(),
					country: z.string().optional(),
					gender: z.string().optional(),
					oldPassword: z.string().optional(),
					currency: z.string().optional(),
					timeZone: z.string().optional(),
					notifications: z.unknown().optional(),
					walletAddress: z.string().optional(),
				})
				.strict()
				.parse(req.body);

			const user = req.user;

			if (updateData.password && user.password !== updateData.password) {
				return errorDispatcher(res, 400, "Invalid password");
			}

			const updatedUser = await User.findOneAndUpdate(
				{
					_id: user._id,
				},
				updateData
			);
			return successDispatcher(res, 200, "User Details Updated", updatedUser);
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(
				res,
				400,
				"An error ocurred while updating user details"
			);
		}
	});
