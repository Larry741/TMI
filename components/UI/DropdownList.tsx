import { createPortal } from "react-dom";
import styles from "./DropdownList.module.scss";

interface Props {
	children: React.ReactNode;
	style: { top?: number; bottom?: number; right: number } | any;
}

const DropdownList = ({ children, style }: Props) => {
	return createPortal(
		<ul
			style={{ position: "absolute", ...style }}
			className={`${styles.dropdown_list}`}>
			{children}
		</ul>,
		document.body!
	);
};

export default DropdownList;
