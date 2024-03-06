import { ReactNode, MouseEvent, useState } from "react";
import Image from "next/legacy/image";
import { AnimatePresence, motion } from "framer-motion";
import NextLink from "next/link";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import Link from "../UI/Link";
import MobileMenu from "../UI/MobileMenu";

import styles from "./AdminLayout.module.scss";
import {
	Icon,
	avatar,
	dashboardIconBlur,
	dashboardIconSharp,
	menuIcon,
	transactionsIcons,
	withdrawalIcon,
} from "@/helpers/image-imports";
import useSession from "@/hooks/use-Session";
import { userSliceActions } from "@/store/userSlice";
import { usePathname, useRouter } from "next/navigation";
import { TbLogout } from "react-icons/tb";

interface Props {
	children: ReactNode;
	withContainer?: boolean;
	hasSidePadding?: boolean;
}

const AdminLayout = ({
	children,
	withContainer = true,
	hasSidePadding = true,
}: Props) => {
	const router = useRouter();
	const pathname = usePathname();
	const dispatch = useDispatch();
	const [showDropdown, setShowDropdown] = useState(false);
	const [showMenu, setShowMenu] = useState<boolean>(false);
	const { data } = useSession();

	const mouseOverHandler = (event: MouseEvent<HTMLDivElement>) => {
		setShowDropdown(true);
	};

	const mouseOutHandler = () => {
		setShowDropdown(false);
	};

	const logoutHandler = async () => {
		dispatch(userSliceActions.logOut({}));
	};

	return (
		<main className={`${styles.container}`}>
			<MobileMenu setShowMenu={setShowMenu} showMenu={showMenu}>
				<div className={styles.top_bar}>
					<div className={styles.logo_container}>
						<Link
							href={`/`}
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
						<div className={styles.links_control}>
							<Link className={`size_18 bold`} href={"/admin/investors"}>
								Investors
							</Link>
						</div>

						<div className={styles.links_control}>
							<Link className={`size_18 bold`} href={"/admin/deposits"}>
								Deposits
							</Link>
						</div>

						<div className={styles.links_control}>
							<Link className={`size_18 bold`} href={"/admin/withdrawals"}>
								Withdrawals
							</Link>
						</div>
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

			<aside className={styles.sidebar}>
				<div className={styles.logo}>
					<Link href={"/"}>
						<Image
							alt={"logo"}
							src={Icon}
							width={"40"}
							height={"40"}
							objectFit={"contain"}
						/>
					</Link>
					<h1 className={`${styles.menu_text} size_20 bold`}>Top Metro</h1>
				</div>

				<NextLink
					href={"/admin/investors"}
					id={pathname.includes("/investors") ? styles.active : ""}
					className={`${styles.side_links} size_16 bold`}>
					<Image
						src={
							pathname.includes("/investors")
								? dashboardIconSharp
								: dashboardIconBlur
						}
						alt=""
						width={23}
						height={20}
						objectFit="contain"
					/>
					<span className={styles.menu_text}>Investors</span>
				</NextLink>

				<NextLink
					href={"/admin/deposits"}
					id={pathname.includes("/deposits") ? styles.active : ""}
					className={`${styles.side_links} size_16 bold`}>
					<Image
						src={
							pathname.includes("/deposits")
								? transactionsIcons
								: transactionsIcons
						}
						alt=""
						width={23}
						height={20}
						objectFit="contain"
					/>
					<span className={styles.menu_text}>Deposits</span>
				</NextLink>

				<NextLink
					href={"/admin/withdrawals"}
					id={pathname.includes("/withdrawals") ? styles.active : ""}
					className={`${styles.side_links} size_16 bold`}>
					<Image
						src={
							pathname.includes("/withdrawals")
								? withdrawalIcon
								: withdrawalIcon
						}
						alt=""
						width={23}
						height={20}
						objectFit="contain"
					/>
					<span className={styles.menu_text}>Withdrawals</span>
				</NextLink>
			</aside>

			<div id="content_container" className={styles.nav_content_control}>
				<div className={styles.navbar_container}>
					<nav className={styles.navbar}>
						<div className={styles.notebook_menu}>
							<Image
								alt={"logo"}
								src={Icon}
								width={"40"}
								height={"40"}
								objectFit={"contain"}
							/>

							<button onClick={() => setShowMenu((prevState) => !prevState)}>
								{showMenu ? (
									<IoClose size={28} />
								) : (
									<Image
										alt={""}
										src={menuIcon}
										width={18}
										height={18}
										objectFit={"contain"}
									/>
								)}
							</button>
						</div>

						<div
							onMouseEnter={mouseOverHandler}
							onMouseLeave={mouseOutHandler}
							onClick={mouseOverHandler}
							className={styles.dropdown}>
							<div className={styles.avatar}>
								<div className={styles.imageControl}>
									<Image
										src={data?.avatar ?? avatar}
										alt=""
										width={40}
										height={40}
										objectFit="contain"
									/>
								</div>
							</div>
							<AnimatePresence>
								{showDropdown && (
									<motion.ul
										transition={{
											duration: 0.3,
											type: "tween",
										}}
										animate={{ y: 0, opacity: 1 }}
										initial={{ y: 40, opacity: 0 }}
										exit={{ y: 40, opacity: 0 }}
										className={styles.dropdown_list}>
										<li className={styles.dropdown_header}>
											<Image
												src={data?.avatar ?? avatar}
												alt=""
												width={40}
												height={40}
												objectFit="contain"
											/>
											<div className={`${styles.heading}`}>
												<div className={`${styles.name} ellipses size_16 bold`}>
													{data.firstName}{" "}
												</div>
												<div className="size_12">Admin Account</div>
											</div>
										</li>
										<li className={`${styles.dropdown_listitem}`}>
											<div
												onClick={logoutHandler}
												className={`${styles.listItem_control} ${styles.log_out} size_16`}>
												<TbLogout size={23} />
												Logout
											</div>
										</li>
									</motion.ul>
								)}
							</AnimatePresence>
						</div>
					</nav>
				</div>
				<>
					{withContainer ? (
						<section
							className={`${styles.content} ${
								!hasSidePadding ? styles.no_side_padding : null
							}`}>
							{children}
						</section>
					) : (
						<>{children}</>
					)}
				</>
			</div>
		</main>
	);
};

export default AdminLayout;
