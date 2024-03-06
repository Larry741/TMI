"use client";

import { CustomError } from "@/hooks/use-Http";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USER_KEY, UserSliceType, userSliceActions } from "@/store/userSlice";

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const dispatch = useDispatch();
	const [sessionLoading, setSessionLoading] = useState<boolean>(true);

	const fetchUserWithToken = useCallback(
		async (token: any) => {
			try {
				const response = await fetch(`/api/user`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					credentials: "include",
				});

				const res = await response.json();

				console.log(res);
				if (!response.ok) {
					throw new CustomError(res.error, response.status);
				}

				dispatch(userSliceActions.saveUserDetails(res.data));
			} catch (err: any) {
				console.log(err.message);
				dispatch(userSliceActions.logOut({}));
			}
			setSessionLoading(false);
		},
		[dispatch]
	);

	useEffect(() => {
		const user = JSON.parse(sessionStorage.getItem(USER_KEY)!)!;
		let queryStr = window.location?.search.replace("?", "");

		if (queryStr.includes("token")) {
			queryStr = queryStr.replace("token=", "");
			fetchUserWithToken(queryStr);
			console.log("fetching");
		} else if (
			user &&
			typeof user.expireDate === "number" &&
			user.expireDate > Date.now()
		) {
			dispatch(userSliceActions.reSaveUserDetails({}));
			setSessionLoading(false);
		} else {
			dispatch(userSliceActions.logOut({}));
			setSessionLoading(false);
		}
	}, [dispatch, fetchUserWithToken]);

	const revalidateSessionOnWindowFocus = useCallback(() => {
		const session = JSON.parse(sessionStorage.getItem(USER_KEY)!);

		if (session && document.visibilityState === "visible") {
			if (session.expireDate && session.expireDate! <= Date.now()) {
				dispatch(userSliceActions.logOut({}));
			}
		}
	}, [dispatch]);

	useEffect(() => {
		document.addEventListener(
			"visibilitychange",
			revalidateSessionOnWindowFocus
		);

		return () => {
			document.removeEventListener(
				"visibilitychange",
				revalidateSessionOnWindowFocus
			);
		};
	}, [revalidateSessionOnWindowFocus]);

	if (sessionLoading) {
		return <></>;
	}

	return <>{children}</>;
};

export default AuthProvider;
