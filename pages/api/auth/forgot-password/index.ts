import handler from "@/utils/handler";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import User from "@/server/models/User.mongo";
import {
	generateJWT,
	generateSecret,
	generateTotp,
} from "@/server/services/auth.services";
import { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/utils/mailUser";

export default handler().post(
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			const formData = req.body;

			const user = await User.findOne({ email: formData.email });
			if (!user) {
				return errorDispatcher(res, 404, "Email not found");
			}

			const otpSecret = generateSecret();
			const totp = generateTotp(otpSecret);
			const message = `
			<h1>Your Email Verification Code</h1>
	
			<p>${totp} is your verification code for your account</p>
		`;
			const token = generateJWT(formData.email);

			user.otp = totp;
			user.save();

			await sendEmail(user.email, "Email Verification", message);
			return successDispatcher(res, 200, "Verification sent to your Email", {
				token,
			});
		} catch (err: any) {
			console.log(err.message);
			return errorDispatcher(
				res,
				400,
				"An error ocurred while fetching user details"
			);
		}
	}
);
