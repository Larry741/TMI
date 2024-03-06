import { useLayoutEffect, useState } from "react";
import Image from "next/legacy/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper";
import TestimonialCard from "../../../Cards/TestimonialCard";
import { Testimonial } from "@/interface/testimonial";
import DescCard from "../../../Cards/DescCard";
import { NavigationButton } from "../../../UI/Button";
import { Work_Sans } from "next/font/google";

import styles from "./Testimonial.module.scss";

const ft = Work_Sans({
	subsets: ["latin"],
	display: "swap",
	weight: ["300", "400", "700"],
});

const Testimonials = () => {
	return (
		<section className={`${styles.testimonials} ${ft.className}`}>
			<div className={styles.comment_container}>
				<div className={styles.comment_img}></div>

				<div className={styles.comment_control}>
					<Swiper
						navigation={{
							nextEl: ".testimonial-next",
							prevEl: ".testimonial-prev",
						}}
						slidesPerView={"auto"}
						// centeredSlides={true}
						cssMode={false}
						loop={true}
						autoplay={{
							delay: 20000,
							disableOnInteraction: false,
						}}
						spaceBetween={15}
						modules={[Navigation, Autoplay]}
						className="mySwiper">
						{testimonials.map((testimonial, idx) => {
							``;
							return (
								<SwiperSlide key={idx}>
									<TestimonialCard testimonial={testimonial} />
								</SwiperSlide>
							);
						})}
					</Swiper>
				</div>
			</div>

			<div className={styles.navControl}>
				<div className={styles.dec_header}>
					<h3 className="size_16_24 bold">What our users say about us</h3>
				</div>

				<NavigationButton
					backArrow="testimonial-prev"
					nextArrow="testimonial-next"
				/>
			</div>
		</section>
	);
};

export default Testimonials;

const testimonials: Testimonial[] = [
	{
		name: "Linda S.",
		organization: "Forex Investor",
		comment:
			"As a forex investor, I value precision and reliability. This platform delivers on both fronts. The advanced analytics and educational resources have empowered me to make informed decisions. It's a game-changer for serious traders!",
	},
	{
		name: "Robert M.",
		organization: "Commodity Enthusiast",
		comment:
			"Diversifying my portfolio with commodities was made simple with this platform. The range of commodities offered, coupled with insightful market analyses, has significantly boosted my investment strategy. Highly recommended!",
	},
	{
		name: "Emily R.",
		organization: "Crypto Newbie",
		comment:
			"For someone new to crypto, this app has been a blessing. The educational materials and demo account feature helped me understand the market dynamics before I started investing. The intuitive design made the learning curve a breeze!",
	},
	{
		name: "Carlos L.",
		organization: "Forex Expert",
		comment:
			"As a seasoned forex trader, I've used many platforms. This one stands out with its lightning-fast execution and low spreads. The automated trading tools are a game-changer for professionals like me. Impressive work!",
	},
	{
		name: "Sophia K.",
		organization: "Commodity Investor",
		comment:
			"Investing in commodities can be daunting, but this platform simplifies the process. From agricultural to energy commodities, I've diversified my investments effortlessly. The real-time data ensures I never miss a market opportunity!",
	},
	{
		name: "Alex B.",
		organization: "Commodity Trader",
		comment:
			"Managing my commodity portfolio has never been this efficient. The risk management tools and comprehensive market analysis have given me a competitive edge. It's my one-stop solution for commodity trading.",
	},
	{
		name: "Grace H.",
		organization: "Crypto Investor",
		comment:
			"I've been investing in crypto for years, and this platform has become my favorite. The security measures, diverse investment options, and the community aspect make it a standout choice for serious crypto investors.",
	},
];
