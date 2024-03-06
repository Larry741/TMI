import { Dispatch } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import Button from "../../UI/Button";
import ModalBody from "../ModalBodyCard";
import { moneyBag, checkIcon, exclamationIcon } from "@/helpers/image-imports";
import { CURRENCY_SYMBOLS } from "@/utils/constants";
import { TiTick } from "react-icons/ti";

import styles from "../ModalBodyCard.module.scss";

interface Props {
	showModal: Dispatch<boolean>;
	investType: "BUY" | "SELL";
	commodityAmount: number;
	weight: "oz" | "gm" | "barrels" | "lt";
	price: number;
	currency: string;
	commodity: string;
}

const CommodityBuySuccessfull = ({
	showModal,
	investType,
	commodityAmount,
	weight,
	price,
	currency,
	commodity,
}: Props) => {
	return (
		<ModalBody>
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
					<span className="size_18 bold">Congratulations</span>
				</div>

				<button className={styles.close} onClick={() => showModal(false)}>
					<IoClose color="white" size={28} />
				</button>
			</div>

			<div className={styles.background_tick}>
				<TiTick size={84} />
			</div>

			<span
				style={{ display: "block", textAlign: "center" }}
				className={`size_16`}>
				You have {investType === "BUY" ? "purchased" : "sold"}{" "}
				<span className={styles.colored_text}>
					{commodityAmount.toLocaleString(undefined, {
						maximumFractionDigits: 2,
						minimumFractionDigits: 0,
					})}
					{weight}
				</span>{" "}
				of {commodity} for{" "}
				<span className={styles.colored_text}>
					{CURRENCY_SYMBOLS[currency as "GBP"]}
					{price.toLocaleString(undefined, {
						maximumFractionDigits: 2,
						minimumFractionDigits: 0,
					})}
				</span>
			</span>
			<Button
				disabled={false}
				showLoader={false}
				onClick={() => {
					showModal(false);
				}}>
				Done
			</Button>
		</ModalBody>
	);
};

export default CommodityBuySuccessfull;
