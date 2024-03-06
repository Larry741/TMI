"use client";

import { useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import useSession from "@/hooks/use-Session";
import IndexDeposit from "@/components/Page/Deposit/Index";
import {
	BsBullseye,
	BsFillSuitHeartFill,
	BsPentagonFill,
} from "react-icons/bs";
import checkUserAuthentication from "@/components/Hoc/UserProtectedRoute";
import { useRouter } from "next/navigation";
import DepositHistory from "@/components/Page/Deposit/History";

import styles from "@/styles/dashboard/profile.module.scss";

const Depositpage = () => {
	const { data } = useSession();
	const [tab, setTab] = useState<string>("deposit");
	const router = useRouter();

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
										Deposit
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
											onClick={() => setTab("deposit")}
											className={`${styles.tab} ${
												tab === "deposit" ? styles.active_tab : ""
											} nav-item active size_15`}>
											<BsBullseye size={24} />
											<span>Deposit</span>
										</li>
										<li
											onClick={() => setTab("dep-history")}
											className={`${styles.tab} ${
												tab === "dep-history" ? styles.active_tab : ""
											} nav-item active size_15`}>
											<BsFillSuitHeartFill size={24} />
											<span>Deposit History</span>
										</li>
									</ul>
								</div>
							</div>

							{tab === "deposit" ? (
								<IndexDeposit />
							) : tab === "dep-history" ? (
								<DepositHistory />
							) : null}
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default checkUserAuthentication(Depositpage);
