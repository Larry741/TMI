import { FaCircle, FaRegMoneyBillAlt } from "react-icons/fa";
import React, { useContext, useState } from "react";
import NotificationContext from "@/context/notification";
import useSession from "@/hooks/use-Session";
import Button from "@/components/UI/Button";
import FundingSuccessfull from "@/components/Modals/Deposit/FundingSuccessfull";
import Modal from "@/components/Modals/Modal";

import styles from "../Withdrawal/withdawals.module.scss";
import {
	BANK_DETAIL,
	BTC_ADDRESS,
	CURRENCY_SYMBOLS,
	ETH_ADDRESS,
	PAY_PAL_DETAIL,
	USDT_ADDRESS,
} from "@/utils/constants";

const IndexDeposit = () => {
	const { data } = useSession();
	const { setNotification } = useContext(NotificationContext);
	const [currency, setCurrency] = useState<"fiat" | "crypto">("fiat");
	const [showFundingSuccessfullModal, setShowSuccessfullModal] =
		useState<boolean>(false);
	const [paymentChannel, setPaymentChannel] = useState<
		"bank" | "paypal" | "BTC" | "ETH" | "USDT"
	>();
	const [paymentDetails, setPaymentDetails] = useState<any>({});

	const proceedDeposit = async (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		const formInputs = form.elements;

		const formData: any = {};
		let isValid = true;
		// Iterate through form elements
		for (let i = 0; i < formInputs.length; i++) {
			const input = formInputs[i] as HTMLInputElement;

			// Check if the element is an input or textarea
			if (
				input.tagName === "INPUT" ||
				input.tagName === "SELECT" ||
				input.tagName === "TEXTAREA"
			) {
				if (input.value === "") isValid = false;

				if (input.name === "email") continue;
				formData[input.name] = input.value;
			}
		}

		if (!isValid) {
			return setNotification({
				message: `Please fill out the form`,
				status: "ERROR",
				title: "Error",
			});
		}

		setPaymentDetails(formData);
		setShowSuccessfullModal(true);
	};

	const resetForm = () => {
		const form = document.getElementById("deposit-form") as HTMLFormElement;

		form.reset();
	};

	return (
		<>
			{showFundingSuccessfullModal && (
				<Modal>
					<FundingSuccessfull
						paymentDetails={paymentDetails}
						resetForm={resetForm}
						showModal={setShowSuccessfullModal}
					/>
				</Modal>
			)}

			<div className="col-xl-12">
				<div className="card">
					<div className="card-header">
						<h4 className="card-title">Select Payment Gateway</h4>
					</div>
					<div className="card-body" id="deposits">
						<ul className="nav nav-tabs" id="myTab" role="tablist">
							<li className="nav-item">
								<a
									className="nav-link active"
									style={{
										display: "flex",
										alignItems: "center",
										gap: ".5rem",
									}}
									data-toggle="tab"
									href="#">
									<FaRegMoneyBillAlt size={28} /> Fund Account
								</a>
							</li>
						</ul>

						<div className="tab-content">
							<div className="tab-pane fade show active" id="tab1">
								<div className="card">
									<div className={`${styles.card_body} card-body`}>
										<div className="buy-sell-widget">
											<p className="text-white size_14">
												Select your payment method, make deposit, once your
												deposit is confirmed, your trading account will be
												credited. Bitcoin deposits are usually faster to
												confirm. Should you have any issues funding your
												account, please contact payments@topmetroinvestments.com
												for assistance.
											</p>
											<form
												id="deposit-form"
												onSubmit={proceedDeposit}
												className={styles.form}>
												<div className={`${styles.form_group} form-group`}>
													<label className="mr-sm-2">
														Choose Payment Method
													</label>
													<div className="input-group mb-3">
														<select
															onChange={(
																e: React.ChangeEvent<HTMLSelectElement>
															) => {
																setCurrency(e.currentTarget.value as any);
															}}
															name="method"
															className="form-control"
															required>
															<option value="" selected disabled hidden>
																--Select Payment Method--
															</option>
															<option value="fiat">Fiat</option>
															<option value="crypto">Crypto</option>
														</select>
													</div>
												</div>

												{currency === "fiat" ? (
													<div className={`${styles.form_group} form-group`}>
														<label className="mr-sm-2">
															Choose Payment Channel
														</label>
														<div className="input-group mb-3">
															<select
																name="channel"
																id="method_changer"
																required
																onChange={(
																	e: React.ChangeEvent<HTMLSelectElement>
																) => {
																	setPaymentChannel(
																		e.currentTarget.value as any
																	);
																}}
																className="form-control">
																<option value="" selected disabled hidden>
																	--Select Payment Channel--
																</option>
																<option value="bank">Bank Deposit</option>
																<option value="paypal">PayPal</option>
															</select>
														</div>
													</div>
												) : (
													<div className={`${styles.form_group} form-group`}>
														<label className="mr-sm-2">
															Choose Payment Channel
														</label>
														<div className="input-group mb-3">
															<select
																name="channel"
																id="method_changer"
																required
																onChange={(
																	e: React.ChangeEvent<HTMLSelectElement>
																) => {
																	setPaymentChannel(
																		e.currentTarget.value as any
																	);
																}}
																className="form-control">
																<option value="" selected disabled hidden>
																	--Select Payment Channel--
																</option>
																<option value="BTC">Bitcoin</option>
																<option value="ETH">Ethereum</option>
																<option value="USDT">Tether</option>
															</select>
														</div>
													</div>
												)}

												<div className={`${styles.form_group} form-group`}>
													<label className="mr-sm-2">Amount</label>
													<div className="input-group">
														<input
															type="number"
															step="1"
															name="amount"
															required
															className="form-control"
															placeholder={`${
																currency === "fiat"
																	? `${
																			CURRENCY_SYMBOLS[data.currency as "GBP"]
																	  }10,000`
																	: "2BTC/ETH"
															}`}
														/>
													</div>
												</div>

												{paymentChannel === "BTC" ? (
													<div
														className={`${styles.form_group} form-group`}
														id="usdt">
														<label className="mr-sm-2">Make Payment to:</label>
														<div className="qrcode">
															<img
																style={{
																	maxWidth: "100%",
																	height: 200,
																	width: 200,
																}}
																alt="qrcode"
																data-size="200"
																src="https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=bitcoin:0x49F5796FB802adc2FfB537DC7E3cA4D2270b22E6"
																data-original-title="QR Code - USDT address you can scan with a mobile phone camera. Open Bitcoin Wallet, click on camera icon, point the camera at the code, and you&#39;re done"
																data-placement="bottom"
																data-toggle="tooltip"
															/>
														</div>
														<div className="input-group">
															<input
																type="text"
																className="form-control"
																value={BTC_ADDRESS}
																id="input-copy1"
																readOnly
															/>

															<div className="input-group-append">
																<button
																	className="btn btn-primary size_12"
																	type="button"
																	style={{
																		color: "white",
																		display: "flex",
																		alignItems: "center",
																		height: "100%",
																	}}
																	onClick={() => {
																		const input = document.getElementById(
																			"input-copy1"
																		) as HTMLInputElement;
																		navigator.clipboard.writeText(input.value);
																		setNotification({
																			message: `Text copied to your clipboard`,
																			status: "SUCCESS",
																			title: "Success",
																		});
																	}}
																	data-clipboard-action="copy"
																	data-clipboard-target="#input-copy1">
																	Copy Address
																</button>
															</div>
														</div>
													</div>
												) : paymentChannel === "ETH" ? (
													<div
														className={`${styles.form_group} form-group`}
														id="usdt">
														<label className="mr-sm-2">Make Payment to:</label>
														<div className="qrcode">
															<img
																style={{
																	maxWidth: "100%",
																	height: 200,
																	width: 200,
																}}
																alt="qrcode"
																data-size="200"
																src="https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=bitcoin:0x49F5796FB802adc2FfB537DC7E3cA4D2270b22E6"
																data-original-title="QR Code - USDT address you can scan with a mobile phone camera. Open Bitcoin Wallet, click on camera icon, point the camera at the code, and you&#39;re done"
																data-placement="bottom"
																data-toggle="tooltip"
															/>
														</div>
														<div className="input-group">
															<input
																type="text"
																className="form-control"
																value={ETH_ADDRESS}
																id="input-copy1"
																readOnly
															/>

															<div className="input-group-append">
																<button
																	className="btn btn-primary size_12"
																	type="button"
																	style={{
																		color: "white",
																		display: "flex",
																		alignItems: "center",
																		height: "100%",
																	}}
																	onClick={() => {
																		const input = document.getElementById(
																			"input-copy1"
																		) as HTMLInputElement;
																		navigator.clipboard.writeText(input.value);
																		setNotification({
																			message: `Text copied to your clipboard`,
																			status: "SUCCESS",
																			title: "Success",
																		});
																	}}
																	data-clipboard-action="copy"
																	data-clipboard-target="#input-copy1">
																	Copy Address
																</button>
															</div>
														</div>
													</div>
												) : paymentChannel === "USDT" ? (
													<div
														className={`${styles.form_group} form-group`}
														id="usdt">
														<label className="mr-sm-2">Make Payment to:</label>
														<div className="qrcode">
															<img
																style={{
																	maxWidth: "100%",
																	height: 200,
																	width: 200,
																}}
																alt="qrcode"
																data-size="200"
																src="https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=bitcoin:0x49F5796FB802adc2FfB537DC7E3cA4D2270b22E6"
																data-original-title="QR Code - USDT address you can scan with a mobile phone camera. Open Bitcoin Wallet, click on camera icon, point the camera at the code, and you&#39;re done"
																data-placement="bottom"
																data-toggle="tooltip"
															/>
														</div>
														<div className="input-group">
															<input
																type="text"
																className="form-control"
																value={USDT_ADDRESS}
																id="input-copy1"
																readOnly
															/>

															<div className="input-group-append">
																<button
																	className="btn btn-primary size_12"
																	type="button"
																	style={{
																		color: "white",
																		display: "flex",
																		alignItems: "center",
																		height: "100%",
																	}}
																	onClick={() => {
																		const input = document.getElementById(
																			"input-copy1"
																		) as HTMLInputElement;
																		navigator.clipboard.writeText(input.value);
																		setNotification({
																			message: `Text copied to your clipboard`,
																			status: "SUCCESS",
																			title: "Success",
																		});
																	}}
																	data-clipboard-action="copy"
																	data-clipboard-target="#input-copy1">
																	Copy Address
																</button>
															</div>
														</div>
													</div>
												) : paymentChannel === "bank" ? (
													<div
														className={`${styles.form_group} form-group`}
														id="bank">
														<label className="mr-sm-2">Make Payment to:</label>
														<div className="alert alert-primary">
															<h4>
																<b className="text-primary text-bold">
																	Company Payment Details
																</b>
															</h4>
															<p>{BANK_DETAIL}</p>
														</div>
													</div>
												) : paymentChannel === "paypal" ? (
													<>
														<div
															className={`${styles.form_group} form-group`}
															id="bank">
															<label className="mr-sm-2">
																Make Payment to:
															</label>
															<div className="alert alert-primary">
																<h4>
																	<b className="text-primary text-bold">
																		Company Payment Details
																	</b>
																</h4>
																<p>{PAY_PAL_DETAIL}</p>
															</div>
														</div>
													</>
												) : null}

												<div className={`${styles.form_group} form-group`}>
													<label className="mr-sm-2">Payment Details</label>
													<div className="input-group">
														<textarea
															placeholder="Enter Additional Comment"
															name="detail"
															rows={4}
															className={`${styles.textarea} form-control`}
															required></textarea>
													</div>
												</div>

												<div
													style={{ marginTop: "2.5rem" }}
													className="text-right">
													<Button showLoader={false} type="submit">
														Complete
													</Button>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="col-xl-12">
				<div className="card">
					<div className="card-header">
						<h4 className="card-title size_16 lighter">
							Important Information
						</h4>
					</div>

					<div className="card-body">
						<div className="important-info">
							<ul className={styles.info_list}>
								{paymentChannel === "BTC" || paymentChannel === "ETH" ? (
									<li className="size_15">
										<FaCircle size={10} />
										Crypto Deposits will be credited to your account balance
										after 2 network confirmations.
									</li>
								) : (
									<li className="size_15">
										<FaCircle size={10} />
										Your Account will be automatically topped-up on payment
										confirmation
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default IndexDeposit;
