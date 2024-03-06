import { useSelector } from "react-redux";
import { UserSliceType } from "@/store/userSlice";

const useSession = () => {
	const session = useSelector((state: any) => state.user) as UserSliceType;

	return {
		data: session,
		status: session.sessionStatus,
	};
};

export default useSession;
