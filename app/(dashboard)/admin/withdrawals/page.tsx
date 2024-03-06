"use client";

import { Loader } from "@/components/UI/loader";
import Withdrawals from "@/components/Page/Admin/Withdrawals/Withdrawals";
import useFetcher from "@/hooks/use-Fetcher";
import checkAdminAuthentication from "@/components/Hoc/AdminProtectedRoute";
import AdminLayout from "@/components/Layout/AdminLayout";

const WithdarwalManagementPage = () => {
	const { data, error, isLoading, revaidate } = useFetcher(
		`transactions/withdrawal/admin?limit=20`
	);

	return (
		<>
			<AdminLayout hasSidePadding={true}>
				{isLoading ? (
					<Loader className="page_loader" width="35" strokeWidth={"4"} />
				) : (
					<Withdrawals revaidate={revaidate} data={data} />
				)}
			</AdminLayout>
		</>
	);
};

export default checkAdminAuthentication(WithdarwalManagementPage);
