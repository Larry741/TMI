import React, { Fragment, ReactNode } from "react";
import { createPortal } from "react-dom";

import style from "./Modal.module.scss";

interface props {
	children: ReactNode;
	closeModalHandler?: any;
}

const Modal = ({ children, closeModalHandler }: props) => {
	return (
		<>
			{createPortal(
				<div
					id="modal"
					onClick={closeModalHandler && closeModalHandler}
					className={style.backdrop}>
					<div>{children}</div>
				</div>,
				document.body!
			)}
		</>
	);
};

export default Modal;
