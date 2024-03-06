import Button from "@/components/UI/Button";
import { Loader } from "@/components/UI/loader";
import NotificationContext from "@/context/notification";
import useHttp from "@/hooks/use-Http";
import { useInput } from "@/hooks/use-Input";
import useSession from "@/hooks/use-Session";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { userSliceActions } from "@/store/userSlice";

import styles from "@/styles/dashboard/profile.module.scss";

const PasswordForm = () => {
	const { data, status } = useSession();
	const { setNotification } = useContext(NotificationContext);
	const { httpIsLoading, sendRequest } = useHttp();
	const dispatch = useDispatch();
	const { enteredValue: passwordVal, valueChangeHandler: passwordHandler } =
		useInput(() => true, "");
	const {
		enteredValue: newPasswordVal,
		valueChangeHandler: newPasswordHandler,
	} = useInput(() => true, "");
	const {
		enteredValue: confirmNewPasswordVal,
		valueChangeHandler: confirmNewPasswordHandler,
	} = useInput(() => true, "");

	const httpUpdateUser = async (e: React.FormEvent) => {
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
			return setNotification({
				message: `Invalid form details`,
				status: "ERROR",
				title: "Error",
			});
		}
		if (newPasswordVal !== confirmNewPasswordVal) {
			return setNotification({
				message: `Passwords do not match`,
				status: "ERROR",
				title: "Error",
			});
		}

		delete formData.confirmNewPassword;

		const { error, message, status } = await sendRequest(
			"PUT",
			"user",
			formData,
			"JSON"
		);

		if (error) {
			return setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
		}

		setNotification({
			message: `${message}`,
			status: "SUCCESS",
			title: "Success",
		});
		dispatch(userSliceActions.updateUserDetails(formData));
	};

	return (
		<div className="col-xl-12">
			<div className="row">
				<div className="col-xl-6 col-md-6">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Change Password</h4>
						</div>
						<div className="card-body">
							<form onSubmit={httpUpdateUser}>
								<div className="form-row">
									<div className="form-group col-xl-12">
										<label className="mr-sm-2">Old Password</label>
										<input
											type="password"
											name="oldPassword"
											className="form-control"
											placeholder="Old Password"
											required
											onChange={passwordHandler}
											value={passwordVal}
										/>
									</div>

									<div className="form-group col-xl-12">
										<label className="mr-sm-2">New Password</label>
										<input
											type="password"
											name="password"
											className="form-control"
											placeholder="New Password"
											required
											onChange={newPasswordHandler}
											value={newPasswordVal}
										/>
									</div>

									<div className="form-group col-xl-12">
										<label className="mr-sm-2">Confirm New Password</label>
										<input
											type="password"
											name="confirmNewPassword"
											className="form-control"
											placeholder="Confirm New Password"
											required
											onChange={confirmNewPasswordHandler}
											value={confirmNewPasswordVal}
										/>
									</div>

									<div
										style={{ marginTop: "2.3rem" }}
										className="form-group col-12">
										<Button
											showLoader={httpIsLoading}
											className={styles.proceed_btn}
											type="submit">
											Save
										</Button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PasswordForm;
