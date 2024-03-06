import {
	ReactNode,
	MouseEvent,
	useState,
	useMemo,
	useRef,
	useContext,
	useEffect,
} from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { AiFillInstagram, AiOutlineRise } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import {
	MdAccountBalanceWallet,
	MdHome,
	MdSpaceDashboard,
} from "react-icons/md";
import Image from "next/image";
import { RiLuggageDepositFill } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { IoClose, IoMenu } from "react-icons/io5";
import { AiOutlineSetting } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { TbLogout } from "react-icons/tb";
// import { ConnectWallet, useConnect, useUser } from "@thirdweb-dev/react";
import useSession from "@/hooks/use-Session";
import { userSliceActions } from "@/store/userSlice";
import MobileMenu from "@/components/UI/MobileMenu";
import { Icon, avatar } from "@/helpers/image-imports";
import { CURRENCY_SYMBOLS } from "@/utils/constants";
import NotificationContext from "@/context/notification";
import useHttp from "@/hooks/use-Http";

import styles from "./DashboardLayout.module.scss";
import { Poppins } from "next/font/google";

const ft = Poppins({
	subsets: ["latin"],
	display: "swap",
	weight: ["300", "400", "700"],
});

interface Props {
	children: ReactNode;
	large?: boolean;
}

