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
import { format } from "date-fns";
import Button from "@/components/UI/Button";
import NotificationContext from "@/context/notification";
import useHttp from "@/hooks/use-Http";
import {
	BARRELS_TO_LITRES,
	CURRENCY_SYMBOLS,
	CURRENCY_TEXT,
	OZ_TO_GRAM,
} from "@/utils/constants";
import useFetcher from "@/hooks/use-Fetcher";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Loader } from "@/components/UI/loader";
import DropdownList from "@/components/UI/DropdownList";
import useDropdown from "@/hooks/use-Dropdown";
import TableWrapper from "@/components/Wrappers/TableWrapper";
import { useDispatch } from "react-redux";
import { fetchUserAction } from "@/store/userSlice";
import SymbolOverview from "@/components/TradingView/SymbolOverview";
import StatCardContainer from "@/components/Cards/StatCardContainer";
import { statCardBreakpoints } from "@/utils/cardBreakpoints";
import { SwiperSlide } from "swiper/react";
import Image from "next/image";
import Modal from "@/components/Modals/Modal";
import CommodityBuySuccessfull from "@/components/Modals/Trade/Gold";
import { goldIcon, goldImg, gold_flower } from "@/helpers/image-imports";
import FundingIndex from "@/components/Modals/Deposit/Index";

import styles from "@/styles/dashboard/profile.module.scss";

