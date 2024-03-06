import useFetcher from "@/hooks/use-Fetcher";
import { format } from "date-fns";

import styles from "../Withdrawal/withdawals.module.scss";
import { CURRENCY_SYMBOLS } from "@/utils/constants";
import useSession from "@/hooks/use-Session";
import TableWrapper from "@/components/Wrappers/TableWrapper";
import { useMemo } from "react";

const DepositHistory = () => {
	const { data: sessionData } = useSession();
	const { data, error, isLoading } = useFetcher(`transactions/deposit`);

	const memoizedTH = useMemo<JSX.Element>(() => {
		return (
			<tr className="size_14">
				<th>S/N</th>
				<th>Method</th>
				<th>Channel</th>
				<th>Amount</th>
				<th>Date / Time</th>
				<th>Status</th>
			</tr>
		);
	}, []);

	const memoizedList = useMemo<JSX.Element>(() => {
		return (
			<>
				{data?.deposits.map((deposit: any, idx: number) => {
					return (
						<tr className="size_14" key={idx}>
							<td className="text-yellow" scope="col">
								{idx + 1}
							</td>
							<td>{deposit.method}</td>
							<td>{deposit.channel}</td>
							<td>
								{deposit.method === "fiat" &&
									CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}
								{Number(deposit.amount).toLocaleString()}
							</td>
							<td>{format(new Date(deposit.createdAt), "dd MMM yyyy")}</td>
							<td>
								<span
									style={{ color: "white" }}
									className={`${
										deposit.status === "pending"
											? "badge-warning"
											: deposit.status === "successfull"
											? "badge-success"
											: "badge-danger"
									} badge p-2 size_13`}>
									{deposit.status}
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
						<h4 className="card-title size_16">Deposit Log</h4>
					</div>
					<div className="card-body">
						<TableWrapper
							emptyString={`You have no Deposit History.`}
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

export default DepositHistory;
