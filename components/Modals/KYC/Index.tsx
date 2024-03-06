import { Dispatch, useContext } from "react";

import styles from "../ModalBodyCard.module.scss";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { checkIcon, exclamationIcon } from "@/helpers/image-imports";
import useSession from "@/hooks/use-Session";
import Button from "@/components/UI/Button";
import useHttp from "@/hooks/use-Http";
import NotificationContext from "@/context/notification";
import { useDispatch } from "react-redux";
import { userSliceActions } from "@/store/userSlice";

interface Props {
	showModal: Dispatch<boolean>;
}

const KYC = ({ showModal }: Props) => {
	const { data } = useSession();
	const dispatch = useDispatch();
	const { setNotification } = useContext(NotificationContext);
	const { httpIsLoading, sendRequest } = useHttp();

	const httpSubmitKYC = async (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		const formInputs = form.elements;

		const formData = new FormData();
		let isValid = true;
		// Iterate through form elements
		for (let i = 0; i < formInputs.length; i++) {
			const input = formInputs[i] as HTMLInputElement;

			// Check if the element is an input or textarea
			if (input.tagName === "INPUT" || input.tagName === "SELECT") {
				if (input.value === "") isValid = false;
				if (input.name === "email") continue;

				if (input.name === "file1") {
					formData.append("frontId", input?.files![0]);
				} else if (input.name === "file2") {
					formData.append("frontId", input?.files![0]);
				} else {
					formData.append(input.name, input.value);
				}
			}
		}

		if (!isValid) {
			return setNotification({
				message: `Please fill out the form`,
				status: "ERROR",
				title: "Error",
			});
		}

		const { error, message, status } = await sendRequest(
			"POST",
			"user/kyc",
			formData,
			"FORMDATA"
		);

		if (error) {
			return setNotification({
				message: `${message}`,
				status: "ERROR",
				title: "Error",
			});
		}

		dispatch(userSliceActions.updateUserDetails({ isKYCVerified: true }));
		showModal(false);
	};

	return (
		<>
			<div className={styles.edit_project}>
				<div className={styles.header}>
					<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
						<div className={styles.check_icon}>
							<Image
								src={exclamationIcon}
								width="20"
								height={"20"}
								alt="Return"
							/>
						</div>
						<span className="size_17 bold">Upload your ID Card</span>
					</div>

					<button className={styles.close_cta} onClick={() => showModal(false)}>
						<IoClose size={28} />
					</button>
				</div>

				<form onSubmit={httpSubmitKYC}>
					<div className="identity-content size_15">
						<span>(Driving License or Government ID card)</span>

						<p>
							Uploading your ID helps us ensure the safety and security of your
							funds
						</p>
					</div>

					<div className="form-group">
						<label className="mr-sm-2 size_15">Email</label>
						<div className="input-group mb-3">
							<input
								type="text"
								style={{ backgroundColor: "#000" }}
								name="email"
								value={data.email!}
								className="form-control"
								readOnly
								required
							/>
						</div>
					</div>

					<div className="form-group">
						<label className="mr-sm-2 size_15">
							Document Type: <small>E.g Drivers License, Passport etc</small>
						</label>
						<div className="input-group mb-3">
							<select name="documentType" className="form-control">
								<option value="Drivers License">Drivers License</option>
								<option value="Passport">Passport</option>
								<option value="National ID">National ID</option>
								<option value="Voters Card">Voters Card</option>
							</select>
						</div>
					</div>

					<div className="form-group">
						<label className="mr-sm-2 size_15">Upload Front ID </label>
						<br />
						<input
							name="file1"
							type="file"
							className="file-upload-field size_15"
							required
						/>
					</div>

					<div className="form-group">
						<label className="mr-sm-2 size_15">Upload Back ID </label>
						<br />
						<input
							name="file2"
							type="file"
							className="file-upload-field size_15"
							required
						/>
					</div>

					<Button showLoader={httpIsLoading} type="submit">
						Submit
					</Button>
				</form>
			</div>
		</>
	);
};

export default KYC;
