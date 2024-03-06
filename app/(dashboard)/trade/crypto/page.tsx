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
import Button from "@/components/UI/Button";
import NotificationContext from "@/context/notification";
import useHttp from "@/hooks/use-Http";
import { CURRENCY_SYMBOLS } from "@/utils/constants";
import useFetcher from "@/hooks/use-Fetcher";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Loader } from "@/components/UI/loader";
import DropdownList from "@/components/UI/DropdownList";
import useDropdown from "@/hooks/use-Dropdown";
import TableWrapper from "@/components/Wrappers/TableWrapper";
import { fetchUserAction } from "@/store/userSlice";
import { useDispatch } from "react-redux";
import Modal from "@/components/Modals/Modal";
import FundingIndex from "@/components/Modals/Deposit/Index";

import styles from "@/styles/dashboard/profile.module.scss";

const CryptoPage = () => {
	const { data } = useSession();
	const { sendRequest } = useHttp();
	const [height, setHeight] = useState<number>(600);
	const dispatch = useDispatch();
	const { setNotification } = useContext(NotificationContext);
	const [pair, setPair] = useState<string>("BINANCE:BTCUSDT");
	const [amount, setAmount] = useState<string>("");
	const [showFundWalletModal, setShowFundWalletModal] =
		useState<boolean>(false);
	const [tradeStatus, setTradeStatus] = useState<"open" | "closed" | "pending">(
		"open"
	);
	const [showNotVerified, setShowNotVerified] = useState<boolean>(
		!data.isKYCVerified && data.hasDeposited
	);
	const { style, dropdownId, setDropdownId, showDropdown } =
		useDropdown("content_container");
	const tradeClosing = useRef<any>({});

	const {
		data: fxTrades,
		error,
		isLoading,
		revaidate,
	} = useFetcher(`trade/crypto?status=${tradeStatus}`);

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
		const baseCoin = pairArr[1].slice(0, 3);
		const quoteCoin = "USDT";

		if (
			+amount * data.rates[baseCoin as "BTC"] >
			data.balance.crypto[quoteCoin]
		) {
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
				message: `Invalid form data`,
				status: "ERROR",
				title: "Error",
			});
		}

		formData.action = "buy";
		formData.quoteCoin = quoteCoin;
		formData.baseCoin = baseCoin;
		formData.quoteTotal = data.rates[baseCoin as "BTC"];

		const {
			error,
			message,
			status,
			data: retData,
		} = await sendRequest("POST", "trade/crypto", formData, "JSON");

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
	};

	const httpSubmitSellTrade = async (e: React.MouseEvent<any>) => {
		const pairArr = pair.split(":");
		const baseCoin = pairArr[1].slice(0, 3);
		const quoteCoin = "USDT";

		if (
			+amount * data.rates[baseCoin as "BTC"] >
			data.balance.crypto[quoteCoin]
		) {
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
				message: `Invalid form data`,
				status: "ERROR",
				title: "Error",
			});
		}

		formData.action = "sell";
		formData.quoteCoin = quoteCoin;
		formData.baseCoin = baseCoin;
		formData.quoteTotal = data.rates[baseCoin as "BTC"];

		const {
			error,
			message,
			status,
			data: retData,
		} = await sendRequest("POST", "trade/crypto/sell", formData, "JSON");

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
	};

	const httpCloseTrade = useCallback(
		async (tradeId: string) => {
			tradeClosing.current[`${tradeId}`] = true;

			const { error, message, status } = await sendRequest(
				`PUT`,
				`/trade/crypto/close`,
				{ tradeId },
				"JSON"
			);

			if (error) {
				delete tradeClosing.current[`${tradeId}`];
				return setNotification({
					message: `${message}`,
					status: "ERROR",
					title: "Error",
				});
			}

			delete tradeClosing.current[`${tradeId}`];
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
				<th>Price (rate)</th>
				<th>Filled</th>
				<th>Role</th>
				<th>Date</th>
				<th>Total</th>
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
							<td>{trade.pair.slice(8)}</td>
							<td>
								{/* {CURRENCY_SYMBOLS[trade.tradeCurrency as "USD"]} */}
								{Number(trade.quoteTotal / trade.total).toLocaleString(
									undefined,
									{
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}
								)}
							</td>
							<td>
								{Number(trade.total).toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}{" "}
								({trade.baseCoin})
							</td>
							<td>Taker</td>
							<td>{format(new Date(trade.createdAt), "dd MMM yyyy")}</td>
							<td>
								{Number(trade.quoteTotal).toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}{" "}
								({trade.quoteCoin})
							</td>
							<td
								style={{
									textTransform: "capitalize",
									color: trade.action === "sell" ? "red" : "green",
								}}>
								{/* <span
                                      style={{
                                        textTransform: "capitalize"
                                      }}
                                      className={`${
                                        trade.status === "active"
                                          ? "badge-warning"
                                          : null
                                      } badge p-2 size_13`}>
                                      {trade.status}
                                    </span>{" "} */}
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

										{tradeClosing.current[`${trade._id}`] ? (
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
				symbols={"crypto"}
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
									<h4 className="card-title">TRADE CRYPTO - PLACE TRADE </h4>
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
														Total ({pair.split(":")[1].slice(0, 3)})
													</label>
													<div className="input-group">
														<input
															type="number"
															id="amount_trade2"
															required
															name="total"
															value={amount}
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>
															) => {
																setAmount(e.currentTarget.value);
															}}
															data-decimals="2"
															min="100"
															className="form-control"
															placeholder={`20${pair
																.split(":")[1]
																.slice(0, 3)}`}
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
															<option value="BINANCE:BTCUSDT">BTC/USDT</option>
															<option value="BINANCE:ETHUSDT">ETH/USDT</option>
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
										emptyString={`You have no ${tradeStatus} Order History.`}
										isLoading={isLoading}
										hasActionTab={tradeStatus === "open" ? true : false}
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

export default checkUserAuthentication(CryptoPage);
