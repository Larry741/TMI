import { Server } from "socket.io";
import { NextApiRequest } from "next";
import fetchRatesJob from "@/utils/fetchRates";

export default async function SocketHandler(req: NextApiRequest, res: any) {
	if (res.socket.server.io) {
		// const rates = await fetchRatesJob();
		// if (rates) {
		//   res.socket.server.io.emit("send_rates", rates);
		// }

		console.log("Already set up");
		res.end();
		return;
	}

	const io = new Server(res.socket.server, {
		path: "/api/socket/ping",
		addTrailingSlash: false,
	});

	// Event handler for client connections
	io.on("connection", async (socket) => {
		console.log(`A client connected. ID: ${socket.id}`);

		const rates = await fetchRatesJob();
		if (rates) {
			io.emit("send_rates", rates);
		}

		// Event handler for client disconnections
		socket.on("disconnect", () => {
			console.log("A client disconnected.");
		});
	});

	res.socket.server.io = io;
	res.end();
}
