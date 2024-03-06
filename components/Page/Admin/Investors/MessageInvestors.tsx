import { useState, Dispatch, useRef, useEffect, useContext } from "react";
import Image from "next/legacy/image";
import { IoClose } from "react-icons/io5";
import ModalBody from "@/components/Modals/ModalBodyCard";
import useHttp from "@/hooks/use-Http";
import Button from "@/components/UI/Button";
import { Loader } from "@/components/UI/loader";
import { useInput } from "@/hooks/use-Input";
import useFetcher from "@/hooks/use-Fetcher";
import { exclamationIcon } from "@/helpers/image-imports";
import NotificationContext from "@/context/notification";
import Input from "@/components/Inputs/Inputs";
import { InputType } from "@/interface/input";

import styles from "@/components/Modals/ModalBodyCard.module.scss";
import styles2 from "./WithdrawalDetails.module.scss";

interface Props {
	showModal: Dispatch<boolean>;
}

interface DenialDataType {
	action: string;
	denialClass: number;
	denialDetail?: string;
}

const MessageInvestors = ({ showModal }: Props) => {
	const { httpIsLoading, sendRequest } = useHttp();
	const [subject, setSubject] = useState<InputType>();
	const { enteredValue, valueChangeHandler } = useInput(
		(val: number) => val > 0,
		""
	);
	const { setNotification } = useContext(NotificationContext);

	const httpSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();

		const { error, message, status } = await sendRequest(
			`POST`,
			`user/admin/send-message`,
			{ message: enteredValue, subject },
			"JSON"
		);

		if (error) {
			return setNotification({
				message: message,
				status: "ERROR",
				title: "Error",
			});
		}
		setNotification({
			message: "Message sent",
			status: "SUCCESS",
			title: "Success",
		});

		showModal(false);
	};

	const inputChangeHandler = (e: React.ChangeEvent<any>) => {
		valueChangeHandler(e);
	};

	return (
		<ModalBody onSubmit={httpSendMessage} gap={20}>
			<div className={styles.header}>
				<span className={styles.check_icon}>
					<Image src={exclamationIcon} alt="Return" objectFit="contain" />
				</span>
				<span className="size_18 bold">Message Investors</span>
				<button
					disabled={httpIsLoading}
					className={styles.close}
					onClick={() => showModal(false)}>
					<IoClose size={28} />
				</button>
			</div>

			<Input
				updateInput={setSubject}
				initRenderUpdate={false}
				label="Email Subject"
				placeholder=""
				required
				validationFn={(val) => val.length > 0}
			/>

			<div>
				<label className="size_14 bold">Email Body</label>
				<textarea
					className={styles2.textarea}
					rows={6}
					value={enteredValue}
					onChange={inputChangeHandler}
					placeholder="Provide more details here"
				/>
			</div>

			<div className={styles2.btn_control}>
				<Button
					className={styles2.btn_1}
					disabled={httpIsLoading}
					type={"submit"}
					onClick={() => {
						showModal(false);
					}}
					showLoader={false}>
					Send
				</Button>
			</div>
		</ModalBody>
	);
};

export default MessageInvestors;
