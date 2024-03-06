import Image from "next/image";
import {
	BTCIcon,
	ETHIcon,
	avatar,
	commodityIcon,
	dollarIcon,
	euroIcon,
	goldIcon,
	oilIcon,
	poundIcon,
	silverIcon,
	tetherIcon,
	trophyImg,
} from "@/helpers/image-imports";
import useSession from "@/hooks/use-Session";
import Link from "next/link";
import { CURRENCY_SYMBOLS } from "@/utils/constants";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import TableWrapper from "@/components/Wrappers/TableWrapper";

import styles from "./Index.module.scss";
import Modal from "@/components/Modals/Modal";
import KYC from "@/components/Modals/KYC/Index";
import ActivitiesTable from "./ActivitiesTable";
import Button from "@/components/UI/Button";
import NotificationContext from "@/context/notification";
import AutoTopUpModal from "@/components/Modals/AutoTopUp/Index";

const Dashboard = () => {
	const { data: sessionData } = useSession();
	const { setNotification } = useContext(NotificationContext);
	const [navState, setNavState] = useState<
		"overview" | "forex" | "crypto" | "commodity"
	>("overview");
	const DoughnutChartRef = useRef<any>();
	const [chartLoaded, setChartLoaded] = useState<boolean>(false);
	const [showChart, setShowChart] = useState<boolean>(false);
	const chartDataRef = useRef<any[]>();
	const [showKycModal, setShowKycModal] = useState<boolean>(false);
	const [showAutoTopUpModal, setShowAutoTopUpModal] = useState<boolean>();

	useEffect(() => {
		if (!sessionData.isKYCVerified && sessionData.hasDeposited) {
			setTimeout(() => {
				setShowKycModal(true);
			}, 15000);
		}
	}, [sessionData.isKYCVerified, sessionData.hasDeposited]);

	useEffect(() => {
		const loadDoughnutChart = async () => {
			DoughnutChartRef.current = (
				await import("../../Charts/DoughnutChart")
			).default;

			if (DoughnutChartRef.current) {
				setChartLoaded(true);
			} else {
			}
		};
		loadDoughnutChart();
	}, []);

	useEffect(() => {
		if (chartLoaded) {
			setTimeout(() => {
				const el = document.getElementById("chart_container")!;

				if (el) {
					Array.from(el?.getElementsByTagName("svg")).forEach(
						(svgEl: SVGElement) => {
							svgEl.style.backgroundColor = "transparent";
						}
					);

					el.style.opacity = "1";
					setShowChart(true);
				}
			}, 2000);
		}
	}, [chartLoaded, navState]);

	useMemo(() => {
		const data = [];

		if (navState === "overview") {
			for (let i = 0; i < 3; i++) {
				i === 0
					? data.push({ label: "Fiat", value: sessionData.totalBalance.fiat })
					: i === 1
					? data.push({
							label: "Crypto",
							value: sessionData.totalBalance.crypto,
					  })
					: i === 2
					? data.push({
							label: "Commodity",
							value: sessionData.totalBalance.commodity,
					  })
					: null;
			}
		} else if (navState === "crypto") {
			for (let key in sessionData.balance.crypto) {
				data.push({
					label: key,
					value:
						sessionData.balance.crypto[key as "BTC"] *
						sessionData.rates[key as "BTC"],
				});
			}
		} else if (navState === "forex") {
			for (let key in sessionData.balance.fiat) {
				data.push({
					label: key,
					value: sessionData.balance.fiat[key as "GBP"],
				});
			}
		} else {
			for (let key in sessionData.balance.commodity) {
				data.push({
					label: key,
					value: sessionData.balance.commodity[key as "GOLD"],
				});
			}
		}

		chartDataRef.current = data;
	}, [
		sessionData.totalBalance,
		sessionData.balance,
		sessionData.rates,
		navState,
	]);

	const memoizedTH = useMemo<JSX.Element>(() => {
		return (
			<tr className={`${styles.tr_head} size_12`}>
				<th style={{ fontWeight: "300" }}> Assets</th>
				<th style={{ fontWeight: "300" }}>Amount</th>
			</tr>
		);
	}, []);

	const memoizedList = useMemo<JSX.Element>(() => {
		const domNodes = [];
		for (let key in sessionData.totalBalance) {
			if (key !== "total") {
				domNodes.push({
					bal: sessionData.totalBalance[key as "crypto"].toLocaleString(
						undefined,
						{
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}
					),
					key,
				});
			}
		}

		return (
			<>
				{domNodes.map((node, idx) => (
					<tr className={`${styles.tr_body} size_15-16`} key={idx}>
						<td>
							<div className={styles.table_img}>
								<Image
									alt=""
									src={
										node.key === "fiat"
											? dollarIcon
											: node.key === "crypto"
											? BTCIcon
											: goldIcon
									}
								/>
								{node.key}
							</div>
						</td>
						<td>
							{CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}
							{node.bal.toLocaleString()}
						</td>
					</tr>
				))}
			</>
		);
	}, [sessionData.totalBalance, sessionData.currency]);

	const memoizedCrypto = useMemo<JSX.Element>(() => {
		const domNodes = [];
		for (let key in sessionData.balance.crypto) {
			if (key !== "total") {
				domNodes.push({
					bal: sessionData.balance.crypto[key as "BTC"],
					key,
				});
			}
		}

		return (
			<>
				{domNodes.map((node, idx) => (
					<tr className={`${styles.tr_body} size_15-16`} key={idx}>
						<td>
							<div className={styles.table_img}>
								<Image
									alt=""
									src={
										node.key === "BTC"
											? BTCIcon
											: node.key === "ETH"
											? ETHIcon
											: node.key === "USDT"
											? tetherIcon
											: ""
									}
								/>
								{node.key}
							</div>
						</td>
						<td>
							<div className={styles.table_cell_data}>
								<span>{node.bal.toLocaleString()}</span>
								<small>
									≈ {CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}
									{Number(
										+node.bal * sessionData.rates[node.key as "BTC"]
									).toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</small>
							</div>
						</td>
					</tr>
				))}
			</>
		);
	}, [sessionData.balance.crypto, sessionData.currency, sessionData.rates]);

	const memoizedFx = useMemo<JSX.Element>(() => {
		const domNodes = [];
		for (let key in sessionData.balance.fiat) {
			if (key !== "total") {
				domNodes.push({
					bal: sessionData.balance.fiat[key as "GBP"].toLocaleString(
						undefined,
						{
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}
					),
					key,
				});
			}
		}

		return (
			<>
				{domNodes.map((node, idx) => (
					<tr className={`${styles.tr_body} size_15-16`} key={idx}>
						<td>
							<div className={styles.table_img}>
								<Image
									alt=""
									src={
										node.key === "GBP"
											? poundIcon
											: node.key === "EUR"
											? euroIcon
											: node.key === "USDT"
											? dollarIcon
											: dollarIcon
									}
								/>
								{node.key}
							</div>
						</td>
						<td>{node.bal.toLocaleString()}</td>
					</tr>
				))}
			</>
		);
	}, [sessionData.balance.fiat]);

	const memoizedCommodity = useMemo<JSX.Element>(() => {
		const domNodes = [];
		for (let key in sessionData.balance.commodity) {
			if (key !== "total") {
				domNodes.push({
					bal: sessionData.balance.commodity[key as "GOLD"],
					key,
				});
			}
		}

		return (
			<>
				{domNodes.map((node, idx) => (
					<tr className={`${styles.tr_body} size_15-16`} key={idx}>
						<td>
							<div className={styles.table_img}>
								<Image
									alt=""
									src={
										node.key === "GOLD"
											? goldIcon
											: node.key === "SILVER"
											? silverIcon
											: node.key === "OIL"
											? oilIcon
											: ""
									}
								/>
								{node.key}
							</div>
						</td>
						<td>
							<div className={styles.table_cell_data}>
								<span>
									{node.bal.toLocaleString()}{" "}
									<small>
										{node.key === "GOLD" || node.key === "SILVER"
											? "OZ"
											: node.bal > 1
											? "barrels"
											: "barrels"}
									</small>
								</span>
								<small>
									≈ {CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}
									{Number(
										+node.bal * sessionData.rates[node.key as "BTC"]
									).toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</small>
							</div>
						</td>
					</tr>
				))}
			</>
		);
	}, [sessionData.balance.commodity, sessionData.currency, sessionData.rates]);

	return (
		<section className={styles.section}>
			{showKycModal && (
				<Modal>
					<KYC showModal={setShowKycModal} />
				</Modal>
			)}

			{showAutoTopUpModal && (
				<Modal>
					<AutoTopUpModal showModal={setShowAutoTopUpModal} />
				</Modal>
			)}

			<div className="css-1kwpewk">
				<div className="css-1r5nwuq">
					<Image
						style={{ borderRadius: "50%", background: "#606B8A" }}
						src={sessionData.avatar ?? avatar}
						className="css-16oonh"
						alt=""
						width={64}
						height={64}
					/>

					<div className="css-uliqdc">
						<div className="css-gkju6w">
							<div className="css-rmlu3e">
								<div
									data-bn-type="text"
									title="Anonymous-User-d086f"
									className="css-1h7l4fl"
									style={{ overflow: "hidden", WebkitLineClamp: 2 }}>
									{sessionData.email}
								</div>
							</div>
							<div className="css-p49ol5">
								<Link href={"/profile"}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										className="css-qiee6g">
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M15.336 4.776l3.89 3.889-1.768 1.767-3.89-3.889 1.768-1.767zm-3.181 3.181l3.889 3.89-5.129 5.128H20v3H7.915l-.004.003H4.022V16.09l8.133-8.132z"
											fill="currentColor"></path>
									</svg>
								</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="css-1ihttsk">
					<div className="css-1n7u5cf">
						<div className="css-e9xx42"></div>
						<div className="css-2omdsi">
							<div className="css-5eqoxh">
								<div className="css-17p576p">
									<div className="css-7ir04r">
										<span data-bn-type="text" className="css-mx5ldy size_13">
											User ID
										</span>

										<div className="css-1f9551p"></div>
									</div>
									<div data-bn-type="text" className="css-1su4bnn size_15">
										70905134
									</div>
								</div>
								<div className="css-17p576p">
									<div className="css-7ir04r">
										<div data-bn-type="text" className="css-mx5ldy size_13">
											VIP Level
										</div>
									</div>
									<div className="css-1dengpl">
										<div data-bn-type="text" className="css-1su4bnn size_15">
											Regular User
										</div>
									</div>
								</div>
								<div className="css-17p576p">
									<div className="css-1isjy3l">
										<div data-bn-type="text" className="css-mx5ldy size_13">
											User Type
										</div>
									</div>
									<div className="css-1dengpl">
										<div data-bn-type="text" className="css-1su4bnn size_15">
											Personal
										</div>
									</div>
								</div>
							</div>
							<div className="css-1rphcem"></div>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.balance_header}>
				<div className={styles.balance_header_bal}>
					<h2 className="size_18-20">Estimated Balance</h2>

					<div className={styles.balance_header_bal_links}>
						<Link
							className={`${styles.header_link} ${styles.deposit} size_13`}
							href={"/deposit"}>
							Deposit
						</Link>

						<Link
							className={`${styles.header_link} size_13`}
							href={"/withdrawal"}>
							Withdrawal
						</Link>

						<Link className={`${styles.header_link} size_13`} href={"/trade"}>
							Trade
						</Link>

						<button
							onClick={() => setShowAutoTopUpModal(true)}
							className={`${styles.header_link} size_13`}>
							Auto top-up
						</button>
					</div>
				</div>

				<div className={`${styles.actual_bal} size_20_24 bold`}>
					{CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}
					{sessionData.totalBalance.total.toLocaleString()}
				</div>

				<div className={`${styles.aprox_bal} size_13`}>
					≈{" "}
					{sessionData.totalBalance.total.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</div>

				<div className={styles.balance_header_bal_links_alt}>
					<Link
						className={`${styles.header_link} ${styles.deposit} size_13`}
						href={"/deposit"}>
						Deposit
					</Link>

					<Link
						className={`${styles.header_link} size_13`}
						href={"/withdrawal"}>
						Withdrawal
					</Link>

					<Link className={`${styles.header_link} size_13`} href={"/trade"}>
						Trade
					</Link>

					<button
						onClick={() => setShowAutoTopUpModal(true)}
						className={`${styles.header_link} size_13`}>
						Auto top-up
					</button>
				</div>
			</div>

			<div className={styles.assets_dist}>
				<h2 className="size_18-20">My Assets</h2>

				<div className={styles.assets_cont}>
					<div className={styles.nav_container}>
						<nav
							style={{ marginBottom: "2rem" }}
							className={`nav_sm size_15-16 bold`}>
							<div className={"nav_control"}>
								<button
									className={`${navState === "overview" ? "activeNav" : null}`}
									onClick={() => setNavState("overview")}>
									Overview
								</button>
								<button
									className={`${navState === "forex" ? "activeNav" : null}`}
									onClick={() => setNavState("forex")}>
									Forex
								</button>
								<button
									className={`${navState === "crypto" ? "activeNav" : null}`}
									onClick={() => setNavState("crypto")}>
									Crypto
								</button>
								<button
									className={`${navState === "commodity" ? "activeNav" : null}`}
									onClick={() => setNavState("commodity")}>
									Commodity
								</button>
							</div>
						</nav>

						<TableWrapper
							className={styles.table}
							isLoading={false}
							hasActionTab={false}
							tableData={
								navState === "overview"
									? memoizedList
									: navState === "crypto"
									? memoizedCrypto
									: navState === "forex"
									? memoizedFx
									: memoizedCommodity
							}>
							{memoizedTH}
						</TableWrapper>
					</div>

					<>
						{chartLoaded && (
							<>
								{(navState === "overview" && sessionData.totalBalance.total) ||
								(navState === "crypto" && sessionData.totalBalance.crypto) ||
								(navState === "forex" && sessionData.totalBalance.fiat) ||
								(navState === "commodity" &&
									sessionData.totalBalance.commodity) ? (
									<div id="chart_container" className={styles.chart_container}>
										<DoughnutChartRef.current data={chartDataRef.current} />
									</div>
								) : (
									<div></div>
								)}
							</>
						)}
					</>
				</div>
			</div>

			<ActivitiesTable />

			<div className={styles.leaderboard_control}>
				<div className={styles.leaderboard_control_text}>
					<h4 className="size_18-20 bold">
						Earn 10% deposit fee for every Referral
					</h4>

					<div className="size_12-15">
						<span className={styles.large_text}>
							Ready to supercharge your earnings? Introducing our Referral
							Program – your ticket to exclusive benefits! Invite your friends,
							family, or colleagues to join our community, and you&apos;ll earn
							a whopping 10% deposit fee for every successful referral.
							It&apos;s a win-win!
						</span>
						<span className={styles.small_text}>
							🚀 Invite friends, boost earnings! Get 10% deposit fee for each
							successful referral. Start earning now! 🌟
						</span>
					</div>

					<Button
						onClick={() => {
							navigator.clipboard.writeText(
								`${process.env.NEXT_PUBLIC_APP_URL}/auth/register?ref=${sessionData.email}`
							);
							setNotification({
								message: `Link copied to your clipboard`,
								status: "SUCCESS",
								title: "Success",
							});
						}}
						className={`${styles.leaderboard_link} size_12-16 bold`}>
						Copy Referral Link
					</Button>
				</div>

				<div className={styles.leaderboard_control_images}>
					<Image
						alt=""
						className={styles.leaderboard_img_small}
						src={trophyImg}
					/>
				</div>

				<Button
					onClick={() => {
						navigator.clipboard.writeText(
							`${process.env.NEXT_PUBLIC_APP_URL}/auth/register?ref=${sessionData.email}`
						);
						setNotification({
							message: `Link copied to your clipboard`,
							status: "SUCCESS",
							title: "Success",
						});
					}}
					className={`${styles.leaderboard_link_out} size_12-16 bold`}>
					Copy Referral Link
				</Button>
			</div>
		</section>
	);
};

export default Dashboard;
