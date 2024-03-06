import React, { Dispatch, ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

import styles from "./MobileMenu.module.scss";

interface MenuProps {
	children: ReactNode;
	showMenu: boolean;
	setShowMenu: Dispatch<boolean>;
}

const MobileMenu = ({ children, showMenu, setShowMenu }: MenuProps) => {
	const close = () => {
		setShowMenu(false);
	};

	return (
		<AnimatePresence>
			{showMenu ? (
				<>
					{createPortal(
						<>
							<motion.div
								key="modal_menu"
								className={styles.content}
								transition={{
									duration: 0.4,
									type: "tween",
								}}
								initial={{ x: "100%" }}
								animate={{ x: 0 }}
								exit={{ x: "100%" }}>
								<div>{children}</div>
							</motion.div>
						</>,
						document.body!
					)}
				</>
			) : null}
		</AnimatePresence>
	);
};

export default MobileMenu;
