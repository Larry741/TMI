import { useRouter } from "next/navigation";
import useHttp from "./use-Http";
import { useDispatch } from "react-redux";
import { userSliceActions } from "@/store/userSlice";
import NotificationContext from "@/context/notification";
import { useContext } from "react";

const useUser = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { httpIsLoading, sendRequest } = useHttp();
	const { setNotification } = useContext(NotificationContext);

	const signInUser = async (details: any) => {
		try {
			const { error, message, data } = await sendRequest(
				"POST",
				"auth/sign-in",
				details,
				"JSON"
			);

			if (error) {
				setNotification({
					message: `${message}`,
					status: "ERROR",
					title: "Error",
				});
				return false;
			}

			dispatch(userSliceActions.saveUserDetails(data));

			if (!data.emailVerified) {
				return data;
			}

			router.replace("/dashboard");
		} catch (err: any) {
			setNotification({
				message: `${err?.message}`,
				status: "ERROR",
				title: "Error",
			});
		}
	};

	const signupUser = async (signupData: any) => {
		const { error, message, data } = await sendRequest(
			"POST",
			"auth/register",
			signupData,
			"JSON"
		);

		if (error) {
			setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
			return false;
		}

		return data;
	};

	const passwordRecovery = async (form: HTMLFormElement) => {
		const formInputs = form.elements;

		const formData: { [key in string]: string } = {};
		let isValid = true;
		// Iterate through form elements
		for (let i = 0; i < formInputs.length; i++) {
			const input = formInputs[i] as HTMLInputElement;

			// Check if the element is an input or textarea
			if (input.tagName === "INPUT") {
				if (input.value === "") isValid = false;

				formData[input.name] = input.value;
			}
		}

		if (!isValid) {
			setNotification({
				message: "Invalid data",
				status: "ERROR",
				title: "Error",
			});
			return false;
		}

		const { error, message, data } = await sendRequest(
			"POST",
			"auth/forgot-password",
			formData,
			"JSON"
		);

		if (error) {
			setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
			return false;
		}

		return data;
	};

	const changePassword = async (e: React.FormEvent) => {
		e.preventDefault();

		const form = e.currentTarget as HTMLFormElement;
		const formInputs = form.elements;

		const formData: any = {};
		let isValid = true;
		// Iterate through form elements
		for (let i = 0; i < formInputs.length; i++) {
			const input = formInputs[i] as HTMLInputElement;

			// Check if the element is an input or textarea
			if (input.tagName === "INPUT") {
				if (input.value === "") isValid = false;

				formData[input.name] = input.value;
			}
		}

		if (!isValid) {
			setNotification({
				message: "Invalid Password",
				status: "ERROR",
				title: "Error",
			});
			return false;
		}

		if (formData.password !== formData.confirmPassword)
			return setNotification({
				message: "Password mis-match",
				status: "ERROR",
				title: "Error",
			});

		const { error, message, data } = await sendRequest(
			"POST",
			"auth/reset-password",
			formData,
			"JSON"
		);

		if (error) {
			setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
			return false;
		}

		router.push("/auth/login");
	};

	return {
		loading: httpIsLoading,
		signInUser,
		signupUser,
		passwordRecovery,
		changePassword,
	};
};

export default useUser;
