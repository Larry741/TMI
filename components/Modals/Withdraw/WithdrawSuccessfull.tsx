import { Dispatch } from "react";
import Image from "next/legacy/image";
import { IoClose } from "react-icons/io5";
import Button from "../../UI/Button";
import useSession from "../../../hooks/use-Session";
import ModalBody from "../ModalBodyCard";
import { moneyBag, checkIcon, exclamationIcon } from "@/helpers/image-imports";

import styles from "../ModalBodyCard.module.scss";
import { TiTick } from "react-icons/ti";

interface Props {
	withdrawAmount: number;
	withdrawCompleted: () => void;
}

const WithdrawSuccessfull = ({ withdrawAmount, withdrawCompleted }: Props) => {
	const { data } = useSession();

	return (
		<ModalBody gap={20}>
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
					<span className="size_18 bold">All Done</span>
				</div>

				<button className={styles.close} onClick={() => withdrawCompleted()}>
					<IoClose style={{ color: "white" }} size={28} />
				</button>
			</div>

			<div className={styles.background_tick}>
				<TiTick size={84} />
			</div>

			<span
				style={{ lineHeight: "1.5", display: "block", textAlign: "center" }}
				className="size_16">
				You have withdrawn{" "}
				<span className={`${styles.colored_text} size_16 bold`}>
					<span className="naira_curr_font">$</span>
					{Number(withdrawAmount).toLocaleString()}
				</span>{" "}
			</span>
			<Button
				disabled={false}
				showLoader={false}
				onClick={() => {
					withdrawCompleted();
				}}>
				Done
			</Button>
		</ModalBody>
	);
};

export default WithdrawSuccessfull;
