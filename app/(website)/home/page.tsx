"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Layout/Header";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import Footer from "@/components/Layout/Footer";
import useSession from "@/hooks/use-Session";
import Testimonials from "@/components/Page/Home/Testimonials/Testimonials";
import FaqSection from "@/components/Page/Home/Faq/Faq";
import CryptoCurrencyMarket from "@/components/TradingView/CryptoCurrencyMarket";
import useDocWidth from "@/hooks/use-DocWidth";
import PlanSection from "@/components/Page/Home/Plans/Plans";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/effect-fade";
import styles from "@/styles/app/Home.module.css";

export default function Home() {
	const [showNextBtn, setShowNextBtn] = useState<boolean>(false);
	const { data } = useSession();
	const { docWidth } = useDocWidth();

	const showBtns = () => {
		setShowNextBtn(true);
	};

	const removeBtns = () => {
		setShowNextBtn(false);
	};

	return (
		<>
			<Header />

			{/* <div id="wrapper"> */}
			{/* <div id="page" className="clearfix"> */}
			<section
				onMouseEnter={showBtns}
				onMouseOver={showBtns}
				onMouseOut={removeBtns}
				onMouseLeave={removeBtns}
				className={`${styles.hero_section} flat-title-page style2`}>
				<img
					className="bgr-gradient gradient1"
					src="/images/backgroup-secsion/bg-gradient1.png"
					alt=""
				/>
				<img
					className="bgr-gradient gradient2"
					src="/images/backgroup-secsion/bg-gradient2.png"
					alt=""
				/>
				<img
					className="bgr-gradient gradient3"
					src="/images/backgroup-secsion/bg-gradient3.png"
					alt=""
				/>
				<div className="shape item-w-16"></div>
				<div className="shape item-w-22"></div>
				<div className="shape item-w-32"></div>
				<div className="shape item-w-48"></div>
				<div className="shape style2 item-w-51"></div>
				<div className="shape style2 item-w-51 position2"></div>
				<div className="shape item-w-68"></div>

				<div className="overlay"></div>

				<Swiper
					slidesPerView={1}
					navigation={{
						nextEl: ".swiper-hero-next",
						prevEl: ".swiper-hero-prev",
					}}
					// cssMode={false}
					autoplay={{
						delay: 25000,
						disableOnInteraction: false,
					}}
					spaceBetween={15}
					// loop={true}
					effect="fade"
					modules={[Navigation, Autoplay, EffectFade]}
					className="swiper-container  home auctions">
					<SwiperSlide>
						<div className={`${styles.slider} slider-item`}>
							<div className="themesflat-container">
								<div
									className={`wrap-heading flat-slider  text-center two ${styles.swiper_card_container_1}`}>
									<h2 className="heading size_40-54">Trade and Earn</h2>
									<h1 className="heading size_40-54">
										<span className="tf-text s1 size_40-54">Forex, Crypto</span>{" "}
										<span className="size_40-54">and More</span>
									</h1>
									<p className="sub-heading mg-t-29 mg-bt-50 size_16-20">
										Most reliable 3 in 1 trading platform
									</p>
									<div className={`flat-bt-slider ${styles.slider_container}`}>
										<Link
											href="/auth/register"
											className={`sc-button header-slider style style-1 rocket fl-button pri-1 ${styles.slider_btns}`}>
											<span>Get Started</span>
										</Link>
										<Link
											href={`${process.env.NEXT_PUBLIC_APP_SUBDOMAIN}/profile?token=${data.token}`}
											className={`sc-button header-slider style style-1 note fl-button pri-1 ${styles.slider_btns}`}>
											<span>Account</span>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</SwiperSlide>

					<SwiperSlide>
						<div className={`${styles.slider} slider-item`}>
							<div className="themesflat-container ">
								<div
									className={`wrap-heading flat-slider flex ${styles.swiper_card_container}`}>
									<div className={`${styles.hero_content} content`}>
										<h1 className="heading size_40-54">Trade, Buy And</h1>
										<h1 className={`${styles.stubborn_h1} heading mb-style`}>
											<span className={` tf-text  size_40-54`}>Sell The</span>
											{"  "}
											<span className="s1 tf-text size_40-54">
												Financial Markets
											</span>
										</h1>
										<p className="sub-heading mg-t-29 mg-bt-44"></p>
										<div
											className={`flat-bt-slider ${styles.slider_container} ${styles.slider_container_aux}`}>
											<Link
												href="/auth/register"
												className={`sc-button header-slider style style-1 rocket fl-button pri-1 ${styles.slider_btns}`}>
												<span>Get Started</span>
											</Link>
											<Link
												href="/auth/login"
												className={`sc-button header-slider style style-1 note fl-button pri-1 ${styles.slider_btns}`}>
												<span>Login</span>
											</Link>
										</div>
									</div>

									<div
										className={`${styles.hero_img_cont} slideInRightAnim image`}>
										<img
											className={`${styles.hero_bg} img-bg`}
											src="/images/backgroup-secsion/img-bg-sliderhome2.png"
											alt="Image"
										/>
										<img
											className=""
											src="/images/box-item/imgslider2.png"
											alt="Image"
										/>
									</div>
								</div>
							</div>
						</div>
					</SwiperSlide>

					{docWidth! < 420 && (
						<SwiperSlide>
							<div className={`${styles.slider} slider-item`}>
								<div className="themesflat-container">
									<div
										className={`wrap-heading flat-slider flex ${styles.swiper_card_container}`}>
										<div
											className={`slideInRightAnim ${styles.third_img_cont} image`}>
											<img
												className=""
												src="/images/box-item/imgslider2.png"
												alt="Image"
											/>
										</div>
									</div>
								</div>
							</div>
						</SwiperSlide>
					)}
				</Swiper>

				<div
					className={`${styles.btn_slide} ${styles.btn_slide_prev} ${
						showNextBtn && styles.show_swiper_btn
					} swiper-hero-prev`}>
					<FaAngleLeft size={28} />
				</div>
				<div
					className={`${styles.btn_slide} ${styles.btn_slide_next} ${
						showNextBtn && styles.show_swiper_btn
					} swiper-hero-next`}>
					<FaAngleRight size={28} />
				</div>
			</section>

			<section className="tf-box-icon bg-box-icon-color tf-section">
				<div className="themesflat-container">
					<div className="col-md-12 margin_max">
						<h2 className="tf-title size_30-36">How we Work</h2>
						<div className="heading-line"></div>
					</div>
					<div className="sc-box-icon-inner">
						<div className="sc-box-icon">
							<div className="image">
								<svg
									width="56"
									height="56"
									viewBox="0 0 56 56"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<rect
										y="6.10352e-05"
										width="56"
										height="56"
										rx="16"
										fill="#5142FC"
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M34.9222 26.0179H39.1035C39.5983 26.0179 39.9995 26.3981 39.9995 26.8672V29.8195C39.9937 30.2863 39.5959 30.6634 39.1035 30.6688H35.0182C33.8252 30.684 32.7821 29.9098 32.5115 28.8085C32.376 28.1247 32.5662 27.4192 33.0312 26.881C33.4961 26.3427 34.1883 26.0268 34.9222 26.0179ZM35.1034 29.122H35.4981C36.0047 29.122 36.4154 28.7327 36.4154 28.2525C36.4154 27.7722 36.0047 27.3829 35.4981 27.3829H35.1034C34.8611 27.3802 34.6277 27.4696 34.4554 27.631C34.2831 27.7925 34.1861 28.0127 34.1861 28.2423C34.186 28.7242 34.5951 29.1164 35.1034 29.122Z"
										fill="#F9F9FA"
										fillOpacity="0.4"
									/>
									<path
										d="M34.9227 24.2788H40C40 20.3154 37.5573 18.0001 33.4187 18.0001H22.5813C18.4427 18.0001 16 20.3154 16 24.2283V32.7718C16 36.6847 18.4427 39.0001 22.5813 39.0001H33.4187C37.5573 39.0001 40 36.6847 40 32.7718V32.4079H34.9227C32.5662 32.4079 30.656 30.5972 30.656 28.3636C30.656 26.13 32.5662 24.3193 34.9227 24.3193V24.2788Z"
										fill="white"
									/>
									<path
										d="M28.4582 24.2789H21.6849C21.1766 24.2734 20.7675 23.8812 20.7676 23.3993C20.7734 22.923 21.1824 22.5398 21.6849 22.5399H28.4582C28.9649 22.5399 29.3756 22.9292 29.3756 23.4094C29.3756 23.8896 28.9649 24.2789 28.4582 24.2789Z"
										fill="#948BFB"
									/>
								</svg>
							</div>
							<h3 className="heading">
								<Link className="size_20-24" href="/auth/register">
									Set Up Account
								</Link>
							</h3>
							<p className="content">
								One Account for trading and sales, the very first of its kind!
								Registration takes less than a minute
							</p>
						</div>
						<div className="sc-box-icon">
							<div className="image">
								<svg
									width="56"
									height="56"
									viewBox="0 0 56 56"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<rect
										y="6.10352e-05"
										width="56"
										height="56"
										rx="16"
										fill="#47A432"
									/>
									<path
										d="M23.104 16.0001H19.048C17.368 16.0001 16 17.3801 16 19.0732V23.164C16 24.868 17.368 26.236 19.048 26.236H23.104C24.796 26.236 26.1519 24.868 26.1519 23.164V19.0732C26.1519 17.3801 24.796 16.0001 23.104 16.0001Z"
										fill="white"
									/>
									<path
										d="M23.104 29.7637H19.048C17.368 29.7637 16 31.1329 16 32.8369V36.9277C16 38.6197 17.368 39.9997 19.048 39.9997H23.104C24.796 39.9997 26.1519 38.6197 26.1519 36.9277V32.8369C26.1519 31.1329 24.796 29.7637 23.104 29.7637Z"
										fill="white"
									/>
									<path
										d="M36.9516 16.0001H32.8956C31.2036 16.0001 29.8477 17.3801 29.8477 19.0732V23.164C29.8477 24.868 31.2036 26.236 32.8956 26.236H36.9516C38.6316 26.236 39.9996 24.868 39.9996 23.164V19.0732C39.9996 17.3801 38.6316 16.0001 36.9516 16.0001Z"
										fill="white"
										fillOpacity="0.4"
									/>
									<path
										d="M36.9516 29.7637H32.8956C31.2036 29.7637 29.8477 31.1329 29.8477 32.8369V36.9277C29.8477 38.6197 31.2036 39.9997 32.8956 39.9997H36.9516C38.6316 39.9997 39.9996 38.6197 39.9996 36.9277V32.8369C39.9996 31.1329 38.6316 29.7637 36.9516 29.7637Z"
										fill="white"
									/>
								</svg>
							</div>
							<h3 className="heading size_20-24">
								<Link className="size_20-24" href="/">
									Add Your Collection
								</Link>
							</h3>
							<p className="content">
								Fill the form to have your collection listed in our ever growing
								market place.
							</p>
						</div>
						<div className="sc-box-icon mg-bt">
							<div className="image">
								<svg
									width="56"
									height="56"
									viewBox="0 0 56 56"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<rect width="56" height="56" rx="16" fill="#9835FB" />
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M19.396 23.8885C19.396 21.1625 21.061 19.3955 23.638 19.3955H32.354C34.94 19.3955 36.605 21.1625 36.605 23.8885V29.1905C36.159 28.8125 34.812 27.8715 34.624 27.7595C33.224 26.9195 31.544 27.2995 30.454 28.7195C30.359 28.8445 28.782 31.1445 28.224 31.4885C28.095 31.5685 27.959 31.6115 27.814 31.6315C27.464 31.6615 27.127 31.4815 26.554 31.0985C26.224 30.8885 25.864 30.6495 25.454 30.4795C23.749 29.7665 22.45 30.9445 21.758 31.7345C21.749 31.7425 19.812 34.1045 19.781 34.1415C19.538 33.5505 19.396 32.8675 19.396 32.1025V23.8885ZM38 23.8885C38 20.3625 35.731 18.0005 32.354 18.0005H23.638C20.271 18.0005 18 20.3625 18 23.8885V32.1025C18 33.6745 18.447 35.0135 19.238 36.0095C19.247 36.0185 19.247 36.0285 19.256 36.0285C20.043 37.0135 21.166 37.6665 22.519 37.8995C22.531 37.9015 22.543 37.9035 22.556 37.9055C22.903 37.9625 23.262 38.0005 23.638 38.0005H32.354C32.535 38.0005 32.7 37.9665 32.874 37.9535C33.078 37.9365 33.289 37.9325 33.483 37.8985C33.74 37.8545 33.976 37.7775 34.215 37.7035C34.319 37.6705 34.43 37.6505 34.53 37.6125C34.773 37.5205 34.996 37.4015 35.217 37.2795C35.297 37.2355 35.383 37.1995 35.461 37.1505C35.678 37.0145 35.875 36.8555 36.068 36.6895C36.132 36.6345 36.201 36.5845 36.262 36.5265C36.45 36.3475 36.616 36.1505 36.775 35.9445C36.824 35.8795 36.876 35.8195 36.923 35.7525C37.076 35.5345 37.208 35.2995 37.33 35.0545C37.364 34.9835 37.4 34.9145 37.433 34.8425C37.546 34.5855 37.64 34.3165 37.72 34.0345C37.741 33.9585 37.762 33.8835 37.78 33.8055C37.851 33.5145 37.902 33.2145 37.935 32.9005C37.939 32.8625 37.95 32.8275 37.954 32.7895C37.961 32.7045 37.96 32.6195 37.965 32.5345C37.973 32.3885 38 32.2535 38 32.1025V23.8885Z"
										fill="white"
									/>
									<path
										d="M24.5048 27.0001C25.8663 27.0001 27 25.87 27 24.5151C27 23.8356 26.7151 23.2132 26.2607 22.7615C25.8081 22.2935 25.1764 22.0001 24.4787 22.0001C23.1085 22.0001 22 23.1041 22 24.4687C22 24.6492 22.0213 24.8239 22.0591 24.9937C22.2878 26.1257 23.3081 27.0001 24.5048 27.0001Z"
										fill="white"
										fillOpacity="0.4"
									/>
								</svg>
							</div>
							<h3 className="heading size_20-24">
								<Link
									className="size_20-24"
									href={
										data.token
											? `${process.env.NEXT_PUBLIC_APP_SUBDOMAIN}/trade?token=${data.token}}`
											: "/auth/login"
									}>
									Trading
								</Link>
							</h3>
							<p className="content">
								You can trade crypto, forex, commodities, etc. on your dashboard
								and earn directly to your wallet.
							</p>
						</div>
						<div className="sc-box-icon">
							<div className="image">
								<svg
									width="56"
									height="56"
									viewBox="0 0 56 56"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<rect width="56" height="56" rx="16" fill="#DF4949" />
									<rect
										x="21"
										y="22"
										width="13"
										height="4"
										fill="white"
										fillOpacity="0.4"
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M24.125 16H31.8375C35.225 16 37.9625 17.284 38 20.5478V38.7631C38 38.9671 37.95 39.1711 37.85 39.3511C37.6875 39.6391 37.4125 39.8551 37.075 39.9511C36.75 40.0471 36.3875 39.9991 36.0875 39.8311L27.9875 35.9432L19.875 39.8311C19.6888 39.9259 19.475 39.9871 19.2625 39.9871C18.5625 39.9871 18 39.4351 18 38.7631V20.5478C18 17.284 20.75 16 24.125 16ZM23.2753 25.1437H32.6878C33.2253 25.1437 33.6628 24.7225 33.6628 24.1958C33.6628 23.6678 33.2253 23.2478 32.6878 23.2478H23.2753C22.7378 23.2478 22.3003 23.6678 22.3003 24.1958C22.3003 24.7225 22.7378 25.1437 23.2753 25.1437Z"
										fill="white"
									/>
								</svg>
							</div>
							<h3 className="heading size_20-24">
								<Link className="size_20-24" href="/">
									My Collections
								</Link>
							</h3>
							<p className="content">
								Login to View all your collections in an organized and sales
								ready format.
							</p>
						</div>
					</div>
				</div>
			</section>

			<PlanSection />

			<section className="tf-section bg-box-icon-color">
				<div className="themesflat-container">
					<div className="row">
						<div className="col-md-12 margin_max">
							<h2 style={{ textAlign: "center" }} className="pb-12 size_30-36">
								Cryptocurrency Market
							</h2>
							<div className="heading-line"></div>
						</div>

						<div className="col-md-12 col-xl-12 col-lg-12 col-sm-12">
							{/* <!-- TradingView Widget BEGIN --> */}
							<div className="tradingview-widget-container">
								<div className="tradingview-widget-container__widget"></div>
								<div className="tradingview-widget-copyright">
									<CryptoCurrencyMarket colorTheme="dark" width={"100%"} />
									<a
										href="https://www.tradingview.com/markets/cryptocurrencies/prices-all/"
										rel="noreferrer"
										target="_blank">
										<span className="blue-text">Cryptocurrency Markets</span>
									</a>{" "}
									by Top Metro Investment
								</div>
							</div>
							{/* <!-- TradingView Widget END --> */}
						</div>
					</div>
				</div>
			</section>

			<FaqSection />

			<Testimonials />

			<Footer />
			{/* </div> */}
			{/* <!-- Modal Popup Bid --> */}
			{/* </div> */}

			<Link href={"/"} id="scroll-top"></Link>
		</>
	);
}