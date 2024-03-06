import { Testimonial } from "@/interface/testimonial";

import styles from "./TestimonialCard.module.scss";

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
	return (
		<div className={styles.content}>
			<span className={`${styles.comment} size_16-18`}>
				{testimonial.comment}
			</span>
			<div className={styles.control}>
				<span className="size_20 bold">{testimonial.name}</span>
				<span className="size_12">{testimonial.organization}</span>
			</div>
		</div>
	);
};

export default TestimonialCard;
