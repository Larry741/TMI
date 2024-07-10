import { FaAngleDown } from "react-icons/fa";
import faqs from "@/faqs.json";
import Link from "next/link";

import styles from "./Faq.module.scss";

const Faq = () => {
	return (
		<div className={styles.faq}>
			<div className={styles.faq_control}>
				<div className={styles.heading}>
					<div className="col-md-12 margin_max">
						<h2 style={{ textAlign: "center" }} className="pb-12 size_30-36">
							Frequently asked Questions
						</h2>

						<div className="heading-line"></div>
					</div>
				</div>

				<div className={styles.questions}>
					{faqs.map((faq, idx) => {
						if (idx > 7) {
							return <></>;
						}

						return (
							<div className={styles.question} key={`${faq.question}${idx}`}>
								<div className={styles.btn_control}>
									<span className="size_17">{faq.question}</span>

									<button onClick={toggleFaqDropdown}>
										<FaAngleDown size={14} />
									</button>
								</div>

								<div className={`${styles.dropdown}`}>
									<p className="size_16">{faq.answer}</p>
								</div>
							</div>
						);
					})}

					<div className={styles.redirect}>
						{/* <Link className="size_14" href={PAGES.FAQ}>
							Browse FAQ&apos;S
						</Link> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Faq;

export const toggleFaqDropdown = (
	e: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => {
	const toggleBtn = e.currentTarget.closest("button") as HTMLButtonElement;
	const dropdown = toggleBtn.parentElement
		?.nextElementSibling as HTMLDivElement;

	if (dropdown?.classList.contains(styles.open_list)) {
		const dropdowns = document.querySelectorAll(
			`.${styles.open_list}`
		) as NodeListOf<Element>;

		Array.from(dropdowns).forEach((drop) => {
			drop.classList.replace(styles.open_list, styles.close_list);
		});

		toggleBtn.classList.replace(styles.rotate_0, styles.rotate_360);
	} else {
		const dropdowns = document.querySelectorAll(
			`.${styles.open_list}`
		) as NodeListOf<Element>;

		Array.from(dropdowns).forEach((drop) => {
			drop.classList.replace(styles.open_list, styles.close_list);
		});

		dropdown.classList.remove(styles.close_list);
		dropdown?.classList.add(styles.open_list);

		const dropBtns = document.querySelectorAll(
			`.${styles.rotate_0}`
		) as NodeListOf<Element>;

		Array.from(dropBtns).forEach((drop) => {
			drop.classList.replace(styles.rotate_0, styles.rotate_360);
		});

		toggleBtn.classList.remove(styles.rotate_360);
		toggleBtn.classList.add(styles.rotate_0);
	}
};
