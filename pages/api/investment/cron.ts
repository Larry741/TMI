import Investment from "@/server/models/Investment.mongo";
import InvestmentPayment from "@/server/models/InvestmentPayment.mongo";
import { INVESTMENT_TYPES } from "@/utils/constants";
import { dbConnect, disconnectDb } from "@/utils/mongo";
const mongoose = require("mongoose");

const investmentCron = async () => {
	await dbConnect();
	const investmentPayments: any[] = [];
	let savePromises: any;

	try {
		const investments = await Investment.find({ status: "active" });

		investments.forEach((investment: any) => {
			const investPerc = INVESTMENT_TYPES[investment.type as "gold"].percentage;
			const profit = (investment.amount * investPerc) / 100;

			investment.profits += profit;

			investmentPayments.push({
				_id: new mongoose.Types.ObjectId(),
				amount: investment.amount,
				userId: investment.userId,
				profit: profit,
				InvestmentId: investment._id,
			});
		});

		savePromises = investments.map((doc: any) => doc.save());
		await Promise.all(savePromises);
		await InvestmentPayment.insertMany(investmentPayments);

		await disconnectDb();
	} catch (err: any) {
		console.log(err.message);
		console.log("retrying");

		try {
			await Promise.all(savePromises);
			await InvestmentPayment.insertMany(investmentPayments);
		} catch (err: any) {
			console.log(err.message);
			console.log("retry failed");
		}

		await disconnectDb();
	}
};

export default investmentCron;
