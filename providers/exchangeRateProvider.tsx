"use client";

import { ReactNode, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { userSliceActions } from "@/store/userSlice";
import io from "socket.io-client";

let socket: any;

const ExchangeRateProvider = ({ children }: { children: ReactNode }) => {
	const dispatch = useDispatch();

	const socketInitializer = useCallback(async () => {
		// ping the server to setup a socket if not already running
		await fetch("/api/socket");

		// Setup the Socket
		socket = io({ path: "/api/socket/ping" });

		// Standard socket management
		socket.on("connect", () => {
			console.log("Connected to the server");
		});

		socket.on("disconnect", () => {
			console.log("Disconnected from the server");
		});

		socket.on("connect_error", (error: any) => {
			console.log("Connection error:", error);
		});

		socket.on("reconnect", (attemptNumber: any) => {
			console.log("Reconnected to the server. Attempt:", attemptNumber);
		});

		socket.on("reconnect_error", (error: any) => {
			console.log("Reconnection error:", error);
		});

		socket.on("reconnect_failed", () => {
			console.log("Failed to reconnect to the server");
		});

		socket.on("send_rates", (data: any) => {
			dispatch(userSliceActions.updateUserDetails({ rates: data }));
		});
	}, [dispatch]);

	useEffect(() => {
		// socketInitializer();

		return () => {
			socket?.disconnect();
		};
	}, [socketInitializer]);

	return <>{children}</>;
};

export default ExchangeRateProvider;
