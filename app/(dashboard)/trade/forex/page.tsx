"use client";

import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import useSession from "@/hooks/use-Session";
import checkUserAuthentication from "@/components/Hoc/UserProtectedRoute";
import TickerTape from "@/components/TradingView/TickerTape";
import AdvancedRealTimeChart from "@/components/TradingView/AdvancedRealTimeChart";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "@/components/UI/Button";
import NotificationContext from "@/context/notification";
import useHttp from "@/hooks/use-Http";
import { CURRENCY_SYMBOLS } from "@/utils/constants";
import useFetcher from "@/hooks/use-Fetcher";
import DropdownList from "@/components/UI/DropdownList";
import useDropdown from "@/hooks/use-Dropdown";
import { Loader } from "@/components/UI/loader";
import TableWrapper from "@/components/Wrappers/TableWrapper";
import { fetchUserAction } from "@/store/userSlice";
import FundingIndex from "@/components/Modals/Deposit/Index";
import Modal from "@/components/Modals/Modal";

import styles from "@/styles/dashboard/profile.module.scss";

const ForexPage = () => {
	const { data } = useSession();
	const { httpIsLoading, sendRequest } = useHttp();
	const dispatch = useDispatch();
	const [height, setHeight] = useState<number>(600);
	const { setNotification } = useContext(NotificationContext);
	const [pair, setPair] = useState<string>("FX:USDCAD");
	const [amount, setAmount] = useState<string>("");
	const [tradeStatus, setTradeStatus] = useState<"open" | "closed" | "pending">(
		"open"
	);
	const [showFundWalletModal, setShowFundWalletModal] =
		useState<boolean>(false);
	const [loadingTrade, setLoadingTrade] = useState<string>("");
	const { style, dropdownId, setDropdownId, showDropdown } =
		useDropdown("content_container");
	const [showNotVerified, setShowNotVerified] = useState<boolean>(
		!data.isKYCVerified && data.hasDeposited
	);

	const {
		data: fxTrades,
		error,
		isLoading,
		revaidate,
	} = useFetcher(`trade/forex?status=${tradeStatus}`);

	useEffect(() => {
		const resizeHandler = () => {
			if (document.documentElement.clientWidth < 974) {
				setHeight(460);
			} else {
				const parentEl = document.getElementById("trade_col");
				setHeight(parentEl?.clientHeight!);
			}
		};

		resizeHandler();
		window.addEventListener("resize", resizeHandler);
		return () => {
			window.removeEventListener("resize", resizeHandler);
		};
	}, []);

	const httpSubmitBuyTrade = async (e: React.MouseEvent<any>) => {
		e.preventDefault();

		const pairArr = pair.split(":");
		const baseCurr = pairArr[1].slice(0, 3);
		const quoteCurr = pairArr[1].slice(3, 6);
		const userCurr = data.currency;

		if (+amount > data.balance.fiat[userCurr]) {
			return setShowFundWalletModal(true);
		}

		if (showNotVerified) {
			return setNotification({
				message: `Please visit your dashboard and verify you acccount`,
				status: "ERROR",
				title: "Error",
			});
		}

		const form = e.currentTarget.closest("form") as HTMLFormElement;
		const formInputs = form.elements;

		const formData: any = {};
		let isValid = true;
		// Iterate through form elements
		for (let i = 0; i < formInputs.length; i++) {
			const input = formInputs[i] as HTMLInputElement;

			// Check if the element is an input or textarea
			if (input.tagName === "INPUT" || input.tagName === "SELECT") {
				if (input.value === "") {
					isValid = false;
				}

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

		try {
			const res = await fetch(
				`https://v6.exchangerate-api.com/v6/9eee23490d7ea87ee1f8cb2b/latest/${baseCurr}`
			);
			const response = await res.json();
			const { conversion_rates } = response;

			if (!res.ok) {
				throw new Error(response.error);
			}

			const basePositionAmt = +amount / conversion_rates[userCurr];

			formData.baseCurrency = baseCurr;
			formData.action = "buy";
			formData.basePositionAmt = basePositionAmt;
			formData.entryExRate = conversion_rates[quoteCurr];
			formData.quoteCurrency = quoteCurr;

			const { error, message, status, data } = await sendRequest(
				"POST",
				"trade/forex",
				formData,
				"JSON"
			);

			if (error) {
				return setNotification({
					message: `${message}`,
					status: "ERROR",
					title: "Error",
				});
			}

			setNotification({
				message: `${message}`,
				status: "SUCCESS",
				title: "Success",
			});

			revaidate();

			form.reset();
			// @ts-ignore
			dispatch(fetchUserAction(""));
		} catch (err: any) {
			return setNotification({
				message: `Error placing trade. Please try again`,
				status: "ERROR",
				title: "Error",
			});
		}
	};

	const httpSubmitSellTrade = async (e: React.MouseEvent<any>) => {
		e.preventDefault();

		const pairArr = pair.split(":");
		const baseCurr = pairArr[1].slice(3, 6);
		const quoteCurr = pairArr[1].slice(0, 3);
		const userCurr = data.currency;

		if (+amount > data.balance.fiat[userCurr]) {
			return setShowFundWalletModal(true);
		}

		if (showNotVerified) {
			return setNotification({
				message: `Please visit your dashboard and verify you acccount`,
				status: "ERROR",
				title: "Error",
			});
		}

		const form = e.currentTarget.closest("form") as HTMLFormElement;
		const formInputs = form.elements;

		const formData: any = {};
		let isValid = true;
		// Iterate through form elements
		for (let i = 0; i < formInputs.length; i++) {
			const input = formInputs[i] as HTMLInputElement;

			// Check if the element is an input or textarea
			if (input.tagName === "INPUT" || input.tagName === "SELECT") {
				if (input.value === "") {
					isValid = false;
				}

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

		try {
			const res = await fetch(
				`https://v6.exchangerate-api.com/v6/9eee23490d7ea87ee1f8cb2b/latest/${baseCurr}`
			);
			const response = await res.json();
			const { conversion_rates } = response;

			if (!res.ok) {
				throw new Error(response.error);
			}

			const basePositionAmt = +amount / conversion_rates[userCurr];

			formData.baseCurrency = baseCurr;
			formData.action = "sell";
			formData.basePositionAmt = basePositionAmt;
			formData.entryExRate = conversion_rates[quoteCurr];
			formData.quoteCurrency = quoteCurr;

			const { error, message } = await sendRequest(
				"POST",
				"trade/forex",
				formData,
				"JSON"
			);

			if (error) {
				return setNotification({
					message: `${message}`,
					status: "ERROR",
					title: "Error",
				});
			}

			setNotification({
				message: `${message}`,
				status: "SUCCESS",
				title: "Success",
			});

			revaidate();

			form.reset();
			// @ts-ignore
			dispatch(fetchUserAction(""));
		} catch (err: any) {
			return setNotification({
				message: `Error placing trade. Please try again`,
				status: "ERROR",
				title: "Error",
			});
		}
	};

	const httpCloseTrade = useCallback(
		async (tradeId: string) => {
			setLoadingTrade(tradeId);

			const { error, message, status } = await sendRequest(
				`PUT`,
				`/trade/forex/close`,
				{ tradeId },
				"JSON"
			);

			if (error) {
				setLoadingTrade("");
				return setNotification({
					message: `${message}`,
					status: "ERROR",
					title: "Error",
				});
			}

			setLoadingTrade("");
			setNotification({
				message: `${message}`,
				status: "SUCCESS",
				title: "Success",
			});
			revaidate();
			// @ts-ignore
			dispatch(fetchUserAction(""));
		},
		[revaidate, sendRequest, setNotification, dispatch]
	);

	const memoizedTH = useMemo<JSX.Element>(() => {
		return (
			<tr className="size_14">
				<th>Symbol</th>
				<th>Amount</th>
				<th>Leverage</th>
				<th>Ask Price(Entry)</th>
				{tradeStatus === "closed" ? <th>Bid Price(Exit)</th> : <></>}
				<th>Date</th>
				<th>Order</th>
				{tradeStatus === "open" ? <th>Actions</th> : ""}
			</tr>
		);
	}, [tradeStatus]);

	const memoizedList = useMemo<JSX.Element>(() => {
		return (
			<>
				{fxTrades?.trades!.map((trade: any, idx: number) => {
					return (
						<tr className="size_14" key={idx}>
							<td>{trade.pair.slice(3)}</td>
							<td>
								{CURRENCY_SYMBOLS[trade.tradeCurrency as "USD"]}
								{Number(trade.userTradeAmt).toLocaleString()}
							</td>
							<td>{trade.leverage}</td>
							<td>{trade.entryExRate}</td>
							{tradeStatus === "closed" ? <td>{trade.exitExRate}</td> : <></>}
							<td>{format(new Date(trade.createdAt), "dd MMM yyyy")}</td>
							<td
								style={{
									textTransform: "capitalize",
									color: trade.action === "sell" ? "red" : "green",
								}}>
								{trade.action}
							</td>
							{tradeStatus === "open" ? (
								<td id={`${trade._id}`}>
									<div className={styles.dropdown}>
										<button
											onClick={showDropdown.bind(this, trade._id)}
											className={`${styles.action_investor} ${
												dropdownId === trade._id ? styles.active_investor : null
											}`}>
											<BsThreeDotsVertical size={24} />
										</button>

										{loadingTrade && loadingTrade === trade._id ? (
											<div style={{ width: "max-content" }}>
												<Loader
													strokeColor="white"
													width="20"
													strokeWidth="3"
												/>
											</div>
										) : null}

										{dropdownId === trade._id && (
											<DropdownList style={style}>
												<li>
													<button
														style={{ color: "inherit" }}
														onClick={async () => {
															httpCloseTrade(trade._id);
															setDropdownId(null);
														}}
														className={`size_15`}>
														Close
													</button>
												</li>
											</DropdownList>
										)}
									</div>
								</td>
							) : (
								<></>
							)}
						</tr>
					);
				})}
			</>
		);
	}, [
		dropdownId,
		fxTrades?.trades,
		setDropdownId,
		showDropdown,
		style,
		tradeStatus,
		loadingTrade,
		httpCloseTrade,
	]);

	return (
		<DashboardLayout large>
			{showFundWalletModal && (
				<Modal>
					<FundingIndex showModal={setShowFundWalletModal} />
				</Modal>
			)}

			<TickerTape
				colorTheme="dark"
				symbols={"forex"}
				containerId={styles["ticker-tap-tv"]}
			/>
			<div className="content-body">
				<div className="container-fluid">
					{/* {showNotVerified && (
            <div
              className={`${styles.important_container} alert alert-danger m-b-15`}>
              <h4>
                <b className="text-primary size_18">Important</b>
              </h4>
              <p style={{ fontSize: "14px" }}>
                Hello{" "}
                <b
                  style={{ textTransform: "capitalize" }}
                  className="text-primary">
                  {data.firstName}
                </b>
                , Your Account has not been verified. Please Visit Your Verify
                section of your Dashboard to Verify Your Account. Unverified
                Accounts cannot place Trades.
              </p>
            </div>
          )} */}

					<div id={"trade_col"} className={`${styles.trade_col} row col-lg-12`}>
						<AdvancedRealTimeChart height={height} theme="dark" symbol={pair} />

						<div id={"trade_col_col"} className={styles.trade_col_col}>
							<div className="card">
								<div className={`${styles.trade_col_col_card} card-header`}>
									<h4 className="card-title">TRADE FOREX - PLACE TRADE </h4>
								</div>
								<div className={`${styles.trade_col_col_card} card-body`}>
									<div className="tab-content">
										<div
											className="tab-pane fade show active"
											id="limit"
											role="tabpanel">
											<form className={styles.trade_form}>
												<div className="form-group">
													<label>
														Amount ({CURRENCY_SYMBOLS[data.currency as "GBP"]})
													</label>
													<div className="input-group">
														<input
															type="number"
															id="amount_trade2"
															required
															name="userTradeAmt"
															value={amount}
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>
															) => {
																setAmount(e.currentTarget.value);
															}}
															data-decimals="2"
															min="100"
															className="form-control"
															placeholder={`${
																CURRENCY_SYMBOLS[data.currency as "GBP"]
															}100`}
														/>
													</div>
												</div>

												<div className="form-group">
													<label>Symbol</label>
													<div className="input-group">
														<select
															name="pair"
															required
															id="showsymbols"
															value={pair}
															onChange={(
																e: React.ChangeEvent<HTMLSelectElement>
															) => {
																setPair(e.currentTarget.value);
															}}
															className="form-control">
															<option value="FX:USDCAD">USD/CAD</option>
															<option value="FX:USDCHF">USD/CHF</option>
															<option value="FX:USDJPY">USD/JPY</option>
															<option value="FX:EURUSD">EUR/USD</option>
															<option value="FX:GBPUSD">GBP/USD</option>
															<option value="FX:NZDUSD">NZD/USD</option>
															<option value="FX:AUDCAD">AUD/CAD</option>
															<option value="FX:AUDUSD">AUD/USD</option>
															<option value="FX:EURGBP">EUR/GBP</option>
															<option value="FX:GBPAUD">GBP/AUD</option>
															<option value="FX:EURAUD">EUR/AUD</option>
															<option value="FX:AUDCHF">AUD/CHF</option>
															<option value="FX:GBPCHF">GBP/CHF</option>
															<option value="FX:GBPJPY">GBP/JPY</option>
															<option value="FX:AUDJPY">AUD/JPY</option>
															<option value="FX:EURJPY">EUR/JPY</option>
															<option value="FX:AUDNZD">AUD/NZD</option>
															<option value="FX:EURCHF">EUR/CHF</option>
															<option value="FX:NZDJPY">NZD/JPY</option>
															<option value="FX:CADCHF">CAD/CHF</option>
															<option value="FX:GBPNZD">GBP/NZD</option>
															<option value="FX:CHFJPY">CHF/JPY</option>
															<option value="FX:NZDCAD">NZD/CAD</option>
															<option value="FX:NZDCHF">NZD/CHF</option>
														</select>
														<div
															className={`${styles.append_group} input-group-append`}>
															<span className="input-group-text size_13">
																Symbol
															</span>
														</div>
													</div>
												</div>
												<div className="form-group">
													<label>Trade Interval (Time)</label>
													<div className="input-group">
														<select
															name="interval"
															className="form-control"
															id="interval">
															<option value="60">1 min</option>
															<option value="180">3 min</option>
															<option value="300">5 min</option>
															<option value="900">15 mins</option>
															<option value="1800">30 mins</option>
															<option value="3600">1 hr</option>
															<option value="7200">2 hr</option>
															<option value="86400">1 day</option>
														</select>
														<div
															className={`${styles.append_group} input-group-append`}>
															<span className="input-group-text size_13">
																Interval
															</span>
														</div>
													</div>
												</div>

												<div className="form-group">
													<label>Trade Leverage</label>
													<div className="input-group">
														<select
															className="form-control"
															name="leverage"
															id="strikerate"
															required>
															<option
																value="1.0X"
																data-rate="high_sell"
																data-buy=""
																data-sell="3">
																1.0X
															</option>
															<option
																value="1.5X"
																data-rate="high_sell"
																data-buy=""
																data-sell="3">
																1.5X
															</option>
															<option
																value="2.0X"
																data-rate="high_sell"
																data-buy=""
																data-sell="3">
																2.0X
															</option>
															<option
																value="5X"
																data-rate="high_sell"
																data-buy=""
																data-sell="3">
																5X
															</option>
															<option
																value="10X"
																data-rate="high_sell"
																data-buy=""
																data-sell="3">
																10X
															</option>
														</select>
														<div
															className={`${styles.append_group} input-group-append`}>
															<span className="input-group-text size_13">
																Leverage
															</span>
														</div>
													</div>
												</div>

												<div
													className={`${styles.btn_group} btn-group btn-block`}>
													<Button type="button" onClick={httpSubmitBuyTrade}>
														Buy
													</Button>

													<Button
														type="button"
														onClick={httpSubmitSellTrade}
														className={styles.sell_btn}>
														Sell
													</Button>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="row col-lg-12">
						<div className="col-xl-12">
							<div className="card">
								<div className={`card-header ${styles.card_header}`}>
									<h4 className="card-title size_16">Orders</h4>

									<div className={styles.trade_status}>
										<button
											className={
												tradeStatus === "open" ? styles.active_status : ""
											}
											onClick={() => {
												setTradeStatus("open");
											}}>
											Open
										</button>
										<button
											className={
												tradeStatus === "pending" ? styles.active_status : ""
											}
											onClick={() => {
												setTradeStatus("pending");
											}}>
											Pending
										</button>
										<button
											className={
												tradeStatus === "closed" ? styles.active_status : ""
											}
											onClick={() => {
												setTradeStatus("closed");
											}}>
											Closed
										</button>
									</div>
								</div>
								<div className="card-body">
									<TableWrapper
										hasActionTab={tradeStatus === "open" ? true : false}
										emptyString={`You have no ${tradeStatus} Order History.`}
										isLoading={isLoading}
										tableData={memoizedList}>
										{memoizedTH}
									</TableWrapper>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default checkUserAuthentication(ForexPage);
