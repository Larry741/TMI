import handler from "@/utils/handler";
import User from "@/server/models/User.mongo";
import errorDispatcher from "@/utils/errorDispatcher";
import successDispatcher from "@/utils/successDispatcher";
import { sendEmail } from "@/utils/mailUser";
import {
	generateJWT,
	generateSecret,
	generateTotp,
} from "@/server/services/auth.services";
import { NextApiRequest, NextApiResponse } from "next";
import Investment from "@/server/models/Investment.mongo";
import Rates from "@/server/models/Rate.mongo";

export default handler().post(
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			const formData = req.body;

			const user = await User.findOne({
				email: formData.email,
			});
			if (!user) {
				return errorDispatcher(res, 401, "Invalid Login Credentials!");
			}
			// if (user.status !== "ACTIVE") {
			//   return errorDispatcher(
			//     res,
			//     401,
			//     `This user is ${user.status.toLowerCase()}. Please contact support.`
			//   );
			// }

			if (user.password !== formData.password) {
				return errorDispatcher(res, 401, "Invalid Login Credentials");
			}

			if (!user.emailVerified) {
				const otpSecret = generateSecret();
				const totp = generateTotp(otpSecret);
				const message = `
          <h1>Your Email Verification Code</h1>
      
          <p>${totp} is your verification code for your account</p>
        `;

				user.otp = totp;
				await sendEmail(user.email, "Email Verification", message);
			}

			user.token = generateJWT(formData.email);
			await user.save();

			user.password = undefined;
			user.otp = undefined;

			const [activeInvestment, rates] = await Promise.all([
				Investment.findOne({ userId: user._id, status: "active" }),
				Rates.findOne({ id: "larry1" }),
			]);

			const fullUser = { ...user.toObject(), activeInvestment, rates };

			return successDispatcher(res, 200, "Signup successfull", fullUser);
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
