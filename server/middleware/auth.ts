import { NextApiResponse } from "next";
import { CustomReq } from "@/app/api/user/profile-upload";
import User from "@/server/models/User.mongo";
import { verifyJWT } from "@/server/services/auth.services";
import errorDispatcher from "@/utils/errorDispatcher";

export const genericAuth = async (
	req: CustomReq,
	res: NextApiResponse,
	next: any
) => {
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

	try {
		const decoded = verifyJWT(token);
		const user = await User.findOne({
			email: decoded.id,
		});
		req.user = user;

		next();
	} catch (err) {
		console.log(err);
		return errorDispatcher(res, 400, "User unauthenticated");
	}
};

export const adminAuth = async (
	req: CustomReq,
	res: NextApiResponse,
	next: any
) => {
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

	try {
		const decoded = verifyJWT(token);
		const user = await User.findOne({
			email: decoded.id,
		});
		req.user = user;

		if (req.user?.role !== "admin") {
			throw new Error();
		}

		next();
	} catch (err: any) {
		console.log(err?.message);
		return errorDispatcher(res, 404, "User unauthenticated");
	}
};
