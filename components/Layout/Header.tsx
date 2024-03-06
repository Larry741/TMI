import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { BsSunFill } from "react-icons/bs";
import { HiMoon } from "react-icons/hi";
import { uiSliceAction } from "@/store/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppStoreType } from "@/store";
import useDocWidth from "@/hooks/use-DocWidth";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/helpers/image-imports";

import styles from "./Header.module.css";
import { usePathname } from "next/navigation";

let interval: any;
const Header = () => {
	const path = usePathname();
	const { docWidth } = useDocWidth();
	const { isDarkMode } = useSelector((state: AppStoreType) => state.ui);
	const dispatch = useDispatch();
	const [reRender, setRerender] = useState<boolean>(true);

	useEffect(() => {
		const overlayEls = document.getElementsByClassName("overlay");
		const headerEl = document.getElementById("header_main");

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) {
						headerEl?.classList.add("header_is_fixed");
					} else if (entry.isIntersecting) {
						headerEl?.classList.remove("header_is_fixed");
					}
				});
			},
			{ threshold: 0.9 }
		);

		if (overlayEls.length) {
			observer.observe(overlayEls[0]);
		} else {
			setRerender(true);
		}

		if (!overlayEls.length || !headerEl) {
			interval = setInterval(() => {
				setRerender(!reRender);
			}, 500);
		}

		return () => {
			clearInterval(interval);
			if (overlayEls.length) observer.unobserve(overlayEls[0]);
		};
	}, [reRender]);

	if (docWidth === undefined) {
		return <></>;
	}

	const toggleDarkMode = () => {
		const bodyEl = document.getElementsByTagName("body");

		if (isDarkMode) {
			bodyEl[0].classList.remove("is_dark");
		} else {
			bodyEl[0].classList.add("is_dark");
		}

		dispatch(uiSliceAction.toggleDarkMode({ mode: !isDarkMode }));
	};

	return (
		<header id="header_main" className={`header_1 js-header`}>
			<div className="themesflat-container">
				<div className="row">
					<div className="col-md-12">
						<div id="site-header-inner">
							<div className="wrap-box flex">
								<div id="site-logo" className="clearfix">
									<div id="site-logo-inner">
										<Link
											href={`/`}
											className={`header_link size_18-20 work-sans bold`}>
											<Image alt="" width={"40"} height={"40"} src={Icon} />
											<h1 className="size_20">Top Metro Investment</h1>
										</Link>
									</div>
								</div>

								<div
									className={`mobile-button`}
									onClick={(e: React.FormEvent) => {
										e.preventDefault();
										const target = e.currentTarget.closest(
											"div"
										) as HTMLDivElement;
										const nav = document.getElementById(
											"main-nav-mobi"
										)! as HTMLDivElement;

										if (target.classList.contains("active")) {
											target.classList.remove("active");
											nav.classList.add(styles.collapse_nav);
										} else {
											target.classList.add("active");
											nav.classList.remove(styles.collapse_nav);
										}
									}}>
									<span></span>
								</div>

								<nav
									id={`${docWidth > 990 ? "main-nav" : "main-nav-mobi"}`}
									className={`${styles.nav} ${styles.collapse_nav} main-nav`}>
									<ul id="menu-primary-menu" className={`${styles.menu} menu`}>
										<li
											className={`${styles.menu_item} ${
												path === "/" ? styles.active_nav : ""
											} menu-item current-menu-item`}>
											<Link href={"/"}>Home</Link>
										</li>
										<li
											className={`${styles.menu_item} ${
												path === "/market" ? styles.active_nav : ""
											} menu-item current-menu-item`}>
											<Link href="/market">Markets</Link>
										</li>
										<li
											className={`${styles.menu_item} ${
												path === "/contact" ? styles.active_nav : ""
											} menu-item current-menu-item`}>
											<Link href="/contact">Contact Us</Link>
										</li>
										<li
											className={`${styles.menu_item} ${
												path === "/about" ? styles.active_nav : ""
											} menu-item current-menu-item`}>
											<Link href="/about">About Us</Link>
										</li>
										<li
											className={`${styles.menu_item} ${
												path === "/terms" ? styles.active_nav : ""
											} menu-item current-menu-item`}>
											<Link href="/terms">Terms of Use</Link>
										</li>
									</ul>
								</nav>

								<div className="flat-search-btn flex">
									<div className="sc-btn-top mg-r-12" id="site-header">
										{/* {status === "authenticated" ? (
											<button></button>
										) : ( */}
										<Link
											href="/auth/register"
											id="connectbtn"
											className="sc-button header-slider style style-1 wallet fl-button pri-1">
											<span>Sign Up</span>
										</Link>
										{/* )} */}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mode_switcher">
				<button
					className={`${styles.dark_mode_control} light d-flex align-items-center`}
					onClick={toggleDarkMode}>
					{isDarkMode ? (
						<BsSunFill className={styles.sun_icon} size={24} />
					) : (
						<HiMoon size={24} />
					)}
				</button>
			</div>
		</header>
	);
};

export default Header;