const DashboardLayout = ({ children, large = false }: Props) => {
	const { data, status } = useSession();
	const pathname = usePathname();
	const dispatch = useDispatch();
	const [showDropdown, setShowDropdown] = useState(false);
	const [showCurrDropdown, setShowCurrDropdown] = useState(false);
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const currRef = useRef<any[]>([]);
	const { setNotification } = useContext(NotificationContext);
	const { httpIsLoading: notLoading, sendRequest } = useHttp();
	const calledRef = useRef<boolean>(false);
	// const { isLoading, isLoggedIn, user } = useUser();

	useEffect(() => {
		var addScript = document.createElement("script");
		addScript.setAttribute(
			"src",
			"//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
		);
		document.body.appendChild(addScript);
		// @ts-ignore
		window.googleTranslateElementInit = googleTranslateElementInit;

		return () => {
			const google = document.getElementById("google_translate_element");

			if (google) {
				google.innerHTML = "";
			}
		};
	}, []);

	const googleTranslateElementInit = () => {
		if (calledRef.current) return;
		calledRef.current = true;
		// @ts-ignore
		new window.google.translate.TranslateElement(
			{
				pageLanguage: "en",
			},
			"google_translate_element"
		);
	};

	const mouseOverHandler = (event: MouseEvent<HTMLDivElement>) => {
		setShowDropdown(true);
		setShowCurrDropdown(false);
	};

	const mouseOutHandler = () => {
		setShowDropdown(false);
		setShowCurrDropdown(false);
	};

	const currMouseOverHandler = (event: MouseEvent<HTMLDivElement>) => {
		setShowDropdown(false);
		setShowCurrDropdown(true);
	};

	const currMouseOutHandler = () => {
		setShowDropdown(false);
		setShowCurrDropdown(false);
	};

	const logoutHandler = async () => {
		dispatch(userSliceActions.logOut({}));
	};

	const httpUpdateUser = async (currency: string) => {
		const { error, message, status } = await sendRequest(
			"PUT",
			"user",
			{ currency },
			"JSON"
		);

		if (error) {
			return setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
		}

		// setNotification({
		//   message: `${message}`,
		//   status: "SUCCESS",
		//   title: "Error"
		// });
		setShowCurrDropdown(false);
		dispatch(userSliceActions.updateUserDetails({ currency }));
	};

	useMemo(() => {
		currRef.current = [];
		for (let key in CURRENCY_SYMBOLS) {
			if (key === data.currency) continue;
			currRef.current!.push(key);
		}
	}, [data.currency]);

	return (
		<main className={`${styles.container} ${ft.className}`}>
			<MobileMenu showMenu={showMenu} setShowMenu={setShowMenu}>
				<div className={styles.top_bar}>
					<div className={styles.logo_container}>
						<Link
							href={`/home`}
							className={`${styles.header_link} size_18-20 bold`}>
							<Image alt="" width={"40"} height={"40"} src={Icon} />
							<h1 className="work-sans bold">Top Metro Investment</h1>
						</Link>
					</div>

					<button
						className={styles.menu_btn}
						onClick={() => {
							setShowMenu(false);
						}}>
						<IoClose size={28} />
					</button>
				</div>

				<div className={styles.menu_overlay}>
					<div className={styles.links_control}>
						<Link href={"/dashboard"}>
							<MdHome size={30} />
							<span className={styles.menu_text}>Dashboard</span>
						</Link>

						<Link href={"/trade"}>
							<MdSpaceDashboard size={30} />
							<span className={styles.menu_text}>Trade</span>
						</Link>

						<Link href={"/investment"}>
							<AiOutlineRise size={30} />
							<span className={styles.menu_text}>Investment</span>
						</Link>

						<Link href={"/deposit"} className={`size_18`}>
							<RiLuggageDepositFill size={30} />
							<span className={styles.menu_text}>Deposit</span>
						</Link>

						<Link href={"/withdrawal"} className={`size_18`}>
							<BiMoneyWithdraw size={30} />
							<span className={styles.menu_text}>Withdrawal</span>
						</Link>

						<Link href={"/profile"} className={`size_18`}>
							<AiOutlineSetting size={30} />
							<span className={styles.menu_text}>Profile</span>
						</Link>
					</div>

					<ul className={styles.profile_list}>
						<li className={`${styles.li}`}>
							<button onClick={logoutHandler} className={`size_16`}>
								<TbLogout size={28} />
								Logout
							</button>
						</li>
					</ul>
				</div>
			</MobileMenu>

			<header id={"top-metro-top-navbar"} className={styles.top_header}>
				<Link
					href={`/home`}
					className={`${styles.header_link} size_18-20 bold`}>
					<Image alt="" width={"40"} height={"40"} src={Icon} />
					<h1 className="work-sans bold">Top Metro Investment</h1>
				</Link>

				<div className={styles.profile}>
					<div id="google_translate_element"></div>

					<div className={styles.prof_con}>
						<div className={`${styles.connect_wallet}`}>
							{/* <ConnectWallet
								btnTitle="C"
								className={styles.wallet_connect_btn_pre}
							/>

							<MdAccountBalanceWallet size={20} /> */}
						</div>

						<div
							onMouseEnter={currMouseOverHandler}
							onMouseLeave={currMouseOutHandler}
							onClick={currMouseOverHandler}
							className={styles.currency_symbols}>
							<div className={styles.currency_symbols_drop_btn}>
								<span className="crimson_text size_30">
									{CURRENCY_SYMBOLS[data.currency as "GBP"]}
								</span>
								<span className="size_13">{data.currency}</span>
							</div>

							<AnimatePresence>
								{showCurrDropdown && (
									<motion.ul
										transition={{
											duration: 0.2,
											type: "tween",
										}}
										animate={{ y: 0, opacity: 1 }}
										initial={{ y: 60, opacity: 0 }}
										exit={{ y: 60, opacity: 0 }}
										key={"dropdown"}
										className={styles.curr_dropdown_list}>
										{currRef.current?.map((curr, idx) => {
											return (
												<li
													onClick={() => {
														httpUpdateUser(curr);
													}}
													className="size_16"
													key={idx}>
													<span className="crimson_text size_22">
														{CURRENCY_SYMBOLS[curr as "GBP"]}
													</span>{" "}
													- {curr}
												</li>
											);
										})}
									</motion.ul>
								)}
							</AnimatePresence>
						</div>

						<div
							onMouseEnter={mouseOverHandler}
							onMouseLeave={mouseOutHandler}
							onClick={mouseOverHandler}
							className={styles.profile_img}>
							<div className={styles.drop_btn}>
								<FaUser size={14} />
							</div>

							<AnimatePresence>
								{showDropdown && (
									<motion.ul
										transition={{
											duration: 0.2,
											type: "tween",
										}}
										animate={{ y: 0, opacity: 1 }}
										initial={{ y: 60, opacity: 0 }}
										exit={{ y: 60, opacity: 0 }}
										key={"dropdown"}
										className={styles.dropdown_list}>
										<li className={styles.dropdown_header}>
											<div className={styles.img_container}>
												<Image
													src={data?.avatar ?? avatar}
													style={{ borderRadius: "50%", background: "#606B8A" }}
													alt=""
													width={50}
													height={50}
												/>
											</div>
											<div className={`${styles.heading}`}>
												<div className={`${styles.name} size_17 bold`}>
													{`${data.firstName}`}
												</div>
												<div className="size_13">{data.email}</div>{" "}
											</div>
										</li>
										{status === "authenticated" ? (
											<li
												className={`${styles.dropdown_listitem} ${styles.li2}`}>
												<Link
													href={"/profile"}
													className={`${styles.listItem_control} size_15`}>
													<FaUser className={styles.user_icon} size={23} />
													Account
												</Link>
											</li>
										) : null}
										<li className={`${styles.dropdown_listitem}`}>
											<button
												onClick={logoutHandler}
												className={`${styles.listItem_control} ${styles.log_out} size_15`}>
												<TbLogout size={23} />
												Logout
											</button>
										</li>
									</motion.ul>
								)}
							</AnimatePresence>
						</div>
						<button
							className={styles.menu_btn}
							onClick={() => setShowMenu((prevState) => !prevState)}>
							<IoMenu size={28} />
						</button>
					</div>
				</div>
			</header>

			<section className={styles.sect}>
				<nav className={styles.nav}>
					<Link
						href={"/dashboard"}
						className={`${styles.side_links} ${
							pathname!.includes("/dashboard") ? styles.active_side_link : ""
						} size_14`}>
						<MdHome size={30} />

						<span className={styles.menu_text}>Dashboard</span>
					</Link>

					<Link
						href={"/trade"}
						className={`${styles.side_links} ${
							pathname!.includes("/trade") ? styles.active_side_link : ""
						} size_14`}>
						<MdSpaceDashboard size={30} />
						<span className={styles.menu_text}>Trade</span>
					</Link>

					<Link
						href={"/investment"}
						className={`${styles.side_links} ${
							pathname!.includes("/investment") ? styles.active_side_link : ""
						} size_14`}>
						<AiOutlineRise size={30} />
						<span className={styles.menu_text}>Investment</span>
					</Link>

					<Link
						href={"/deposit"}
						className={`${styles.side_links} ${
							pathname!.includes("/deposit") ? styles.active_side_link : ""
						} size_14`}>
						<RiLuggageDepositFill size={30} />
						<span className={styles.menu_text}>Deposit</span>
					</Link>

					<Link
						href={"/withdrawal"}
						className={`${styles.side_links} ${
							pathname!.includes("/withdrawal") ? styles.active_side_link : ""
						} size_14`}>
						<BiMoneyWithdraw size={30} />
						<span className={styles.menu_text}>Withdrawal</span>
					</Link>

					<Link
						href={"/profile"}
						className={`${styles.side_links} ${
							pathname!.includes("/profile") ? styles.active_side_link : ""
						} size_14`}>
						<AiOutlineSetting size={30} />
						<span className={styles.menu_text}>Profile</span>
					</Link>
				</nav>

				{large ? (
					<div id={"content_container"} className={styles.content_large}>
						{children}
					</div>
				) : (
					<div id={"content_container"} className={styles.content_sec}>
						{children}
					</div>
				)}
			</section>

			<footer className={styles.foot}>
				<div className="size_15 poppins">
					© Copyright 2023{" "}
					<span className={`${styles.colored_txt} bold`}>
						Top Metro Investment
					</span>{" "}
					All Rights Reserved
				</div>

				<div className={styles.foot_link}>
					<FaFacebookF size={16} />
					<FaTwitter size={16} />
					<AiFillInstagram size={16} />
				</div>
			</footer>
		</main>
	);
};

export default DashboardLayout;
