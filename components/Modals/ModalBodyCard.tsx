import { ReactNode } from "react";

import styles from "./ModalBodyCard.module.scss";

interface Props {
	gap?: 20 | 30 | 35;
	width?: "small" | "mid" | "medium" | "max" | "x-max";
	noBg?: boolean;
	children: ReactNode;
	onSubmit?: (e: React.FormEvent) => void;
}

const ModalBody = ({ gap, width, noBg = false, children, onSubmit }: Props) => {
	return (
		<>
			{onSubmit ? (
				<form
					onSubmit={onSubmit}
					className={`${styles.card} ${noBg ? styles.no_bg : ""} ${
						width === "medium"
							? styles.mediumWidth
							: width === "max"
							? styles.maxWidth
							: width == "small"
							? styles.smallWidth
							: width == "mid"
							? styles.midWidth
							: width === "x-max"
							? styles[`x-max`]
							: ""
					} ${
						gap === 20
							? styles["gap-20"]
							: gap === 30
							? styles["gap-30"]
							: gap === 35
							? styles["gap-35"]
							: ""
					}`}>
					{children}
				</form>
			) : (
				<div
					className={`${styles.card} ${noBg ? styles.no_bg : ""} ${
						width === "medium"
							? styles.mediumWidth
							: width === "max"
							? styles.maxWidth
							: width == "small"
							? styles.smallWidth
							: width == "mid"
							? styles.midWidth
							: width === "x-max"
							? styles[`x-max`]
							: ""
					} ${
						gap === 20
							? styles["gap-20"]
							: gap === 30
							? styles["gap-30"]
							: gap === 35
							? styles["gap-35"]
							: ""
					}`}>
					{children}
				</div>
			)}
		</>
	);
};

export default ModalBody;
