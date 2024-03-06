import { Dispatch, useContext, useState } from "react";
import Image from "next/legacy/image";
import { IoClose } from "react-icons/io5";
import Button from "../../UI/Button";
import ModalBody from "../ModalBodyCard";
import { moneyBag, checkIcon, exclamationIcon } from "@/helpers/image-imports";
import useHttp from "@/hooks/use-Http";
import NotificationContext from "@/context/notification";
import useSession from "@/hooks/use-Session";
import {
	BANK_DETAIL,
	BTC_ADDRESS,
	CURRENCY_SYMBOLS,
	ETH_ADDRESS,
	PAY_PAL_DETAIL,
	USDT_ADDRESS,
} from "@/utils/constants";

import styles from "../ModalBodyCard.module.scss";

interface Props {
	showModal: Dispatch<boolean>;
	resetForm: () => void;
	paymentDetails: any;
}

const FundingSuccessfull = ({
	showModal,
	resetForm,
	paymentDetails,
}: Props) => {
	const { data } = useSession();
	const [progress, setProgress] = useState<number>(1);
	const { setNotification } = useContext(NotificationContext);
	const { httpIsLoading, sendRequest } = useHttp();

	const httpDepositFunds = async () => {
		const { error, message, status } = await sendRequest(
			"POST",
			"transactions/deposit",
			paymentDetails,
			"JSON"
		);
		if (error) {
			return setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
		}

		setProgress(2);
		resetForm();
	};

	return (
		<ModalBody>
			{progress === 1 ? (
				<>
					<div className={styles.header}>
						<div className={styles.header_icon}>
							<span className={styles.check_icon}>
								<Image
									src={exclamationIcon}
									width="20"
									height={"20"}
									alt="Return"
								/>
							</span>
							<span className="size_18 bold">Confirm Deposit</span>
						</div>
						<button className={styles.close} onClick={() => showModal(false)}>
							<IoClose color="white" size={28} />
						</button>
					</div>
					<Image alt="Copy" src={moneyBag} objectFit={"contain"} />
					<span
						style={{
							display: "block",
							textAlign: "center",
							width: "100%",
							overflowWrap: "break-word",
						}}
						className={`size_16`}>
						You have transferred{" "}
						<span className={styles.colored_text}>
							{paymentDetails.channel === "bank" ||
							paymentDetails.channel === "paypal"
								? CURRENCY_SYMBOLS[data.currency as "GBP"]
								: ""}
							{Number(paymentDetails.amount).toLocaleString()}
							{paymentDetails.channel === "BTC" ||
							paymentDetails.channel === "ETH" ||
							paymentDetails.channel === "USDT"
								? paymentDetails.channel
								: ""}{" "}
						</span>
						to the specified{" "}
						{paymentDetails.channel === "bank" ||
						paymentDetails.channel === "paypal"
							? "bank account"
							: "wallet address "}
						(
						{paymentDetails.channel === "bank"
							? BANK_DETAIL
							: paymentDetails.channel === "paypal"
							? PAY_PAL_DETAIL
							: paymentDetails.channel === "BTC"
							? BTC_ADDRESS
							: paymentDetails.channel === "ETH"
							? ETH_ADDRESS
							: USDT_ADDRESS}{" "}
						)
					</span>
					<Button
						disabled={false}
						type="button"
						showLoader={httpIsLoading}
						onClick={httpDepositFunds}>
						Confirm
					</Button>
				</>
			) : (
				<>
					<div className={styles.header}>
						<div className={styles.header_icon}>
							<span className={styles.check_icon}>
								<Image src={checkIcon} alt="Return" objectFit="contain" />
							</span>
							<span className="size_18 bold">All Done</span>
						</div>
						<button className={styles.close} onClick={() => showModal(false)}>
							<IoClose color="white" size={28} />
						</button>
					</div>
					<Image alt="Copy" src={moneyBag} objectFit={"contain"} />
					<span
						style={{ display: "block", textAlign: "center" }}
						className={`size_16`}>
						Deposit successfull, Your wallet will be automicatically funded upon
						confirmation.
					</span>
					<Button
						disabled={false}
						showLoader={false}
						onClick={() => {
							showModal(false);
						}}>
						Done
					</Button>
				</>
			)}
		</ModalBody>
	);
};

export default FundingSuccessfull;
