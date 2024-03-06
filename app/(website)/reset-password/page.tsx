"use client";

import Link from "next/link";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import RegisterMailValidation from "@/components/Page/Auth/RegisterMailValidation";
import { Loader } from "@/components/UI/loader";
import useHttp from "@/hooks/use-Http";
import useUser from "@/hooks/use-user";
import { useContext, useRef, useState } from "react";
import { TOKEN_KEY } from "@/store/userSlice";
import NotificationContext from "@/context/notification";

import styles from "@/styles/app/auth.module.css";

const ForgotPasswordPage = () => {
	const { setNotification } = useContext(NotificationContext);
	const { loading, passwordRecovery, changePassword } = useUser();
	const [progress, setProgress] = useState(1);
	const [emailOtp, setEmailOtp] = useState<string>("");
	const [emailOtpIsInvalid, setEmailOtpIsInvalid] = useState<boolean>(false);
	const [restartTimer, setRestartTimer] = useState<boolean>(false);
	const { httpIsLoading, sendRequest } = useHttp();

	const httpPasswordRecovery = async (e: React.FormEvent) => {
		e.preventDefault();
		const target = e.currentTarget as HTMLFormElement;

		const res = await passwordRecovery(target);
		if (res === false) return;

		sessionStorage.setItem(TOKEN_KEY, res.token);
		setProgress((prevState: number) => ++prevState);
	};

	const httpValidateOtp = async (event: React.FormEvent) => {
		event.preventDefault();

		let { message, status, error } = await sendRequest(
			"POST",
			"auth/forgot-password/verify-otp",
			{ otp: emailOtp },
			"JSON"
		);

		if (error) {
			if (status === 403) {
				return setEmailOtpIsInvalid(true), setEmailOtp("");
			}
			return setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
		}

		setProgress((prevState: number) => ++prevState);
	};

	return (
		<>
			<Header />

			<section className={`${styles.section} flat-title-page inner`}>
				<div className="overlay"></div>
				<div className="themesflat-container">
					<div className="row">
						<div className="col-md-12">
							<div className="page-title-heading mg-bt-12">
								<h1 className="heading text-center">Password Reset</h1>
							</div>
							<div className="breadcrumbs style2">
								<ul>
									<li>
										<Link href="/">Home</Link>
									</li>
									<li>Password Reset</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			{progress === 1 ? (
				<section className="tf-login tf-section">
					<div className="themesflat-container">
						<div className="row">
							<div className="col-12">
								<h2 className="tf-title-heading ct style-1">Password Reset</h2>

								<div className="flat-form box-login-email">
									<div className="box-title-login">
										<h5>Reset Password</h5>
									</div>

									<div className="form-inner">
										<form onSubmit={httpPasswordRecovery} id="contactform">
											<input
												id="name"
												name="email"
												tabIndex={1}
												aria-required="true"
												required
												type="email"
												placeholder="Your Email Address"
											/>

											<div className="row-form style-1">
												{/* <!-- <label>Remember me
                                                <input type="checkbox" checked>
                                                <span className="btn-checkbox"></span>
                                            </label> --> */}
												<Link href="/auth/login" className="forgot-pass">
													Back to Login
												</Link>
											</div>
											<button className="submit">
												{loading ? <Loader width="23" /> : "Reset Password"}
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			) : progress === 2 ? (
				<section className="tf-login tf-section">
					<div className="themesflat-container">
						<div className="row">
							<div className="col-12">
								<h2 className="tf-title-heading ct style-1">
									Email Verification
								</h2>

								<div className="flat-form box-login-email">
									<div className="box-title-login">
										<h5>Verify Email</h5>
									</div>

									<div className="form-inner">
										<form onSubmit={httpValidateOtp} id="contactform">
											<RegisterMailValidation
												resendUrl={"auth/forgot-password/resend-otp"}
												emailOtp={emailOtp}
												emailOtpIsInvalid={emailOtpIsInvalid}
												restartTimer={restartTimer}
												sendRequest={sendRequest}
												setEmailOtp={setEmailOtp}
												setEmailOtpIsInvalid={setEmailOtpIsInvalid}
												setRestartTimer={setRestartTimer}
											/>

											<div className="row-form style-1">
												{/* <!-- <label>Remember me
                                                <input type="checkbox" checked>
                                                <span className="btn-checkbox"></span>
                                            </label> --> */}
												<Link href="/auth/login" className="forgot-pass">
													Back to Login
												</Link>
											</div>

											<button className="submit">
												{httpIsLoading ? <Loader width="23" /> : "Verify"}
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			) : (
				<section className="tf-login tf-section">
					<div className="themesflat-container">
						<div className="row">
							<div className="col-12">
								<h2 className="tf-title-heading ct style-1">Password Reset</h2>

								<div className="flat-form box-login-email">
									<div className="box-title-login">
										<h5>Reset Password</h5>
									</div>

									<div className="form-inner">
										<form onSubmit={changePassword} id="contactform">
											<input
												id="pass"
												name="password"
												tabIndex={3}
												aria-required="true"
												className=""
												type="password"
												placeholder="Set Your Password"
												required
											/>

											<input
												id="confirm_password"
												name="confirmPassword"
												tabIndex={3}
												aria-required="true"
												className=""
												type="password"
												placeholder="Confirm Password"
												required
											/>

											<div className="row-form style-1">
												{/* <!-- <label>Remember me
                                                <input type="checkbox" checked>
                                                <span className="btn-checkbox"></span>
                                            </label> --> */}
												<Link href="/auth/login" className="forgot-pass">
													Back to Login
												</Link>
											</div>
											<button className="submit">
												{loading ? <Loader width="23" /> : "Reset Password"}
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}

			<Footer />
		</>
	);
};

export default ForgotPasswordPage;
