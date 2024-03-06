"use client";

import Link from "next/link";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import { Loader } from "@/components/UI/loader";
import useUser from "@/hooks/use-user";
import { useContext, useState } from "react";
import RegisterMailValidation from "@/components/Page/Auth/RegisterMailValidation";
import useHttp from "@/hooks/use-Http";
import { useRouter } from "next/navigation";
import NotificationContext from "@/context/notification";
import useSession from "@/hooks/use-Session";

import styles from "@/styles/app/auth.module.css";

const LoginPage = () => {
	const { setNotification } = useContext(NotificationContext);
	const { data } = useSession();
	const [progress, setProgress] = useState<number>(1);
	const { signInUser, loading } = useUser();
	const { httpIsLoading, sendRequest } = useHttp();
	const [emailOtp, setEmailOtp] = useState<string>("");
	const [emailOtpIsInvalid, setEmailOtpIsInvalid] = useState<boolean>(false);
	const [restartTimer, setRestartTimer] = useState<boolean>(false);
	const [token, setToken] = useState<string>();
	const [remUser, setRemUser] = useState(true);
	const router = useRouter();

	const httpLoginUser = async (e: React.FormEvent) => {
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
				message: "Invalid data",
				status: "ERROR",
				title: "Error",
			});

		const res = await signInUser(formData);

		if (res) {
			setToken(res.token);
			setProgress(2);
		}
	};

	const httpValidateOtp = async (event: React.FormEvent) => {
		event.preventDefault();

		let { message, status, error } = await sendRequest(
			"POST",
			"auth/register/verify-otp",
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

		router.push(`/dashboard?token=${data.token}`);
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
								<h1 className="heading text-center">Login</h1>
							</div>
							<div className="breadcrumbs style2">
								<ul>
									<li>
										<Link href="/">Home</Link>
									</li>
									<li>Login</li>
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
								<h2 className="tf-title-heading ct style-1">Login Account</h2>

								<div className="flat-form box-login-email">
									<div className="box-title-login">
										<h5>Login Account</h5>
									</div>

									<div className="form-inner">
										<form onSubmit={httpLoginUser} id="contactform">
											<input
												id="email"
												name="email"
												tabIndex={1}
												aria-required="true"
												required
												type="email"
												placeholder="Email"
											/>
											<input
												id="password"
												name="password"
												tabIndex={2}
												aria-required="true"
												type="password"
												placeholder="Password"
												required
											/>
											<div className="row-form style-1">
												<label>
													Remember me
													<input
														type="checkbox"
														// value={remUser}
														defaultChecked={remUser}
														onChange={() =>
															setRemUser((prevState: boolean) => !prevState)
														}
													/>
													<span className="btn-checkbox"></span>
												</label>
												<Link href="/reset-password" className="forgot-pass">
													Forgot Password ?
												</Link>
											</div>

											<button className="submit">
												{loading ? <Loader width="23" /> : "Login"}
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
												resendUrl={"auth/register/resend-otp"}
												emailOtp={emailOtp}
												emailOtpIsInvalid={emailOtpIsInvalid}
												restartTimer={restartTimer}
												sendRequest={sendRequest}
												setEmailOtp={setEmailOtp}
												setEmailOtpIsInvalid={setEmailOtpIsInvalid}
												setRestartTimer={setRestartTimer}
											/>
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
			)}

			<Footer />
		</>
	);
};

export default LoginPage;
