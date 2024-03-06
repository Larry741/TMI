import { useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import useSession from "@/hooks/use-Session";

function checkUserAuthentication(ProtectedComponent: any) {
	return function CheckUserAuthentication(props: any) {
		const router = useRouter();
		const pathname = usePathname();
		const { status } = useSession();

		useEffect(() => {
			if (status === "unauthenticated") {
				router.push(`/auth/login?cb=${pathname}`);
			}
		}, [router, pathname, status]);

		if (status === "unauthenticated" || status === "loading") {
			return <></>;
		}

		return <ProtectedComponent {...props} />;
	};
}

export default checkUserAuthentication;
