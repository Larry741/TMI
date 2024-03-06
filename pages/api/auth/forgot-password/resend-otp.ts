import handler from "@/utils/handler";
import User from "@/server/models/User.mongo";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import {
	generateSecret,
	generateTotp,
	verifyJWT,
} from "@/server/services/auth.services";
import { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/utils/mailUser";

export default handler().post(
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
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

			if (!user) {
				return errorDispatcher(res, 403, "User not found");
			}

			const otpSecret = generateSecret();
			const totp = generateTotp(otpSecret);
			const message = `
			<h1>Your Email Verification Code</h1>
	
			<p>${totp} is your verification code for your account</p>
		`;

			user.otp = totp;
			user.save();

			await sendEmail(user.email, "Email Verification", message);
			return successDispatcher(res, 201, "Otp sent to your email", {});
		} catch (err) {
			console.log(err);
			return errorDispatcher(res, 500, "Server error, otp resend failed");
		}
	}
);
