import { useMemo, useState } from "react";
import Image from "next/legacy/image";
import { format } from "date-fns";
import Modal from "@/components/Modals/Modal";
import useFetcher from "@/hooks/use-Fetcher";

import styles from "./TransactionsTable.module.scss";
import { avatar } from "@/helpers/image-imports";
import useSession from "@/hooks/use-Session";

let initialLimit = 20;
const ActivitiesTable = () => {
	const { data: activitiesData, error, isLoading } = useFetcher(`activities`);
	const { data: sessionData } = useSession();

	const memoizedList = useMemo(
		() =>
			activitiesData?.activities.map((activity: any, idx: number) => {
				return (
					<li className={styles.acitivities_list_item} key={idx}>
						<div className={`${styles.avatar_control} size_25 bold`}>
							<Image
								style={{ borderRadius: "50%", background: "#606B8A" }}
								src={sessionData.avatar ?? avatar}
								className="css-16oonh"
								alt=""
								width={50}
								height={50}
							/>
						</div>
						<div className={`${styles.text_control} size_14-16`}>
							<div>{activity.activity}</div>
							<div className={`${styles.date} size_13-14`}>
								{format(new Date(activity.createdAt), "dd MMMM yyyy")}
							</div>
						</div>
					</li>
				);
			}),
		[activitiesData, sessionData.avatar]
	);

	return (
		<>
			{!isLoading && activitiesData?.count! > 0 && (
				<div className={styles.recent_activities}>
					<h2 className="size_18-20">Recent Activities</h2>

					<ul className={styles.activities_list}>{memoizedList}</ul>
				</div>
			)}
		</>
	);
};

export default ActivitiesTable;
