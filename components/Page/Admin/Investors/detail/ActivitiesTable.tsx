import { useMemo, useState } from "react";
import Image from "next/legacy/image";
import moment from "moment";
import { Loader } from "../../../../UI/loader";
import Pagination from "../../../../UI/Pagination";
import usePagination from "../../../../../hooks/use-Pagination";
import Modal from "../../../../Modals/Modal";
import useFetcher from "../../../../../hooks/use-Fetcher";
import useSession from "@/hooks/use-Session";

import styles from "./TransactionsTable.module.scss";

interface investmentType {
	amount: number;
	date: Date;
	name: string;
	typeId: number;
	typeName: string;
	units: number;
}

interface Props {
	userId: number;
	userName: string;
	userAvatar: string;
}

let initialLimit = 20;
const ActivitiesTable = ({ userId, userName, userAvatar }: Props) => {
	const {
		data: investmentData,
		error: investmentError,
		isLoading,
	} = useFetcher(`activities/auth?userId=${userId}&limit=${initialLimit}`);
	const {
		list,
		limit,
		count,
		page,
		pageLoading,
		filterLoading,
		fetchPageData,
	} = usePagination(
		``,
		investmentData?.activities!,
		investmentData?.count!,
		initialLimit
	);

	const loading = isLoading || pageLoading || filterLoading;

	const activitiesList = useMemo(() => list || [], [list]);

	const memoizedList = useMemo(
		() =>
			activitiesList.map((activity, idx) => {
				return (
					<li className={styles.acitivities_list_item} key={idx}>
						<div
							className={`${styles.avatar_control} ${
								filterLoading || pageLoading ? styles.avatar_loading : ""
							} size_25 bold`}>
							{userAvatar ? (
								<Image
									className="avatar"
									alt=""
									layout="fill"
									src={`${userAvatar}`}
									objectFit="contain"
								/>
							) : (
								<span>{userName.slice(0, 1)}</span>
							)}
						</div>
						<div
							className={`${styles.text_control} ${
								pageLoading || filterLoading ? styles.text_control_loading : ""
							} size_16`}>
							<div>{activity.activity}</div>
							<div>
								<span>{moment(activity.createdAt).format("DD MMMM YYYY")}</span>
							</div>
						</div>
					</li>
				);
			}),
		[activitiesList, userName, filterLoading, pageLoading, userAvatar]
	);

	if (investmentError) {
		return (
			<div className={styles.transaction_control}>
				<span className={`empty_list size_15 bold`}>
					Error fetching user Activities
				</span>
			</div>
		);
	}

	return (
		<>
			<div className={styles.transaction_control}>
				{loading ? (
					<Loader
						className="empty_loader_container"
						width="25"
						strokeWidth={"4"}
					/>
				) : (
					<>
						{memoizedList.length ? (
							<>
								<ul className={styles.activities_list}>{memoizedList}</ul>
							</>
						) : filterLoading ? (
							<Loader
								className={`empty_loader_container`}
								width="25"
								strokeWidth={"4"}
							/>
						) : (
							<span className={`empty_list size_15 bold`}>
								No Activities found
							</span>
						)}
					</>
				)}

				{list.length && !isLoading ? (
					<div className={styles.activities_page_control}>
						<Pagination
							limit={limit}
							page={page}
							count={count}
							httpGetNextPrev={fetchPageData}
						/>
					</div>
				) : null}
			</div>
		</>
	);
};

export default ActivitiesTable;
