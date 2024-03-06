import { useMemo, useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper";
import styles from "./Plans.module.scss";
import Button from "@/components/UI/Button";
import { FaBitcoin } from "react-icons/fa";
import Link from "next/link";
import { statCardBreakpoints } from "@/utils/cardBreakpoints";
import StatCardContainer from "@/components/Cards/StatCardContainer";

const PlanSection = () => {
	return (
		<>
			<section className={`${styles.section} col-md-12`}>
				<h2 style={{ textAlign: "center" }} className="tf-title  size_30-36">
					Crypto Investment Plans
				</h2>
				<div className="heading-line"></div>{" "}
				<StatCardContainer
					heading=""
					hasContainer={false}
					breakpoints={statCardBreakpoints}>
					<SwiperSlide>
						<div
							className={`${styles.investments_card} ${styles.card_1} cards_bg_color card`}>
							<div className={styles["card-header"]}>
								<div className={`${styles.media}`}>
									<FaBitcoin size={36} />
									<div className=" size_20-24 bold">Silver</div>
								</div>

								<p className={`${styles.med_text} mb-0`}> 24h</p>
							</div>
							<div className={styles.write_up}>
								{" "}
								<h3 className={`size_20 bold ${styles.dollar_text}`}>
									USD $1,000.00
								</h3>
								<span className="size_16">+ 15 Trades per Day</span>
								<span className="size_16">+ Instant Trading</span>
								<span className="size_16">Leverage upto 2X and 5X</span>
								<span className="size_16">+ Demo Trading</span>
							</div>{" "}
							<div className={styles.btn_cont}>
								<Link className="size_14" href={`/investment`}>
									Subscribe
								</Link>
							</div>
						</div>
					</SwiperSlide>

					<SwiperSlide>
						<div
							className={`${styles.investments_card} ${styles.card_2} cards_bg_color card`}>
							<div className={styles["card-header"]}>
								<div className={`${styles.media}`}>
									<FaBitcoin size={36} />
									<div className="size_20-24 bold">Gold</div>
								</div>

								<p className={`${styles.med_text} mb-0`}> 24h</p>
							</div>
							<div className={styles.write_up}>
								{" "}
								<h3 className={`size_20 bold ${styles.dollar_text}`}>
									USD $5,000.00
								</h3>
								<span className="size_16">+ 15 Trades per Day</span>
								<span className="size_16">+ Instant Trading</span>
								<span className="size_16">Leverage upto 2X and 5X</span>
								<span className="size_16">+ Demo Trading</span>
							</div>{" "}
							<div className={styles.btn_cont}>
								<Link className="size_14" href={`/investment`}>
									Subscribe
								</Link>
							</div>
						</div>
					</SwiperSlide>

					<SwiperSlide>
						<div
							className={`${styles.investments_card} ${styles.card_3} cards_bg_color card`}>
							<div className={styles["card-header"]}>
								<div className={`${styles.media}`}>
									<FaBitcoin size={36} />
									<div className=" size_20-24 bold">Diamond</div>
								</div>

								<p className={`${styles.med_text} mb-0`}>24h</p>
							</div>
							<div className={styles.write_up}>
								{" "}
								<h3 className={`size_20 bold ${styles.dollar_text}`}>
									USD $20,000.00
								</h3>
								<span className="size_16">+ 15 Trades per Day</span>
								<span className="size_16">+ Instant Trading</span>
								<span className="size_16">Leverage upto 2X and 5X</span>
								<span className="size_16">+ Demo Trading</span>
							</div>{" "}
							<div className={styles.btn_cont}>
								<Link className="size_14" href={`/investment`}>
									Subscribe
								</Link>
							</div>
						</div>
					</SwiperSlide>

					<SwiperSlide>
						<div
							className={`${styles.investments_card} ${styles.card_4} cards_bg_color  card`}>
							<div className={styles["card-header"]}>
								<div className={`${styles.media}`}>
									<FaBitcoin size={36} />
									<div className=" size_20-24 bold">Platinum</div>
								</div>

								<p className={`${styles.med_text} mb-0`}> 24h</p>
							</div>
							<div className={styles.write_up}>
								{" "}
								<h3 className={`size_20 bold ${styles.dollar_text}`}>
									USD $50,000.00
								</h3>
								<span className="size_16">+ 15 Trades per Day</span>
								<span className="size_16">+ Instant Trading</span>
							</div>{" "}
							<div className={styles.btn_cont}>
								<Link className="size_14" href={`/investment`}>
									Subscribe
								</Link>
							</div>
						</div>
					</SwiperSlide>
				</StatCardContainer>
			</section>
		</>
	);
};

export default PlanSection;
