"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/UI/loader";
import InvestorDetail from "@/components/Page/Admin/Investors/detail/InvestorDetail";
import useFetcher from "@/hooks/use-Fetcher";
import checkAdminAuthentication from "@/components/Hoc/AdminProtectedRoute";
import AdminLayout from "@/components/Layout/AdminLayout";

let INVESTOR_API_URL: string;

const InvestorDetailPage = ({ params }: { params: { investorId: string } }) => {
	const { data, error, isLoading } = useFetcher(
		params.investorId ? `user/admin?userId=${params.investorId}` : ""
	);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!isLoading && params?.investorId) {
			setLoading(false);
		}
	}, [params, isLoading]);

	return (
		<>
			<AdminLayout hasSidePadding={true}>
				{isLoading || loading ? (
					<Loader className="page_loader" width="35" strokeWidth={"4"} />
				) : (
					//  @ts-ignore
					<InvestorDetail data={data as any} />
				)}
			</AdminLayout>
		</>
	);
};

export default checkAdminAuthentication(InvestorDetailPage);
