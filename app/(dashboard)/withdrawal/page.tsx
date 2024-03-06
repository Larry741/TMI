"use client";

import { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import useSession from "@/hooks/use-Session";
import { useRouter } from "next/navigation";
import IndexWithdrawal from "@/components/Page/Withdrawal/Index";
import {
	BsBullseye,
	BsFillSuitHeartFill,
	BsPentagonFill,
} from "react-icons/bs";
import checkUserAuthentication from "@/components/Hoc/UserProtectedRoute";
import WithdrawalHistory from "@/components/Page/Withdrawal/History";
import DepositHistory from "@/components/Page/Deposit/History";

import styles from "@/styles/dashboard/profile.module.scss";

const Withdrawalpage = () => {
	const router = useRouter();
	const { data } = useSession();
	const [tab, setTab] = useState<string>("withdrawal");

	return (
		<DashboardLayout>
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
										{data.firstName}
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
										Withdrawal
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
						<div className="col-xl-12">
							<div className="card sub-menu">
								<div className="card-body active">
									<ul className={`d-flex show ${styles.tab_list}`}>
										<li
											onClick={() => setTab("withdrawal")}
											className={`${styles.tab} ${
												tab === "withdrawal" ? styles.active_tab : ""
											} nav-item active size_15`}>
											<BsBullseye size={24} />
											<span>Withdrawal</span>
										</li>
										<li
											onClick={() => setTab("withdrawal-history")}
											className={`${styles.tab} ${
												tab === "withdrawal-history" ? styles.active_tab : ""
											} nav-item active size_15`}>
											<BsPentagonFill size={24} />
											<span>Withdrawal History</span>
										</li>
									</ul>
								</div>
							</div>

							{tab === "withdrawal" ? (
								<IndexWithdrawal />
							) : tab === "withdrawal-history" ? (
								<WithdrawalHistory />
							) : null}
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default checkUserAuthentication(Withdrawalpage);
