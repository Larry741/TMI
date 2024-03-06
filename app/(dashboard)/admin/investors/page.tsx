"use client";

import { Loader } from "@/components/UI/loader";
import useFetcher from "@/hooks/use-Fetcher";
import checkAdminAuthentication from "@/components/Hoc/AdminProtectedRoute";
import AdminLayout from "@/components/Layout/AdminLayout";
import Investors from "@/components/Page/Admin/Investors/Investors";

const InvestorsPage = () => {
	const { data, error, isLoading } = useFetcher(`user/admin`);

	return (
		<>
			<AdminLayout>
				{isLoading ? (
					<Loader className="page_loader" width="35" strokeWidth={"4"} />
				) : (
					<Investors data={data} />
				)}
			</AdminLayout>
		</>
	);
};

export default checkAdminAuthentication(InvestorsPage);
