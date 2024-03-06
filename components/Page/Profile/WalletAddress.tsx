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

const WalletAddressForm = () => {
	const { data, status } = useSession();
	const { httpIsLoading, sendRequest } = useHttp();
	const { setNotification } = useContext(NotificationContext);
	const dispatch = useDispatch();
	const { enteredValue: newWalletVal, valueChangeHandler: newWalletHandler } =
		useInput(() => true, "");
	const {
		enteredValue: confirmNewWalletVal,
		valueChangeHandler: confirmNewWalletHandler,
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
		if (formData.walletAddress !== formData.confirmWallet) {
			return setNotification({
				message: `Wallet address does not match`,
				status: "ERROR",
				title: "Error",
			});
		}

		delete formData.confirmWallet;
		delete formData.oldWallet;

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
							<h4 className="card-title">Set Withdrawal Wallet Address</h4>
						</div>
						<div className="card-body">
							<form onSubmit={httpUpdateUser}>
								<div className="form-row">
									{data.walletAddress ? (
										<div className="form-group col-xl-12">
											<label className="mr-sm-2">Old Wallet Address</label>
											<input
												type="text"
												style={{ backgroundColor: "#000" }}
												className="form-control"
												name="oldWallet"
												value={data.walletAddress}
												placeholder="No wallet Address Set yet"
												readOnly
												required
											/>
										</div>
									) : (
										""
									)}

									<div className="form-group col-xl-12">
										<label className="mr-sm-2">New Wallet Address</label>
										<input
											type="text"
											name="walletAddress"
											className="form-control"
											placeholder="New Wallet Address"
											value={newWalletVal}
											onChange={newWalletHandler}
											required
										/>
									</div>

									<div className="form-group col-xl-12">
										<label className="mr-sm-2">
											Confirm New Wallet Address
										</label>
										<input
											type="text"
											name="confirmWallet"
											className="form-control"
											placeholder="Confirm New Wallet Address"
											value={confirmNewWalletVal}
											onChange={confirmNewWalletHandler}
											required
										/>
									</div>

									<div className="form-group col-12">
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

export default WalletAddressForm;
