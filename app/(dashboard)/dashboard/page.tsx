"use client";

import DashboardLayout from "@/components/Layout/DashboardLayout";
import checkUserAuthentication from "@/components/Hoc/UserProtectedRoute";

import Dashboard from "@/components/Page/Dashboard/Index";

const Homepage = () => {
	return (
		<DashboardLayout large>
			<Dashboard />
		</DashboardLayout>
	);
};

export default checkUserAuthentication(Homepage);
