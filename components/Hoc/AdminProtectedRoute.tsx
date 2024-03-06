import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import useSession from "@/hooks/use-Session";

function checkAdminAuthentication(ProtectedComponent: any) {
	return function CheckUserAuthentication(props: any) {
		const router = useRouter();
		const { status, data: adminSessionData } = useSession();

		useEffect(() => {
			if (status === "unauthenticated" || adminSessionData.role !== "admin") {
				router.push(`/auth/login`);
			}
		}, [router, status, adminSessionData]);

		if (
			status === "unauthenticated" ||
			status === "loading" ||
			adminSessionData.role !== "admin"
		) {
			return <></>;
		}
		return <ProtectedComponent {...props} />;
	};
}

export default checkAdminAuthentication;
