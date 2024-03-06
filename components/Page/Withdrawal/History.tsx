import { format } from "date-fns";
import useFetcher from "@/hooks/use-Fetcher";
import useSession from "@/hooks/use-Session";

import styles from "./withdawals.module.scss";
import { CURRENCY_SYMBOLS } from "@/utils/constants";
import { useMemo } from "react";
import TableWrapper from "@/components/Wrappers/TableWrapper";

const WithdrawalHistory = () => {
	const { data: sessionData } = useSession();
	const { data, error, isLoading } = useFetcher(`transactions/withdrawal`);

	const memoizedTH = useMemo<JSX.Element>(() => {
		return (
			<tr className="size_14">
				<th>S/N</th>
				<th>Transaction Details</th>
				<th>Method</th>
				<th>Amount</th>
				<th>Date / Time</th>
				<th>Status</th>
			</tr>
		);
	}, []);

	const memoizedList = useMemo<JSX.Element>(() => {
		return (
			<>
				{data?.withdrawals.map((withdrawal: any, idx: number) => {
					return (
						<tr className="size_14" key={idx}>
							<td className="text-yellow" scope="col">
								{idx + 1}
							</td>
							<td>{withdrawal.detail}</td>
							<td>{withdrawal.method}</td>
							<td>
								{withdrawal.method === "fiat" &&
									CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}
								{Number(withdrawal.amount).toLocaleString()}
							</td>
							<td>{format(new Date(withdrawal.createdAt), "dd MMM yyyy")}</td>
							<td>
								<span
									style={{ color: "white" }}
									className={`${
										withdrawal.status === "pending"
											? "badge-warning"
											: withdrawal.status === "successful"
											? "badge-success"
											: "badge-danger"
									} badge p-2 size_13`}>
									{withdrawal.status}
								</span>{" "}
							</td>
						</tr>
					);
				})}
			</>
		);
	}, [data, sessionData.currency]);

	if (isLoading) {
		return <></>;
	}

	return (
		<>
			<div className="col-xl-12">
				<div className="card">
					<div className={`${styles.card_header} card-header`}>
						<h4 className="card-title size_16">Withdrawal Log</h4>
					</div>

					<div className="card-body">
						<TableWrapper
							emptyString={`You have no Withdrawal History.`}
							isLoading={isLoading}
							hasActionTab={false}
							tableData={memoizedList}>
							{memoizedTH}
						</TableWrapper>
					</div>
				</div>
			</div>
		</>
	);
};

export default WithdrawalHistory;
