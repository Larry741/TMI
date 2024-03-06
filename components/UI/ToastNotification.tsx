import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/legacy/image";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";

import styles from "./ToastNotification.module.scss";
import { errorIcon, exclamationIcon, checkIcon } from "@/helpers/image-imports";

export interface NotificationType {
	title: string;
	message: string;
	status: "ERROR" | "SUCCESS" | "NEUTRAL" | null;
}
interface Props {
	status: "ERROR" | "SUCCESS" | "NEUTRAL" | null;
	title: string;
	children: React.ReactNode;
	closeHandler: () => void;
}

let timeout: NodeJS.Timeout;
const ToastNotification = ({
	status,
	title,
	children,
	closeHandler,
}: Props) => {
	const [stopTimer, setStopTimer] = useState<boolean>(false);

	useEffect(() => {
		timeout = setTimeout(() => {
			if (stopTimer) return;
			closeHandler();
		}, 10000);

		return () => {
			clearTimeout(timeout);
		};
	}, [stopTimer, closeHandler]);

	const onMouseEnterHandler = (e: React.MouseEvent) => {
		e.preventDefault();
		setStopTimer(true);
	};

	const onMouseOutHandler = (e: React.MouseEvent) => {
		e.preventDefault();
		setStopTimer(false);
	};

	return (
		<>
			{createPortal(
				<motion.div
					transition={{
						duration: 0.2,
						type: "tween",
					}}
					animate={{ y: -15, opacity: 1 }}
					initial={{ y: 0, opacity: 0 }}
					exit={{ y: 0, opacity: 0 }}
					className={`${styles.toast_container}`}
					key={"dropdown"}>
					<div
						className={`${styles.toast} ${
							status === "ERROR" && styles.error_toast
						} ${status === "SUCCESS" && styles.success_toast} `}
						onMouseEnter={onMouseEnterHandler}
						onMouseLeave={onMouseOutHandler}>
						<span className={styles.img_control}>
							{status === "ERROR" ? (
								<Image
									alt="error"
									src={errorIcon}
									width={16.7}
									height={16.7}
									objectFit="contain"
								/>
							) : status === "SUCCESS" ? (
								<Image
									alt="success"
									src={checkIcon}
									width={16.7}
									height={16.7}
									objectFit="contain"
								/>
							) : (
								<Image
									alt=""
									src={exclamationIcon}
									width={16.7}
									height={16.7}
									objectFit="contain"
								/>
							)}
						</span>

						<div className={styles.text_box}>
							<h4 className={`${styles.header} size_16 bold`}>{title}</h4>
							<span className={`size_14`}>
								{typeof children === "string" ? children : "An Error Occurred"}
							</span>
						</div>
						<button className={styles.btn} onClick={() => closeHandler()}>
							<IoClose size={28} />
						</button>
					</div>
				</motion.div>,
				// @ts-ignore
				document.body
			)}
		</>
	);
};

export default ToastNotification;
