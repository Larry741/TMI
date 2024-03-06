"use client";

import checkUserAuthentication from "@/components/Hoc/UserProtectedRoute";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import InvestmentClosureSuccessfull from "@/components/Modals/Investment/InvestmentClosureSuccessful";
import InvestmentSuccessfull from "@/components/Modals/Investment/InvestmentSuccessfull";
import Modal from "@/components/Modals/Modal";
import InvestmentHistory from "@/components/Page/Investment/History";
import Button from "@/components/UI/Button";
import NotificationContext from "@/context/notification";
import useHttp from "@/hooks/use-Http";
import useSession from "@/hooks/use-Session";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useState } from "react";
import { BsBullseye, BsFillSuitHeartFill } from "react-icons/bs";
import { FaBitcoin, FaCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { userSliceActions } from "@/store/userSlice";
import { fetchUserAction } from "@/store/userSlice";
import { INVESTMENT_TYPES } from "@/utils/constants";

import styles from "@/styles/dashboard/profile.module.scss";

const InvestmentsPage = () => {
	const router = useRouter();
	const [tab, setTab] = useState<string>("plan");
	const { data: sessionData } = useSession();
	const { sendRequest, httpIsLoading } = useHttp();
	const dispatch = useDispatch();
	const { setNotification } = useContext(NotificationContext);
	const [type, setType] = useState<string>("");
	const [showInvestSuccessfull, setShowInvestSuccessfull] =
		useState<boolean>(false);
	const [showInvestClosureSuccessfull, setShowInvestClosureSuccessfull] =
		useState<boolean>(false);

	const httpSubscribeInvestment = async (
		type: string,
		e: React.MouseEvent<Element, MouseEvent>
	) => {
		setType(type);

		if (
			INVESTMENT_TYPES[type as "gold"].amount >
			sessionData.balance.fiat[sessionData.currency]
		) {
			return setNotification({
				message: `Insufficient funds in your ${sessionData.currency} account`,
				status: "ERROR",
				title: "Error",
			});
		}

		const { error, message, status, data } = await sendRequest(
			"POST",
			"investment",
			{
				type,
			},
			"JSON"
		);

		if (error) {
			return setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
		}

		dispatch(userSliceActions.updateUserDetails({ activeInvestment: data }));
		setShowInvestSuccessfull(true);
	};

	const httpCloseInvestment = async (
		type: string,
		e: React.MouseEvent<Element, MouseEvent>
	) => {
		setType(type);

		if (
			INVESTMENT_TYPES[type as "gold"].amount >
			sessionData.balance.fiat[sessionData.currency]
		) {
			return setNotification({
				message: `Insufficient funds in your ${sessionData.currency} account`,
				status: "ERROR",
				title: "Error",
			});
		}

		const { error, message, status, data } = await sendRequest(
			"PUT",
			"investment/close",
			{
				type,
			},
			"JSON"
		);

		if (error) {
			return setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
		}

		// @ts-ignore
		dispatch(fetchUserAction(""));
		setShowInvestClosureSuccessfull(true);
	};

	return (
		<DashboardLayout large>
			{showInvestSuccessfull && (
				<Modal>
					<InvestmentSuccessfull
						investType={type}
						showModal={setShowInvestSuccessfull}
					/>
				</Modal>
			)}

			{showInvestClosureSuccessfull && (
				<Modal>
					<InvestmentClosureSuccessfull
						investType={type}
						showModal={setShowInvestClosureSuccessfull}
					/>
				</Modal>
			)}

			<div className="page-title dashboard">
				<div className="container">
					<div className={`row ${styles.row}`}>
						<div className="">
							<div className="page-title-content">
								<p className="size_20">
									<div style={{ display: "inline-block" }} className="size_20">
										Welcome
									</div>
									<span className={`${styles.user_name} size_20 bold`}>
										{" "}
										{sessionData.firstName}
									</span>
								</p>
							</div>
						</div>

						<div>
							<ul className="text-right breadcrumbs list-unstyle">
								<li>
									<a href="#">User</a>{" "}
								</li>{" "}
								<span
									style={{ margin: "0 .5rem", transform: "translateY(.2rem)" }}>
									/
								</span>{" "}
								<li className="active">
									<a
										onClick={() => {
											router.refresh();
										}}
										href="#">
										Investment
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className="content-body">
				<div className="container">
					<div className="row">
						<div style={{ width: "100%" }} className="card sub-menu">
							<div className="card-body active">
								<ul className={`d-flex show ${styles.tab_list}`}>
									<li
										onClick={() => setTab("plan")}
										className={`${styles.tab} ${
											tab === "plan" ? styles.active_tab : ""
										} nav-item active size_15`}>
										<BsBullseye size={24} />
										<span>Investment Plans</span>
									</li>
									<li
										onClick={() => setTab("earnings")}
										className={`${styles.tab} ${
											tab === "earnings" ? styles.active_tab : ""
										} nav-item active size_15`}>
										<BsFillSuitHeartFill size={24} />
										<span>Earnings</span>
									</li>
								</ul>
							</div>
						</div>

						{tab === "plan" ? (
							<>
								<div
									style={{ width: "100%" }}
									className="price-grid"
									data-scroll-index="1">
									<div className="container">
										<div className={styles.investments_card_row}>
											<div
												className={`${styles.investments_card} ${styles.card_1} cards_bg_color card`}>
												<div className={styles["card-header"]}>
													<div className={`${styles.media}`}>
														<FaBitcoin size={36} />
														<div className="size_16-18">Silver</div>
													</div>
													<p className={`${styles.med_text} mb-0`}> 24h</p>
												</div>

												<div className={styles.write_up}>
													{" "}
													<h3 className={`size_20 bold ${styles.dollar_text}`}>
														USD $1,000.00
													</h3>
													<span className="text-success size_14">
														+5 Trades per Day
													</span>
													<span className="text-success size_14">
														+Instant Trading
													</span>
													<span className="text-success size_14">
														Leverage upto 2X
													</span>
													<span className="text-success size_14">
														+Demo Trading
													</span>
												</div>

												<div className={styles.btn_cont}>
													{sessionData?.activeInvestment?.level ===
													INVESTMENT_TYPES["silver"].level ? (
														<Button
															className={styles.close_btn_investment}
															withBg={false}
															showLoader={httpIsLoading && type === "silver"}
															onClick={httpCloseInvestment.bind(this, "silver")}
															type="button">
															Close
														</Button>
													) : (
														<Button
															disabled={
																// @ts-ignore
																sessionData?.activeInvestment?.level >
																INVESTMENT_TYPES["silver"].level
															}
															showLoader={httpIsLoading && type === "silver"}
															onClick={httpSubscribeInvestment.bind(
																this,
																"silver"
															)}
															type="button">
															{!sessionData?.activeInvestment?.level
																? "Subscribe"
																: sessionData?.activeInvestment?.level >=
																  INVESTMENT_TYPES["silver"].level
																? "Subscribe"
																: "Upgrade"}
														</Button>
													)}
												</div>
											</div>

											<div
												className={`${styles.investments_card} ${styles.card_2} cards_bg_color card`}>
												<div className={styles["card-header"]}>
													<div className={`${styles.media}`}>
														<FaBitcoin size={36} />
														<div className="size_16-18">Gold</div>
													</div>
													<p className={`${styles.med_text} mb-0`}> 24h</p>
												</div>
												<div className={styles.write_up}>
													{" "}
													<h3 className={`size_20 bold ${styles.dollar_text}`}>
														USD $5,000.00
													</h3>
													<span className="text-success size_14">
														+ 15 Trades per Day
													</span>
													<span className="text-success size_14">
														+ Instant Trading
													</span>
													<span className="text-success size_14">
														Leverage upto 2X and 5X
													</span>
													<span className="text-success size_14">
														+ Demo Trading
													</span>
												</div>{" "}
												<div className={styles.btn_cont}>
													{sessionData?.activeInvestment?.level ===
													INVESTMENT_TYPES["gold"].level ? (
														<Button
															withBg={false}
															className={styles.close_btn_investment}
															showLoader={httpIsLoading && type === "gold"}
															onClick={httpCloseInvestment.bind(this, "gold")}
															type="button">
															Close
														</Button>
													) : (
														<Button
															disabled={
																// @ts-ignore
																sessionData?.activeInvestment?.level >
																INVESTMENT_TYPES["gold"].level
															}
															showLoader={httpIsLoading && type === "gold"}
															onClick={httpSubscribeInvestment.bind(
																this,
																"gold"
															)}
															type="button">
															{!sessionData?.activeInvestment?.level
																? "Subscribe"
																: sessionData?.activeInvestment?.level >=
																  INVESTMENT_TYPES["gold"].level
																? "Subscribe"
																: "Upgrade"}
														</Button>
													)}
												</div>
											</div>

											<div
												className={`${styles.investments_card} ${styles.card_3} cards_bg_color card`}>
												<div className={styles["card-header"]}>
													<div className={`${styles.media}`}>
														<FaBitcoin size={36} />
														<div className="size_16-18">Diamond</div>
													</div>
													<p className={`${styles.med_text} mb-0`}> 24h</p>
												</div>
												<div className={styles.write_up}>
													{" "}
													<h3 className={`size_20 bold ${styles.dollar_text}`}>
														USD $10,000.00
													</h3>
													<span className="text-success size_14">
														+ 35 Trades per Day
													</span>
													<span className="text-success size_14">
														+ Instant Trading
													</span>
													<span className="text-success size_14">
														Leverage upto 2X, 5X and 10X
													</span>
													<span className="text-success size_14">
														+ Demo Trading
													</span>
												</div>{" "}
												<div className={styles.btn_cont}>
													{sessionData?.activeInvestment?.level ===
													INVESTMENT_TYPES["diamond"].level ? (
														<Button
															withBg={false}
															className={styles.close_btn_investment}
															showLoader={httpIsLoading && type === "diamond"}
															onClick={httpCloseInvestment.bind(
																this,
																"diamond"
															)}
															type="button">
															Close
														</Button>
													) : (
														<Button
															disabled={
																// @ts-ignore
																sessionData?.activeInvestment?.level >
																INVESTMENT_TYPES["diamond"].level
															}
															showLoader={httpIsLoading && type === "diamond"}
															onClick={httpSubscribeInvestment.bind(
																this,
																"diamond"
															)}
															type="button">
															{!sessionData?.activeInvestment?.level
																? "Subscribe"
																: sessionData?.activeInvestment?.level >=
																  INVESTMENT_TYPES["diamond"].level
																? "Subscribe"
																: "Upgrade"}
														</Button>
													)}
												</div>
											</div>

											<div
												className={`${styles.investments_card} ${styles.card_4} cards_bg_color card`}>
												<div className={styles["card-header"]}>
													<div className={`${styles.media}`}>
														<FaBitcoin size={36} />
														<div className="size_16-18">Platinum</div>
													</div>
													<p className={`${styles.med_text} mb-0`}> 24h</p>
												</div>
												<div className={styles.write_up}>
													{" "}
													<h3 className={`size_20 bold ${styles.dollar_text}`}>
														USD $50,000.00
													</h3>
													<span className="text-success size_14">
														+ Unlimited Trades per Day
													</span>
													<span className="text-success size_14">
														+ Instant Trading
													</span>
													<span className="text-success size_14">
														Leverage upto 2X, 5X, 10X, and 20X
													</span>
													<span className="text-success size_14">
														+ Demo Trading
													</span>
												</div>{" "}
												<div className={styles.btn_cont}>
													{sessionData?.activeInvestment?.level ===
													INVESTMENT_TYPES["platinum"].level ? (
														<Button
															withBg={false}
															className={styles.close_btn_investment}
															showLoader={httpIsLoading && type === "platinum"}
															onClick={httpCloseInvestment.bind(
																this,
																"platinum"
															)}
															type="button">
															Close
														</Button>
													) : (
														<Button
															disabled={
																// @ts-ignore
																sessionData?.activeInvestment?.level >
																INVESTMENT_TYPES["platinum"].level
															}
															showLoader={httpIsLoading && type === "platinum"}
															onClick={httpSubscribeInvestment.bind(
																this,
																"platinum"
															)}
															type="button">
															{!sessionData?.activeInvestment?.level
																? "Subscribe"
																: sessionData?.activeInvestment?.level >=
																  INVESTMENT_TYPES["platinum"].level
																? "Subscribe"
																: "Upgrade"}
														</Button>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="col-xl-12">
									<div className="card">
										<div className="card-header">
											<h4 className="card-title size_16">
												Important Information
											</h4>
										</div>

										<div className="card-body">
											<div className="important-info">
												<ul className={styles.info_list}>
													<li className="size_15">
														<FaCircle size={10} />
														Please select an Investment plan.
													</li>
													<li className="size_15">
														<FaCircle size={10} />
														You can&apos;t choose a Investment plan lower than
														your current plan.
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</>
						) : (
							<InvestmentHistory />
						)}
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default checkUserAuthentication(InvestmentsPage);
