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

export default handler().post(
	async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			const formData = req.body;

			let user = await User.findOne({ email: formData.email });

			if (user && user?.emailVerified) {
				return errorDispatcher(res, 409, "Email already exists");
			}

			const otpSecret = generateSecret();
			const totp = generateTotp(otpSecret);
			const message = `
        <h1>Your Email Verification Code</h1>
    
        <p>${totp} is your verification code for your account</p>
      `;

			if (!user) {
				user = {
					email: formData.email,
					firstName: formData.firstName,
					lastName: formData.lastName,
					password: formData.password,
					role: "user",
					phone: formData.phone,
					country: formData.country,
					address: formData.address,
					emailVerified: false,
					otp: totp,
					token: generateJWT(formData.email),
				};

				await User.create(user);
			}

			await sendEmail(user.email, "Email Verification", message);
			return successDispatcher(res, 200, "Signup successfull", user);
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
