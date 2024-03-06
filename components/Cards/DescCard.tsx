import { ReactNode } from "react";
import styles from "./DescCard.module.scss";

interface Props {
	children: ReactNode;
	classes?: string;
}

const DescCard = ({ children, classes }: Props) => {
	return (
		<span className={`${styles.info} size_12 ${classes && classes} `}>
			{children}
		</span>
	);
};

export default DescCard;
