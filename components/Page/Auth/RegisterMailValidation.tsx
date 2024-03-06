import { useCallback, useContext } from "react";
import Otp from "../../Inputs/Otp";

import styles from "./RegisterMailValidation.module.scss";
import NotificationContext from "@/context/notification";

interface Props {
	emailOtp: any;
	setEmailOtp: any;
	emailOtpIsInvalid: any;
	setEmailOtpIsInvalid: any;
	restartTimer: any;
	setRestartTimer: any;
	sendRequest: any;
	resendUrl: any;
}

const RegisterMailValidation = ({
	emailOtp,
	setEmailOtp,
	emailOtpIsInvalid,
	setEmailOtpIsInvalid,
	restartTimer,
	setRestartTimer,
	sendRequest,
	resendUrl,
}: Props) => {
	const { setNotification } = useContext(NotificationContext);
	// const otpIsValid = emailOtp.trim().length >= 6;
	const onOtpInputChange = useCallback(
		(value: string) => {
			setEmailOtp(value), setEmailOtpIsInvalid(false);
		},
		[setEmailOtp, setEmailOtpIsInvalid]
	);

	const httpResendOtp = useCallback(async () => {
		let { message, status, error } = await sendRequest(
			"POST",
			resendUrl,
			{},
			"JSON"
		);

		if (error) {
			return setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
		} else if (status === 200 || status === 201) {
			setEmailOtpIsInvalid(false), setEmailOtp("");
			setRestartTimer(!restartTimer);
			setNotification({
				message: `Token resent to you email`,
				status: "SUCCESS",
				title: "Success",
			});
		}
	}, [
		restartTimer,
		sendRequest,
		setEmailOtp,
		setEmailOtpIsInvalid,
		setRestartTimer,
		resendUrl,
		setNotification,
	]);

	return (
		<div className={styles.input_controller}>
			<Otp
				value={emailOtp}
				valueLength={6}
				otpIsInvalid={emailOtpIsInvalid}
				restartTimer={restartTimer}
				onChange={onOtpInputChange}
				resendOtp={httpResendOtp}
			/>
		</div>
	);
};

export default RegisterMailValidation;
