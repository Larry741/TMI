"use client";

import { createContext, useState, useCallback } from "react";
import ToastNotification, {
	NotificationType,
} from "@/components/UI/ToastNotification";
import { AnimatePresence } from "framer-motion";

const NotificationContext = createContext({
	setNotification: (notification: any) => {},
});

export const NotificationContextProvider = (props: any) => {
	const [notifyUser, setNotifyUser] = useState<any>({
		title: "",
		message: "",
		status: null,
	});

	const setNotification = (notification: any) => {
		setNotifyUser(notification);
	};

	const closeNotification = useCallback(() => {
		setNotifyUser({
			message: "",
			status: null,
			title: "",
		});
	}, []);

	return (
		<NotificationContext.Provider value={{ setNotification }}>
			<AnimatePresence>
				{notifyUser.message && (
					<ToastNotification
						title={notifyUser.title}
						closeHandler={closeNotification}
						status={notifyUser.status}>
						{notifyUser.message}
					</ToastNotification>
				)}
			</AnimatePresence>
			{props.children}
		</NotificationContext.Provider>
	);
};

export default NotificationContext;
