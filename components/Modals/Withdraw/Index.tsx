import { Dispatch, useState } from "react";
import ConfirmWithdraw from "./ConfirmWithdraw";
import WithdrawSuccessfull from "./WithdrawSuccessfull";
import Modal from "@/components/Modals/Modal";

interface Props {
	showModal: Dispatch<boolean>;
	withdrawCompleted: () => void;
	paymentDetails: any;
}

const WithdrawIndex = ({
	showModal,
	withdrawCompleted,
	paymentDetails,
}: Props) => {
	const [withdrawSuccessfull, setWithdrawSuccessfull] =
		useState<boolean>(false);

	return (
		<Modal>
			{!withdrawSuccessfull ? (
				<ConfirmWithdraw
					showModal={showModal}
					paymentDetails={paymentDetails}
					setWithdrawSuccessfull={setWithdrawSuccessfull}
				/>
			) : (
				<WithdrawSuccessfull
					withdrawAmount={paymentDetails.amount}
					withdrawCompleted={withdrawCompleted}
				/>
			)}
		</Modal>
	);
};

export default WithdrawIndex;
