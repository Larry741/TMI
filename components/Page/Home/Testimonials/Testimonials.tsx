import Image from "next/legacy/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { Testimonial } from "@/interface/testimonial";

import styles from "./Testimonial.module.scss";
import { dummyTestimonialImg } from "@/helpers/image-imports";

const Testimonials = () => {
	return (
		<section className={styles.section}>
			<div className={styles.section_control}>
				<div className="col-md-12 margin_max">
					<h2 style={{ textAlign: "center" }} className="pb-12 size_30-36">
						WHAT THEY SAY
					</h2>

					<div className="heading-line"></div>
				</div>

				{/* <p className="size_26-40 bold">Our User Kind Words</p>

				<span className={`${styles.sub_text} size_16-18`}>
					Here are some testimonials from our user after using CastleStash to
					grow their funds
				</span> */}

				<div className={styles.comments_conatiner}>
					<Swiper
						pagination={{
							clickable: true,
							dynamicBullets: true,
						}}
						navigation={{
							nextEl: ".next_btn",
							prevEl: ".prev_btn",
						}}
						autoplay={{
							delay: 20000,
							disableOnInteraction: false,
						}}
						breakpoints={breakpoints}
						modules={[Navigation, Autoplay]}
						loop
						// cssMode={true}
						className={styles.swiper}>
						{testimonials.map((testimonial, idx: number) => {
							return (
								<SwiperSlide key={`${testimonial.organization}${idx}`}>
									<div className={styles.card}>
										<div className={styles.commentor_title}>
											<div className={`${styles.comment}  size_15`}>
												{testimonial.comment}
											</div>
										</div>

										<div className={styles.commentor_name}>
											<Image alt="commentor's image" src={testimonial.imgSrc} />

											<div>
												<span className="size_18">{testimonial.name}</span>

												<span className="size_14">
													{testimonial.organization}
												</span>
											</div>
										</div>
									</div>
								</SwiperSlide>
							);
						})}
					</Swiper>
				</div>

				<div className={styles.prev_next_btn}>
					<div className={"prev_btn"}>
						<FaLongArrowAltLeft size={20} />
					</div>

					<div className={"next_btn"}>
						<FaLongArrowAltRight size={20} />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Testimonials;

export const breakpoints = {
	750: {
		slidesPerView: 2,
		spaceBetween: 40,
	},
	1200: {
		slidesPerView: 3,
		spaceBetween: 40,
	},
};

const testimonials: Testimonial[] = [
	{
		name: "Linda S.",
		organization: "Forex Investor",
		imgSrc: dummyTestimonialImg,
		comment:
			"As a forex investor, I value precision and reliability. This platform delivers on both fronts. The advanced analytics and educational resources have empowered me to make informed decisions. It's a game-changer for serious traders!",
	},
	{
		name: "Robert M.",
		organization: "Commodity Enthusiast",
		imgSrc: dummyTestimonialImg,
		comment:
			"Diversifying my portfolio with commodities was made simple with this platform. The range of commodities offered, coupled with insightful market analyses, has significantly boosted my investment strategy. Highly recommended!",
	},
	{
		name: "Emily R.",
		organization: "Crypto Newbie",
		imgSrc: dummyTestimonialImg,
		comment:
			"For someone new to crypto, this app has been a blessing. The educational materials and demo account feature helped me understand the market dynamics before I started investing. The intuitive design made the learning curve a breeze!",
	},
	{
		name: "Carlos L.",
		organization: "Forex Expert",
		imgSrc: dummyTestimonialImg,
		comment:
			"As a seasoned forex trader, I've used many platforms. This one stands out with its lightning-fast execution and low spreads. The automated trading tools are a game-changer for professionals like me. Impressive work!",
	},
	{
		name: "Sophia K.",
		organization: "Commodity Investor",
		imgSrc: dummyTestimonialImg,
		comment:
			"Investing in commodities can be daunting, but this platform simplifies the process. From agricultural to energy commodities, I've diversified my investments effortlessly. The real-time data ensures I never miss a market opportunity!",
	},
	{
		name: "Alex B.",
		organization: "Commodity Trader",
		imgSrc: dummyTestimonialImg,
		comment:
			"Managing my commodity portfolio has never been this efficient. The risk management tools and comprehensive market analysis have given me a competitive edge. It's my one-stop solution for commodity trading.",
	},
	{
		name: "Grace H.",
		organization: "Crypto Investor",
		imgSrc: dummyTestimonialImg,
		comment:
			"I've been investing in crypto for years, and this platform has become my favorite. The security measures, diverse investment options, and the community aspect make it a standout choice for serious crypto investors.",
	},
];
