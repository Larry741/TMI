import { Pagination, Grid } from "swiper";
import { SwiperSlide, Swiper } from "swiper/react";
import Image from "next/image";
import { cryptoImg, forexImg, goldImg, oilImg } from "@/helpers/image-imports";
import Button from "@/components/UI/Button";
import Link from "next/link";

import styles from "./Index.module.scss";

const TradeIndex = () => {
	return (
		<div className={styles.trade_index}>
			<div className={`${styles.trade_index_row}`}>
				<Image src={forexImg} alt="" />

				<div
					style={{
						display: "flex",
						alignItems: "flex-end",
						flexDirection: "column",
						justifyContent: "space-between",
					}}>
					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							flexDirection: "column",
						}}>
						<h2 className="size_18-20 bold">Forex</h2>
						<p className={`size_14-15`}>
							At TMI, we empower you to navigate the exciting world of forex
							trading with confidence. Here&lsquo;s what sets us apart: Trade
							major, minor, and exotic currency pairs on a global scale. Our
							platform prioritizes security, ensuring a safe trading environment
							for your peace of mind. Leverage cutting-edge trading tools and
							analytics to make informed decisions.
						</p>
					</div>

					<Link
						className={`${styles.link} ${styles.trade_link_forex} size_14`}
						href={"/trade/forex"}>
						Trade Forex
					</Link>
				</div>
			</div>

			<div className={`${styles.trade_index_row}`}>
				<Image src={cryptoImg} alt="" />

				<div
					style={{
						display: "flex",
						alignItems: "flex-end",
						flexDirection: "column",
						justifyContent: "space-between",
					}}>
					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							flexDirection: "column",
						}}>
						<h2 className="size_18-20 bold">Crypto</h2>
						<p className={`size_14-15`}>
							At TMI, we empower you to navigate the exciting world of forex
							trading with confidence. Here&lsquo;s what sets us apart: Trade
							major, minor, and exotic currency pairs on a global scale. Our
							platform prioritizes security, ensuring a safe trading environment
							for your peace of mind.
						</p>
					</div>

					<Link
						className={`${styles.link} ${styles.trade_link_crypto} size_14`}
						href={"/trade/crypto"}>
						Trade Crypto
					</Link>
				</div>
			</div>

			<div className={`${styles.trade_index_row}`}>
				<Image src={goldImg} alt="" />

				<div
					style={{
						display: "flex",
						alignItems: "flex-end",
						flexDirection: "column",
						justifyContent: "space-between",
					}}>
					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							flexDirection: "column",
						}}>
						<h2 className="size_18-20 bold">Gold</h2>
						<p className={`size_14-15`}>
							At TMI, we empower you to navigate the exciting world of forex
							trading with confidence. Here&lsquo;s what sets us apart: Trade
							major, minor, and exotic currency pairs on a global scale. Our
							platform prioritizes security, ensuring a safe trading environment
							for your peace of mind. Leverage cutting-edge trading tools and
							analytics to make informed decisions.
						</p>
					</div>

					<Link
						className={`${styles.link} ${styles.trade_link_gold} size_14`}
						href={"/trade/commodity?t=gold"}>
						Trade Gold
					</Link>
				</div>
			</div>

			<div className={`${styles.trade_index_row}`}>
				<Image src={oilImg} alt="" />

				<div
					style={{
						display: "flex",
						alignItems: "flex-end",
						flexDirection: "column",
						justifyContent: "space-between",
					}}>
					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							flexDirection: "column",
						}}>
						<h2 className="size_18-20 bold">Crude</h2>
						<p className={`size_14-15`}>
							At TMI, we empower you to navigate the exciting world of forex
							trading with confidence. Here&lsquo;s what sets us apart: Trade
							major, minor, and exotic currency pairs on a global scale. Our
							platform prioritizes security, ensuring a safe trading environment
							for your peace of mind. Leverage cutting-edge trading tools and
							analytics to make informed decisions.
						</p>
					</div>

					<Link
						className={`${styles.link} ${styles.trade_link_stocks} size_14`}
						href={"/trade/commodity?t=crude"}>
						Trade Crude
					</Link>
				</div>
			</div>
		</div>
	);
};

export default TradeIndex;
