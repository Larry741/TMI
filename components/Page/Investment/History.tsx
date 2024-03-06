import useFetcher from "@/hooks/use-Fetcher";
import { format } from "date-fns";

import styles from "../Withdrawal/withdawals.module.scss";
import useSession from "@/hooks/use-Session";
import TableWrapper from "@/components/Wrappers/TableWrapper";
import { useMemo } from "react";
import { CURRENCY_SYMBOLS } from "@/utils/constants";

const InvestmentPayoutHistory = () => {
	const { data: sessionData } = useSession();
	const { data, error, isLoading } = useFetcher(`investment/payout-history`);

	const memoizedTH = useMemo<JSX.Element>(() => {
		return (
			<tr className="size_14">
				<th>S/N</th>
				<th>Amount</th>
				<th>Profit</th>
			</tr>
		);
	}, []);

	const memoizedList = useMemo<JSX.Element>(() => {
		return (
			<>
				{data?.payouts.map((payout: any, idx: number) => {
					return (
						<tr className="size_14" key={idx}>
							<td className="text-yellow" scope="col">
								{idx + 1}
							</td>
							<td>
								{CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}
								{payout.amount.toLocaleString(undefined, {
									minimumFractionDigits: 0,
									maximumFractionDigits: 2,
								})}
							</td>
							<td>
								{CURRENCY_SYMBOLS[sessionData.currency as "GBP"]}
								{payout.profit.toLocaleString(undefined, {
									minimumFractionDigits: 0,
									maximumFractionDigits: 2,
								})}
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
						<h4 className="card-title size_16">Investment Payouts</h4>
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

export default InvestmentPayoutHistory;
