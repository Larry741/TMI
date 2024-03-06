import handler from "@/utils/handler";
import User from "@/server/models/User.mongo";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { verifyJWT } from "@/server/services/auth.services";
import { disconnectDb } from "@/utils/mongo";
import { NextApiRequest, NextApiResponse } from "next";

export default handler().post(
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			const { password } = req.body;
			let token: string = "";
			if (
				req.headers.authorization &&
				req.headers.authorization.startsWith("Bearer")
			) {
				token = req.headers.authorization.split(" ")[1];
			}

			if (token === "") {
				return errorDispatcher(res, 400, "Token Invalid");
			}

			const decoded = verifyJWT(token);

			const user = await User.findOne({
				email: decoded.id,
			});

			user.password = password;
			await user.save();

			return successDispatcher(res, 200, "Password changed successfully", {});
		} catch (err: any) {
			console.log(err);
			if (err?.code === 11000) {
			}
			return errorDispatcher(
				res,
				500,
				"Server error, we could not complete your request"
			);
		}
	}
);