const CommoditiesPage = () => {
	const { data: sessionData } = useSession();
	const { sendRequest, httpIsLoading } = useHttp();
	const [height, setHeight] = useState<number>(600);
	const { setNotification } = useContext(NotificationContext);
	const [commodity, setCommodity] = useState<"GOLD" | "SILVER" | "OIL">("GOLD");
	const [chartCommodity, setChartCommodity] = useState<string>("TVC:GOLD");
	const [amount, setAmount] = useState<string>("");
	const dispatch = useDispatch();
	const [tradeStatus, setTradeStatus] = useState<"open" | "closed" | "pending">(
		"open"
	);
	const { style, dropdownId, setDropdownId, showDropdown } =
		useDropdown("content_container");
	const [showSuccesfullModal, setShowSuccesfullModal] =
		useState<boolean>(false);
	const tradeClosing = useRef<any>({});
	const [weight, setWeight] = useState<"oz" | "gm" | "barrels" | "lt">("oz");
	const [currency, setCurrency] = useState<"USD" | "GBP" | "EUR" | "CAD">(
		sessionData.currency
	);
	const [period, setPeriod] = useState<string>(sessionData.currency);
	const [showFundWalletModal, setShowFundWalletModal] =
		useState<boolean>(false);
	const [purchaseOption, setPurchaseOption] = useState<"fiat" | "weight">(
		"fiat"
	);
	const [showNotVerified, setShowNotVerified] = useState<boolean>(
		!sessionData?.isKYCVerified && sessionData?.hasDeposited
	);
	const {
		data: CommodityTrades,
		error,
		isLoading,
		revaidate,
	} = useFetcher(`trade/commodity?status=${tradeStatus}`);

	useEffect(() => {
		if (
			(commodity === "OIL" && weight !== "barrels") ||
			(commodity === "OIL" && weight !== "lt")
		) {
			setWeight("barrels");
		} else {
			setWeight("oz");
		}
	}, [commodity, weight]);

	useEffect(() => {
		let queryStr = window.location?.search.replace("?", "").split("=")[1];

		if (queryStr === "gold") {
			setCommodity("GOLD");
			setChartCommodity("TVC:GOLD");
		} else if (queryStr === "SILVER") {
			setCommodity("SILVER");
			setChartCommodity("TVC:SILVER");
		} else if (queryStr === "crude") {
			setCommodity("OIL");
			setChartCommodity("TVC:UKOIL");
		}
	}, []);

	useEffect(() => {
		const resizeHandler = () => {
			if (document.documentElement.clientWidth < 974) {
				setHeight(460);
			} else {
				const parentEl = document.getElementById("trade_col_col");
				setHeight(parentEl?.clientHeight!);
			}
		};

		resizeHandler();
		window.addEventListener("resize", resizeHandler);
		return () => {
			window.removeEventListener("resize", resizeHandler);
		};
	}, []);

	let commodityAmount: number = 0;
	let commodityPrice: number = 0;
	if (purchaseOption === "fiat") {
		if (weight === "oz") {
			commodityAmount = Number(
				+amount / sessionData.rates[commodity.toUpperCase() as "GOLD"]
			);

			commodityPrice = Number(amount);
		} else if (weight === "gm") {
			commodityAmount = Number(
				+amount / sessionData.rates[commodity.toUpperCase() as "GOLD"]
			);
			commodityAmount = Number(commodityAmount * OZ_TO_GRAM);

			commodityPrice = Number(amount);
		} else if (weight === "barrels") {
			commodityAmount = Number(
				+amount / sessionData.rates[commodity.toUpperCase() as "GOLD"]
			);

			commodityPrice = Number(amount);
		} else {
			commodityAmount = Number(
				+amount / sessionData.rates[commodity.toUpperCase() as "GOLD"]
			);
			commodityAmount = Number(commodityAmount * BARRELS_TO_LITRES);

			commodityPrice = Number(amount);
		}
	} else {
		if (weight === "oz") {
			commodityAmount = Number(+amount);

			commodityPrice = Number(
				+amount * sessionData.rates[commodity.toUpperCase() as "GOLD"]
			);
		} else if (weight === "gm") {
			commodityAmount = Number(+amount);

			commodityPrice = Number(
				(sessionData.rates[commodity.toUpperCase() as "GOLD"] * +amount) /
					OZ_TO_GRAM
			);
		} else if (weight === "barrels") {
			commodityAmount = Number(+amount);

			commodityPrice = Number(
				+amount * sessionData.rates[commodity.toUpperCase() as "GOLD"]
			);
		} else {
			commodityAmount = Number(+amount);

			commodityPrice = Number(
				(sessionData.rates[commodity.toUpperCase() as "GOLD"] * +amount) /
					BARRELS_TO_LITRES
			);
		}
	}

	const httpSubmitBuyTrade = async (e: React.MouseEvent<any>) => {
		e.preventDefault();

		if (commodityPrice > sessionData.balance.fiat[currency]) {
			setShowFundWalletModal(true);
			return;
		}

		if (showNotVerified) {
			return setNotification({
				message: `Please visit your dashboard and verify you acccount`,
				status: "ERROR",
				title: "Error",
			});
		}

		const formData: any = {};

		formData.total =
			weight === "oz"
				? commodityAmount
				: weight === "barrels"
				? commodityAmount
				: weight === "gm"
				? commodityAmount / OZ_TO_GRAM
				: commodityAmount / BARRELS_TO_LITRES;
		formData.action = "buy";
		formData.commodity = commodity;
		formData.tradeCurrency = sessionData.currency;
		formData.tradeWeight = weight;
		formData.action = "buy";
		formData.quoteTotal = commodityPrice;
		formData.tradeTotal = commodityAmount;

		const {
			error,
			message,
			status,
			data: retData,
		} = await sendRequest("POST", "trade/commodity", formData, "JSON");

		if (error) {
			return setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
		}

		revaidate();
		// @ts-ignore
		dispatch(fetchUserAction(""));
		setShowSuccesfullModal(true);
	};

	const httpCloseTrade = useCallback(
		async (tradeId: string) => {
			tradeClosing.current[`${tradeId}`] = true;

			const { error, message, status } = await sendRequest(
				`PUT`,
				`/trade/commodity/close`,
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

	const httpBuySpecific = async (
		commPrice: number,
		commAmount: number,
		tradeWeight: "oz" | "barrels",
		type: "bmt"
	) => {
		if (commPrice > sessionData.balance.fiat[sessionData.currency]) {
			setShowFundWalletModal(true);
			return;
		}

		if (showNotVerified) {
			return setNotification({
				message: `Please visit your dashboard and verify you acccount`,
				status: "ERROR",
				title: "Error",
			});
		}

		const formData: any = {};

		formData.total =
			weight === "oz"
				? commAmount
				: weight === "barrels"
				? commAmount
				: weight === "gm"
				? commAmount / OZ_TO_GRAM
				: commAmount / BARRELS_TO_LITRES;
		formData.action = "buy";
		formData.commodity = commodity;
		formData.tradeCurrency = sessionData.currency;
		formData.tradeWeight = tradeWeight;
		formData.action = "buy";
		formData.quoteTotal = commPrice;
		formData.tradeTotal = commAmount;
		formData.commodityType = type;

		const {
			error,
			message,
			data: retData,
		} = await sendRequest("POST", "trade/commodity", formData, "JSON");

		if (error) {
			return setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
		}

		revaidate();
		// @ts-ignore
		dispatch(fetchUserAction(""));
		setShowSuccesfullModal(true);
	};

	const memoizedTH = useMemo<JSX.Element>(() => {
		return (
			<tr className="size_14">
				<th>Commodity</th>
				<th>Weight/barrels</th>
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
				{CommodityTrades?.trades!.map((trade: any, idx: number) => {
					return (
						<tr className="size_14" key={idx}>
							<td>{trade.commodity}</td>
							<td>
								{Number(trade.tradeTotal).toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
								{trade.tradeWeight}
							</td>
							<td>{format(new Date(trade.createdAt), "dd MMM yyyy")}</td>
							<td>
								{CURRENCY_SYMBOLS[trade.tradeCurrency as "GBP"]}
								{Number(trade.quoteTotal).toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}{" "}
							</td>
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
		CommodityTrades?.trades,
		setDropdownId,
		showDropdown,
		style,
		tradeStatus,
		httpCloseTrade,
	]);

	let derivedAmount: number = 0;
	if (purchaseOption === "fiat") {
		if (weight === "oz") {
			derivedAmount = Number(
				+amount / sessionData.rates[commodity.toUpperCase() as "GOLD"]
			);
		} else if (weight === "gm") {
			derivedAmount = Number(
				+amount / sessionData.rates[commodity.toUpperCase() as "GOLD"]
			);

			derivedAmount = Number(derivedAmount * OZ_TO_GRAM);
		} else if (weight === "barrels") {
			derivedAmount = Number(
				+amount / sessionData.rates[commodity.toUpperCase() as "GOLD"]
			);
		} else {
			derivedAmount = Number(
				+amount / sessionData.rates[commodity.toUpperCase() as "GOLD"]
			);

			derivedAmount = Number(derivedAmount * BARRELS_TO_LITRES);
		}
	} else {
		if (weight === "oz") {
			derivedAmount = Number(
				sessionData.rates[commodity.toUpperCase() as "GOLD"] * +amount
			);
		} else if (weight === "gm") {
			derivedAmount = Number(
				sessionData.rates[commodity.toUpperCase() as "GOLD"] * +amount
			);

			derivedAmount = Number(derivedAmount / OZ_TO_GRAM);
		} else if (weight === "barrels") {
			derivedAmount = Number(
				sessionData.rates[commodity.toUpperCase() as "GOLD"] * +amount
			);
		} else {
			derivedAmount = Number(
				sessionData.rates[commodity.toUpperCase() as "GOLD"] * +amount
			);

			derivedAmount = Number(derivedAmount / BARRELS_TO_LITRES);
		}
	}

	return (
		<DashboardLayout large>
			{showSuccesfullModal && (
				<Modal>
					<CommodityBuySuccessfull
						commodityAmount={commodityAmount}
						investType="BUY"
						price={commodityPrice}
						weight={weight}
						commodity={commodity}
						currency={currency}
						showModal={setShowSuccesfullModal}
					/>
				</Modal>
			)}

			{showFundWalletModal && (
				<Modal>
					<FundingIndex showModal={setShowFundWalletModal} />
				</Modal>
			)}

			<TickerTape
				colorTheme="dark"
				symbols={"commodity"}
				containerId={styles["ticker-tap-tv"]}
			/>

			{/* {commodity === "GOLD" ? (
        <StatCardContainer
          breakpoints={statCardBreakpoints}
          heading={"Buy Gold"}>
          <SwiperSlide>
            <div className={`stats_card stats_card_gold`}>
              <h4 className="size_16-20">BMT Gold</h4>
              <div className={`acc_bal size_15-16`}>
                <div className="image_cont">
                  <Image
                    width={30}
                    height={30}
                    alt="overview logo"
                    src={goldIcon}
                  />
                </div>
                <span className="">1.6oz</span>
              </div>
              <div className="buy_gold_container size_16">
                <span>{CURRENCY_SYMBOLS[sessionData.currency]}1,000</span>

                <Button
                  onClick={() => {
                    httpBuySpecific(1000, 1.6, "oz", "bmt");
                  }}
                  showLoader={false}>
                  Buy Gold
                </Button>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={`stats_card stats_card_gold`}>
              <h4 className="size_16-20">BMT Gold</h4>
              <div className={`acc_bal size_15-16`}>
                <div className="image_cont">
                  <Image
                    width={30}
                    height={30}
                    alt="overview logo"
                    src={goldIcon}
                  />
                </div>
                <span className="">5oz</span>
              </div>
              <div className="buy_gold_container size_16">
                <span>{CURRENCY_SYMBOLS[sessionData.currency]}5,000</span>

                <Button
                  onClick={() => {
                    httpBuySpecific(5000, 5, "oz", "bmt");
                  }}
                  showLoader={false}>
                  Buy Gold
                </Button>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={`stats_card stats_card_gold`}>
              <h4 className="size_16-20">BMT Gold</h4>
              <div className={`acc_bal size_15-16`}>
                <div className="image_cont">
                  <Image
                    width={30}
                    height={30}
                    alt="overview logo"
                    src={goldIcon}
                  />
                </div>
                <span className="">12oz</span>
              </div>
              <div className="buy_gold_container size_16">
                <span>{CURRENCY_SYMBOLS[sessionData.currency]}20,000</span>

                <Button
                  onClick={() => {
                    httpBuySpecific(20000, 12, "oz", "bmt");
                  }}
                  showLoader={false}>
                  Buy Gold
                </Button>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={`stats_card stats_card_gold`}>
              <h4 className="size_16-20">BMT Gold</h4>
              <div className={`acc_bal size_15-16`}>
                <div className="image_cont">
                  <Image
                    width={30}
                    height={30}
                    alt="overview logo"
                    src={goldIcon}
                  />
                </div>
                <span className="">20oz</span>
              </div>
              <div className="buy_gold_container size_16">
                <span>{CURRENCY_SYMBOLS[sessionData.currency]}50,000</span>

                <Button
                  onClick={() => {
                    httpBuySpecific(50000, 20, "oz", "bmt");
                  }}
                  showLoader={false}>
                  Buy Gold
                </Button>
              </div>
            </div>
          </SwiperSlide>
        </StatCardContainer>
      ) : commodity === "OIL" ? (
        <StatCardContainer
          breakpoints={statCardBreakpoints}
          heading={"Buy Oil"}>
          <SwiperSlide>
            <div className={`stats_card stats_card_gold`}>
              <h4 className="size_16-20">BMT Oil</h4>
              <div className={`acc_bal size_15-16`}>
                <div className="image_cont">
                  <Image
                    width={30}
                    height={30}
                    alt="overview logo"
                    src={goldIcon}
                  />
                </div>
                <span className="">1.6barrels</span>
              </div>
              <div className="buy_gold_container size_16">
                <span>{CURRENCY_SYMBOLS[sessionData.currency]}1,000</span>

                <Button
                  onClick={() => {
                    httpBuySpecific(1000, 1.6, "barrels", "bmt");
                  }}
                  showLoader={false}>
                  Buy Gold
                </Button>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={`stats_card stats_card_gold`}>
              <h4 className="size_16-20">BMT Oil</h4>
              <div className={`acc_bal size_15-16`}>
                <div className="image_cont">
                  <Image
                    width={30}
                    height={30}
                    alt="overview logo"
                    src={goldIcon}
                  />
                </div>
                <span className="">5barrels</span>
              </div>
              <div className="buy_gold_container size_16">
                <span>{CURRENCY_SYMBOLS[sessionData.currency]}5,000</span>

                <Button
                  onClick={() => {
                    httpBuySpecific(5000, 5, "barrels", "bmt");
                  }}
                  showLoader={false}>
                  Buy Gold
                </Button>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={`stats_card stats_card_gold`}>
              <h4 className="size_16-20">BMT Oil</h4>
              <div className={`acc_bal size_15-16`}>
                <div className="image_cont">
                  <Image
                    width={30}
                    height={30}
                    alt="overview logo"
                    src={goldIcon}
                  />
                </div>
                <span className="">12barrels</span>
              </div>
              <div className="buy_gold_container size_16">
                <span>{CURRENCY_SYMBOLS[sessionData.currency]}20,000</span>

                <Button
                  onClick={() => {
                    httpBuySpecific(20000, 12, "barrels", "bmt");
                  }}
                  showLoader={false}>
                  Buy Gold
                </Button>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={`stats_card stats_card_gold`}>
              <h4 className="size_16-20">BMT Oil</h4>
              <div className={`acc_bal size_15-16`}>
                <div className="image_cont">
                  <Image
                    width={30}
                    height={30}
                    alt="overview logo"
                    src={goldIcon}
                  />
                </div>
                <span className="">20barrels</span>
              </div>
              <div className="buy_gold_container size_16">
                <span>{CURRENCY_SYMBOLS[sessionData.currency]}50,000</span>

                <Button
                  onClick={() => {
                    httpBuySpecific(50000, 20, "barrels", "bmt");
                  }}
                  showLoader={false}>
                  Buy Gold
                </Button>
              </div>
            </div>
          </SwiperSlide>
        </StatCardContainer>
      ) : (
        ""
      )} */}

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
                  {sessionData.firstName}
                </b>
                , Your Account has not been verified. Please Visit Your Verify
                section of your Dashboard to Verify Your Account. Unverified
                Accounts cannot place Trades.
              </p>
            </div>
          )} */}

					<div
						id={"trade_col"}
						className={`${styles.trade_col_reverse} ${styles.trade_col} row col-lg-12`}>
						<div id={"trade_col_col"} className={styles.trade_col_col}>
							<div className={styles.commodi_cont}>
								<h2 className="size_16-18">Commodity</h2>

								<div className={styles.commodi_cont_control}>
									<button
										onClick={() => {
											setCommodity("GOLD");
											setChartCommodity("TVC:GOLD");
										}}
										className={`${
											commodity === "GOLD" ? styles.active_commodity : ""
										} size_15`}>
										Gold
									</button>
									<button
										onClick={() => {
											setCommodity("SILVER");
											setChartCommodity("TVC:SILVER");
										}}
										className={`${
											commodity === "SILVER" ? styles.active_commodity : ""
										} size_15`}>
										Silver
									</button>
									<button
										onClick={() => {
											setCommodity("OIL");
											setChartCommodity("TVC:UKOIL");
										}}
										className={`${
											commodity === "OIL" ? styles.active_commodity : ""
										} size_15`}>
										Oil
									</button>
								</div>
							</div>

							<div className={styles.weight_cont}>
								<div className={styles.weight_cont_control}>
									<label className={"size_16-18"} htmlFor="weight">
										Weight
									</label>
									<select
										className={"size_15"}
										name="weight"
										required
										id="weight"
										value={weight}
										onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
											setWeight(e.currentTarget.value as "oz");
										}}>
										{commodity === "OIL" ? (
											<>
												<option value={"barrels"}>Barrels</option>
												<option value={"lt"}>Litres</option>
											</>
										) : (
											<>
												<option value={"oz"}>Ounces</option>
												<option value={"gm"}>Gram</option>
											</>
										)}
									</select>
								</div>

								<div className={styles.weight_cont_control}>
									<label className={"size_16-18"} htmlFor="currency">
										Currency
									</label>
									<select
										className={"size_15"}
										name="currency"
										required
										id="currency"
										value={currency}
										onChange={(e) => setCurrency(e.target.value as "GBP")}>
										<option value={"USD"}>USD</option>
										<option value={"GBP"}>GBP</option>
										<option value={"EUR"}>EUR</option>
										<option value={"CAD"}>CAD</option>
									</select>
								</div>

								<div className={styles.weight_cont_control}>
									<label htmlFor="period" className={"size_16-18"}>
										Period
									</label>
									<select
										className={"size_15"}
										name="period"
										required
										id="period"
										value={period}
										onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
											setPeriod(e.currentTarget.value);
										}}>
										<option value={"1week"}>Week</option>
										<option value={"month"}>Month</option>
										<option value={"3month"}>3 Month</option>
										<option value={"6Month"}>6 Month</option>
										<option value={"1year"}>1 Year</option>
										<option value={"5year"}>5 Year</option>
									</select>
								</div>
							</div>

							<form className={styles.buy_box}>
								<div className={styles.buy_box_terms}>
									<div
										onClick={() => setPurchaseOption("fiat")}
										className={styles.buy_box_terms_control}>
										<span
											className={`${
												purchaseOption === "fiat" ? styles.active_buy_in : ""
											} ${styles.terms_box}`}></span>
										<span className="size_14-15">
											Buy in {CURRENCY_TEXT[sessionData.currency as "GBP"]}
										</span>
									</div>

									<div
										onClick={() => setPurchaseOption("weight")}
										className={styles.buy_box_terms_control}>
										<span
											className={`${
												purchaseOption === "weight" ? styles.active_buy_in : ""
											} ${styles.terms_box}`}></span>
										<span className="size_14-15">Buy in {weight}</span>
									</div>
								</div>

								<div className={styles.input_text}>
									<div className={styles.input_control}>
										<input
											type="text"
											className="size_15"
											value={amount}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												setAmount(e.currentTarget.value);
											}}
											placeholder={
												purchaseOption === "fiat"
													? `${
															CURRENCY_SYMBOLS[sessionData.currency as "GBP"]
													  }0`
													: `0${weight}`
											}
										/>
										<span>
											≈{" "}
											<span className="size_15">
												{purchaseOption === "weight"
													? `${CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}`
													: ""}
												{derivedAmount.toLocaleString(undefined, {
													maximumFractionDigits: 2,
													minimumFractionDigits: 0,
												})}
												{purchaseOption === "fiat" ? `${weight}` : ""}
											</span>
										</span>
									</div>
								</div>

								<div className={styles.buttons_buy}>
									<button
										type="button"
										onClick={() => {
											setPurchaseOption("fiat"), setAmount("1000");
										}}
										className="size_14">
										{CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}
										{"1,000"}
									</button>
									<button
										type="button"
										onClick={() => {
											setAmount("5000"), setPurchaseOption("fiat");
										}}
										className="size_14">
										{CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}5,000
									</button>
									<button
										type="button"
										onClick={() => {
											setAmount("20000"), setPurchaseOption("fiat");
										}}
										className="size_14">
										{CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}20,000
									</button>
									<button
										type="button"
										onClick={() => {
											setAmount("50000"), setPurchaseOption("fiat");
										}}
										className="size_14">
										{CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}50,000
									</button>
								</div>

								<Button
									onClick={httpSubmitBuyTrade}
									type="button"
									showLoader={httpIsLoading}>
									Buy
								</Button>
							</form>
						</div>

						<SymbolOverview
							dateFormat="MM/dd/yy"
							colorTheme="dark"
							height={height}
							initSymbol={chartCommodity}
						/>
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

export default checkUserAuthentication(CommoditiesPage);
