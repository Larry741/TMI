"use client";

import { useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { RiUserSettingsFill } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { BsCameraFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import useSession from "@/hooks/use-Session";
import NameForm from "@/components/Page/Profile/NameForm";
import PasswordForm from "@/components/Page/Profile/Password";
import PreferenceForm from "@/components/Page/Profile/Prefrences";
import ProfilePictureForm from "@/components/Page/Profile/ProfilePicture";
import WalletAddressForm from "@/components/Page/Profile/WalletAddress";
import checkUserAuthentication from "@/components/Hoc/UserProtectedRoute";

import styles from "@/styles/dashboard/profile.module.scss";

const ProfilePage = () => {
	const { data } = useSession();
	const router = useRouter();
	const [tab, setTab] = useState<string>("edit-profile");

	return (
		<DashboardLayout>
			<div className="page-title dashboard">
				<div className="container">
					<div className={`row ${styles.row}`}>
						<div className="">
							<div className="page-title-content">
								<p className="size_20">
									<div style={{ display: "inline-block" }} className="size_20">
										Welcome
									</div>
									<span className={`${styles.user_name} size_20 bold`}>
										{" "}
										{data.firstName}
									</span>
								</p>
							</div>
						</div>
						<div>
							<ul className="text-right breadcrumbs list-unstyle">
								<li>
									<a href="#">User</a>{" "}
								</li>{" "}
								<span
									style={{ margin: "0 .5rem", transform: "translateY(.2rem)" }}>
									/
								</span>{" "}
								<li className="active">
									<a
										onClick={() => {
											router.refresh();
										}}
										href="#">
										Profile
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className="content-body">
				<div className="container">
					<div className="row">
						<div className="col-xl-12">
							<div className="card sub-menu">
								<div className="card-body active">
									<ul className={`d-flex show ${styles.tab_list}`}>
										<li
											onClick={() => setTab("edit-profile")}
											className={`${styles.tab} ${
												tab === "edit-profile" ? styles.active_tab : ""
											} nav-item active size_15`}>
											<RiUserSettingsFill size={24} />
											Edit Profile
										</li>
										<li
											onClick={() => setTab("change-password")}
											className={`${styles.tab} ${
												tab === "change-password" ? styles.active_tab : ""
											} nav-item active size_15`}>
											<FaUserEdit size={24} />
											Change Password
										</li>

										<li
											onClick={() => setTab("preferences")}
											className={`${styles.tab} ${
												tab === "preferences" ? styles.active_tab : ""
											} nav-item active size_15`}>
											<AiOutlineSetting size={24} />
											Preferences
										</li>
										<li
											onClick={() => setTab("upload-picture")}
											className={`${styles.tab} ${
												tab === "upload-picture" ? styles.active_tab : ""
											} nav-item active size_15`}>
											<BsCameraFill size={24} />
											Upload Display Picture
										</li>

										{/* <li
                      onClick={() => setTab("edit-profile")}
                      className={`${styles.tab} ${
                        tab === "edit-profile" ? styles.active_tab : ""
                      } nav-item active size_14`}>
                      <a
                        href="https://cryptnftswap.com/index.php/user/settings_2fa"
                        className="nav-link">
                        <i className="mdi mdi-lock"></i>
                        <span>Setup 2FA</span>
                      </a>
                    </li> */}
									</ul>
								</div>
							</div>

							{tab === "edit-profile" ? (
								<NameForm />
							) : tab === "change-password" ? (
								<PasswordForm />
							) : tab === "preferences" ? (
								<PreferenceForm />
							) : tab === "upload-picture" ? (
								<ProfilePictureForm />
							) : tab === "wallet-address" ? (
								<WalletAddressForm />
							) : null}
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default checkUserAuthentication(ProfilePage);
