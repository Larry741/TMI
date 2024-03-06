import handler from "@/utils/handler";
import User from "@/server/models/User.mongo";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { verifyJWT } from "@/server/services/auth.services";
import { NextApiRequest, NextApiResponse } from "next";

export default handler().post(
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			const { otp } = req.body;
			let token: string = "";
			if (
				req.headers.authorization &&
				req.headers.authorization.startsWith("Bearer")
			) {
				token = req.headers.authorization.split(" ")[1];
			}
			if (token === "") {
				return errorDispatcher(res, 400, "Invalid token");
			}

			const decoded = verifyJWT(token);

			const user = await User.findOne({
				email: decoded.id,
			});

			if (user.emailVerified) {
				return errorDispatcher(res, 401, "Email already verified");
			}

			if (!user || otp !== user?.otp) {
				return errorDispatcher(res, 403, "Invalid token");
			}

			user.emailVerified = true;
			user.otp = undefined;
			await user.save();

			return successDispatcher(res, 201, "OTP verification successfull", user);
		} catch (err) {
			console.log(err);
			return errorDispatcher(res, 500, "Server error, Invalid OTP");
		}
	}
);
