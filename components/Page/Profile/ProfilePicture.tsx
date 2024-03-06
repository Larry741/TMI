import Button from "@/components/UI/Button";
import { Loader } from "@/components/UI/loader";
import NotificationContext from "@/context/notification";
import { avatar } from "@/helpers/image-imports";
import useHttp from "@/hooks/use-Http";
import { useInput } from "@/hooks/use-Input";
import useSession from "@/hooks/use-Session";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { userSliceActions } from "@/store/userSlice";

import styles from "@/styles/dashboard/profile.module.scss";

const ProfilePictureForm = () => {
	const { data, status } = useSession();
	const dispatch = useDispatch();
	const { httpIsLoading, sendRequest } = useHttp();
	const { setNotification } = useContext(NotificationContext);

	const httpUpdateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;

		// @ts-ignore
		const file: File = form.elements[0]?.files[0];

		if (!file) return;
		const formData = new FormData();
		formData.append("avatar", file);

		const { error, message, data, status } = await sendRequest(
			"PUT",
			"user/profile-upload",
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

		setNotification({
			message: `${message}`,
			status: "SUCCESS",
			title: "Success",
		});
		console.log(data);
		dispatch(userSliceActions.updateUserDetails({ avatar: data.avatar }));
	};

	return (
		<div className="col-xl-12">
			<div className="row">
				<div className="col-xl-6 col-md-6">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title ">User Profile</h4>
						</div>
						<div className="card-body">
							<form onSubmit={httpUpdateUser}>
								<div className="form-row">
									<div className="form-group col-xl-12">
										<div className="media align-items-center mb-3">
											<Image
												src={data?.avatar ?? avatar}
												style={{ borderRadius: "50%", background: "#606B8A" }}
												alt=""
												width={50}
												height={50}
												className="mr-3 rounded-circle mr-0 mr-sm-3"
											/>

											<div className="media-body">
												<h5
													style={{ textTransform: "capitalize" }}
													className="mb-0 size_16 bold">
													{data.firstName} {data.lastName}
												</h5>
												<p className={`${styles.email_color} size_14 mb-0`}>
													{data.email}
												</p>
											</div>
										</div>
										<div
											className="file-upload-wrapper size_16"
											data-text="Change Photo">
											<input
												name="avatar"
												type="file"
												className="file-upload-field"
												accept="image/*"
												required
											/>
										</div>
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

export default ProfilePictureForm;
