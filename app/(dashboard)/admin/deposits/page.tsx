"use client";

import Deposits from "@/components/Page/Admin/Deposits/Deposit";
import { Loader } from "@/components/UI/loader";
import useFetcher from "@/hooks/use-Fetcher";
import checkAdminAuthentication from "@/components/Hoc/AdminProtectedRoute";
import AdminLayout from "@/components/Layout/AdminLayout";

const DepositManagementPage = () => {
	const { data, error, isLoading, revaidate } = useFetcher(
		`transactions/deposit/admin?limit=20`
	);

	return (
		<>
			<AdminLayout hasSidePadding={true}>
				{isLoading ? (
					<Loader className="page_loader" width="35" strokeWidth={"4"} />
				) : (
					<Deposits revaidate={revaidate} data={data} />
				)}
			</AdminLayout>
		</>
	);
};

export default checkAdminAuthentication(DepositManagementPage);
