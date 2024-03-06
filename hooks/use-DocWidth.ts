import { useState, useLayoutEffect } from "react";

const resizeSizeCardHandler = () => {
	const docWith = document.documentElement?.clientWidth;
	if (!docWith) return;

	return docWith;
};

const useDocWidth = () => {
	const [docWidth, setDocWidth] = useState<number>();

	useLayoutEffect(() => {
		setDocWidth(resizeSizeCardHandler());

		window.addEventListener("resize", () => {
			setDocWidth(resizeSizeCardHandler());
		});
		return () => {
			window.removeEventListener("resize", () => {
				setDocWidth(resizeSizeCardHandler());
			});
		};
	}, []);

	return {
		docWidth,
	};
};

export default useDocWidth;
