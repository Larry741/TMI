import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import User from "@/server/models/User.mongo";
import { NextApiResponse } from "next";
import z from "zod";
import { adminAuth } from "@/server/middleware/auth";
import { CustomReq } from "../profile-upload";

export default handler()
	.get(adminAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			if (req.query.userId) {
				const user = await User.findById(req.query.userId);

				return successDispatcher(res, 200, "User fetched", user);
			} else {
				const dbQuery: { [key in string]: string | string[] } = {};

				if (req.query.firstName) {
					dbQuery.firstName = req.query.firstName;
				} else if (req.query.lastName) {
					dbQuery.lastName = req.query.lastName;
				} else if (req.query.email) {
					dbQuery.email = req.query.email;
				} else if (req.query.id) {
					dbQuery._id = req.query.id;
				} else if (req.query.status) {
					dbQuery.status = req.query.status;
				}

				const users = await User.find(dbQuery);
				const count = await User.countDocuments(dbQuery);

				console.log(dbQuery);

				return successDispatcher(res, 200, "User fetched", { users, count });
			}
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(
				res,
				400,
				"An error ocurred while fetching user details"
			);
		}
	})
	.put(adminAuth, async (req: CustomReq, res: NextApiResponse) => {
		try {
			const updateData = z
				.object({
					// password: z.string().optional(),
					firstName: z.string().min(1).optional(),
					// lastName: z.string().min(1).optional(),
					phone: z.string().optional(),
					address: z.string().optional(),
					country: z.string().optional(),
					gender: z.string().optional(),
					// oldPassword: z.string().optional(),
					currency: z.string().optional(),
					timeZone: z.string().optional(),
					notifications: z.unknown().optional(),
					// walletAddress: z.string().optional(),
					status: z.string().optional(),
					userId: z.string(),
				})
				.strict()
				.parse(req.body);

			const updatedUser = await User.findOneAndUpdate(
				{
					_id: req.body.userId,
				},
				updateData
			);

			return successDispatcher(
				res,
				200,
				"User details updated successfully",
				updatedUser
			);
		} catch (err: any) {
			console.log(err?.message);
			return errorDispatcher(
				res,
				400,
				"An error ocurred while updating user details"
			);
		}
	});
