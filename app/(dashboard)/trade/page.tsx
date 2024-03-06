"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSession from "@/hooks/use-Session";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import checkUserAuthentication from "@/components/Hoc/UserProtectedRoute";
import TradeIndex from "@/components/Page/Trade/Index";

import styles from "@/styles/dashboard/profile.module.scss";

const TradePage = () => {
	const { data } = useSession();
	const router = useRouter();

	return (
		<DashboardLayout large>
			<div className="page-title dashboard">
				<div className="container">
					<div className={`row ${styles.row}`}>
						<div className="page-title-content">
							<span style={{ display: "inline-block" }} className="size_20">
								Welcome
							</span>
							<span className={`${styles.user_name} size_20 bold`}>
								{" "}
								{data.firstName}
							</span>
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
										Profile
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<TradeIndex />
		</DashboardLayout>
	);
};

export default checkUserAuthentication(TradePage);
