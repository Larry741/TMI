import useHttp from "@/hooks/use-Http";
import Link from "next/link";
import { Loader } from "@/components/UI/loader";
import NotificationContext from "@/context/notification";
import { useContext } from "react";
import { Icon } from "@/helpers/image-imports";
import Image from "next/image";
import { Inter, Ubuntu, Work_Sans, Urbanist } from "next/font/google";

import styles from "./Footer.module.scss";

const inter = Work_Sans({
	subsets: ["latin"],
	display: "swap",
	weight: ["300", "400", "700"],
});

const Footer = () => {
	const { sendRequest, httpIsLoading } = useHttp();
	const { setNotification } = useContext(NotificationContext);

	const httpSubscribeNewsletter = async (e: React.FormEvent) => {
		e.preventDefault();

		const target = e.currentTarget as HTMLFormElement;
		const formInputs = target.elements;

		const formData: { [key in string]: string } = {};
		let isValid = true;
		// Iterate through form elements
		for (let i = 0; i < formInputs.length; i++) {
			const input = formInputs[i] as HTMLInputElement;

			// Check if the element is an input or textarea
			if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
				if (input.value === "") isValid = false;

				formData[input.name] = input.value;
			}
		}

		if (!isValid)
			return setNotification({
				message: "Invalid email",
				title: "Error",
				status: "ERROR",
			});

		const { error, message, status } = await sendRequest(
			"POST",
			"/newsletter",
			formData,
			"JSON"
		);

		console.log(message);
		if (error) {
			return setNotification({
				message: message,
				title: "Error",
				status: "ERROR",
			});
		}

		setNotification({
			message: "Newsletter subscribed successfully",
			status: "SUCCESS",
			title: "Success",
		});
	};

	return (
		<>
			<footer
				id="footer"
				className={`${inter.className} clearfix style-2 work-sans`}>
				<div className="themesflat-container">
					<div className="row">
						<div className="col-lg-3 col-md-12 col-12">
							<div className="widget widget-logo">
								<div className="logo-footer" id="logo-footer">
									<Link href={`/`} className={`header_link size_18-20 bold`}>
										<Image alt="" width={"40"} height={"40"} src={Icon} />
										<h1 className="size_20">Top Metro Investment</h1>
									</Link>
								</div>
								<div className={`${styles.address}`}>
									<h4 className="size_18">Headquaters</h4>
									<span className="size_14-15">
										901 Fifth Avenue Suite 1100 Seattle, WA 98164 USA
									</span>
								</div>
							</div>
						</div>
						<div className="col-lg-2 col-md-4 col-sm-5 col-5">
							<div className="widget widget-menu style-1">
								<h5 className="title-widget">My Account</h5>
								<ul>
									<li>
										<Link href="/auth/login">Sign In</Link>
									</li>
									<li>
										<Link href="/auth/register">Sign Up</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="col-lg-2 col-md-4 col-sm-7 col-7">
							<div className="widget widget-menu style-2">
								<h5 className="title-widget">Resources</h5>
								<ul>
									<li>
										<Link href="mailto: info@topmetroinvestment.com">
											Help & Support
										</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="col-lg-2 col-md-4 col-sm-5 col-5">
							<div className="widget widget-menu fl-st-3">
								<h5 className="title-widget">Company</h5>
								<ul>
									<li>
										<Link href="/contact">Contact Us</Link>
									</li>
									<li>
										<Link href="/about">About Us</Link>
									</li>
									<li>
										<Link href="/terms">Terms of Use</Link>
									</li>
									<li>
										<Link href="/policy">Privacy Policy</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="col-lg-3 col-md-6 col-sm-7 col-12">
							<div className="widget widget-subcribe">
								<h5 className="title-widget">Subscribe to Newsletter</h5>
								<div className="form-subcribe">
									<form
										onSubmit={httpSubscribeNewsletter}
										id="subscribe-form"
										acceptCharset="utf-8"
										className="form-submit">
										<input
											name="email"
											className="email"
											type="email"
											placeholder="info@yourgmail.com"
											required
										/>
										<button id="submit" name="submit" type="submit">
											{httpIsLoading ? (
												<Loader width="23" strokeColor={"white"} />
											) : (
												<i className="icon-fl-send"></i>
											)}
										</button>
									</form>
								</div>
								<div className="widget-social style-1 mg-t32">
									<ul>
										<li>
											<Link href="#">
												<i className="fab fa-twitter"></i>
											</Link>
										</li>
										<li className="style-2">
											<Link href="tel:+15864351872">
												<i className="fab fa-telegram-plane"></i>
											</Link>
										</li>
										<li className="mgr-none">
											<Link href="#">
												<i className="icon-fl-vt"></i>
											</Link>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
};

export default Footer;
