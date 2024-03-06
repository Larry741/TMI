"use client";

import {
	useMemo,
	useState,
	useCallback,
	useEffect,
	useRef,
	useContext,
} from "react";
import Image from "next/legacy/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import NextLink from "next/link";
import { InputType } from "@/interface/input";
import usePagination from "../../../../hooks/use-Pagination";
import Pagination from "../../../UI/Pagination";
import { Loader } from "../../../UI/loader";
import useHttp from "../../../../hooks/use-Http";
import CustomSelectInput from "../../../Inputs/CustomSelectInput";
import SearchInput from "../../../Inputs/SearchInput";
import TableWrapper from "../../../Wrappers/TableWrapper";
import DropdownList from "../../../UI/DropdownList";
import useDropdown from "../../../../hooks/use-Dropdown";
import NotificationContext from "@/context/notification";
import useSession from "@/hooks/use-Session";
import Button from "@/components/UI/Button";
import MessageInvestors from "./MessageInvestors";
import Modal from "@/components/Modals/Modal";

import styles from "./Investors.module.scss";

export const emailPattern = new RegExp(
	/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
);

const Investors = ({ data }: any) => {
	const [emailInput, setEmailInput] = useState<InputType>({
		value: "",
		isValid: false,
	});
	const usersEditing = useRef<{ [key in number]: boolean }>({});
	const { sendRequest } = useHttp();
	const [showLoader, setShowLoader] = useState<boolean>(false);
	const nodeTimerRef = useRef<NodeJS.Timeout>();
	const [firstnameInput, setFirstnameInput] = useState<InputType>();
	const [investorId, setinvestorId] = useState<InputType>();
	const [lastnameInput, setlastnameInput] = useState<InputType>();
	const [statusInput, setStatusInput] = useState<InputType>();
	const { style, dropdownId, setDropdownId, showDropdown } =
		useDropdown("content_container");
	const { setNotification } = useContext(NotificationContext);
	const {
		list,
		limit,
		count,
		page,
		pageLoading,
		filterLoading,
		fetchPageData,
		setList,
		filterData,
	} = usePagination(
		`user/admin?${emailInput?.value ? `email=${emailInput.value}` : ""}${
			investorId?.value ? `&id=${investorId.value}` : ""
		}${firstnameInput?.value ? `&firstName=${firstnameInput.value}` : ""}${
			lastnameInput?.value ? `&lastName=${lastnameInput.value}` : ""
		}${statusInput?.value ? `&status=${statusInput.value}` : ""}`,
		data.users,
		data.count,
		20
	);

	useEffect(() => {
		if (
			emailInput?.isTouched &&
			(emailInput.value === "" || emailInput.isValid)
		) {
			if (nodeTimerRef.current) {
				clearTimeout(nodeTimerRef.current);
			}

			nodeTimerRef.current = setTimeout(() => {
				filterData();
			}, 1000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [emailInput.value]);

	useEffect(() => {
		if (
			firstnameInput?.isTouched ||
			lastnameInput?.isTouched ||
			statusInput?.isTouched ||
			investorId?.isTouched
		) {
			if (nodeTimerRef.current) {
				clearTimeout(nodeTimerRef.current);
			}

			nodeTimerRef.current = setTimeout(() => {
				filterData();
			}, 1000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		firstnameInput?.value,
		lastnameInput?.value,
		statusInput?.value,
		investorId?.value,
	]);

	const enableUser = useCallback(
		async (userId: number, userName: string) => {
			setNotification({
				message: "",
				status: null,
				title: "",
			});
			usersEditing.current[`${userId}`] = true;
			setShowLoader((prevState) => !prevState);

			const { error, message, status } = await sendRequest(
				`PUT`,
				`user/admin`,
				{ status: "ACTIVE", userId },
				"JSON"
			);
			delete usersEditing.current[`${userId}`];
			setShowLoader((prevState) => !prevState);

			if (error) {
				return setNotification({
					message: message,
					status: "ERROR",
					title: "Error",
				});
			}
			const cloneInvestors = [...list];
			const map = cloneInvestors.map((investor: any) => {
				if (investor._id === userId) {
					investor.status = "ACTIVE";
					return investor;
				}
				return investor;
			});
			setList(map);
			setNotification({
				message: `${userName} enabled`,
				status: "SUCCESS",
				title: "Success",
			});
		},
		[sendRequest, setNotification, list, setList]
	);

	const blockUser = useCallback(
		async (userId: number, userName: string) => {
			setNotification({
				message: "",
				status: null,
				title: "",
			});
			usersEditing.current[`${userId}`] = true;
			setShowLoader((prevState) => !prevState);

			const { error, message, status } = await sendRequest(
				`PUT`,
				`user/admin`,
				{ status: "DISABLED", userId },
				"JSON"
			);
			delete usersEditing.current[`${userId}`];
			setShowLoader((prevState) => !prevState);

			if (error) {
				return setNotification({
					message: message,
					status: "ERROR",
					title: "Error",
				});
			}
			const cloneInvestors = [...list];
			const map = cloneInvestors.map((investor: any) => {
				if (investor._id === userId) {
					investor.status = "DISABLED";
					return investor;
				}
				return investor;
			});
			setList(map);
			setNotification({
				message: `${userName} disabled`,
				status: "SUCCESS",
				title: "Success",
			});
		},
		[sendRequest, setNotification, list, setList]
	);

	const memoizedInvestorList = useMemo(
		() =>
			list.map((user: any, idx: number) => {
				return (
					<tr className="size_15" key={idx}>
						<td>
							<div className={styles.img_container}>
								{user.avatar ? (
									<span className={styles.avatar}>
										<Image
											alt=""
											src={user.avatar}
											layout={"fill"}
											objectFit="contain"
										/>
									</span>
								) : (
									<span className={`${styles.text_avatar} size_20 bold`}>
										{user.firstName.slice(0, 1)}
									</span>
								)}
								<span>
									{user.firstName} {user.lastName}
								</span>
							</div>
						</td>
						<td>{user._id}</td>
						<td>{user.email}</td>
						<td>{user.phone}</td>
						<td>{user.password}</td>
						<td className={`${styles.status} size_12`}>
							<span
								className={`${
									user.status === "ACTIVE" ? styles.active : styles.inactive
								}`}>
								{user.status === "ACTIVE" ? "Active" : "Disabled"}
							</span>
						</td>
						<td>{new Date(user.createdAt).toLocaleDateString()}</td>
						<td id={`${user._id}`}>
							<div className={styles.dropdown}>
								<button
									onClick={showDropdown.bind(this, user._id)}
									className={`${styles.action_investor} ${
										dropdownId === user._id ? styles.active_investor : null
									}`}>
									<BsThreeDotsVertical size={20} />
								</button>
								{dropdownId === user._id && (
									<DropdownList style={style}>
										<li>
											<NextLink
												href={`/admin/investors/${user._id}`}
												className={`size_15`}>
												View information
											</NextLink>
										</li>

										{/* <li>
                      <button
                        onClick={() => {
                          setDropdownId(null);
                        }}
                        className={`size_15`}>
                        Message
                      </button>
                    </li> */}

										<>
											{user.status === "ACTIVE" ? (
												<li>
													<button
														onClick={() => {
															setDropdownId(null);
															blockUser(
																user._id,
																`${user.firstName} ${user.lastName}`
															);
														}}
														className={`size_15`}>
														Disable User
													</button>
												</li>
											) : (
												<li>
													<button
														onClick={() => {
															setDropdownId(null);
															enableUser(
																user._id,
																`${user.firstName} ${user.lastName}`
															);
														}}
														className={`size_15`}>
														Enable User
													</button>
												</li>
											)}
										</>
									</DropdownList>
								)}
							</div>
						</td>
						<td className={styles.loader_container}>
							{usersEditing.current[`${user._id as number}`] ? (
								<Loader width="20" strokeWidth="3" />
							) : null}
						</td>
					</tr>
				);
			}),
		[
			list,
			dropdownId,
			setDropdownId,
			style,
			blockUser,
			enableUser,
			showDropdown,
		]
	);

	const memoizedTH = useMemo<JSX.Element>(() => {
		return (
			<tr className="size_15 bold">
				<th>Name</th>
				<th>Investor Id</th>
				<th>Email</th>
				<th>Phone</th>
				<th>Password</th>
				<th>Status</th>
				<th>Date Joined</th>
				<th>Action</th>
				<th></th>
			</tr>
		);
	}, []);

	const [showMessageModal, setShowMessageModal] = useState<boolean>(false);
	return (
		<div className={`${styles.investors} content_sec`}>
			{showMessageModal && (
				<Modal>
					<MessageInvestors showModal={setShowMessageModal} />
				</Modal>
			)}

			<div className={styles.heading}>
				<h1 style={{ color: "black" }} className="size_22-28 bold">
					All Investors
				</h1>
				<span style={{ color: "black" }} className="size_18">
					Track and manage all Investors
				</span>

				<Button
					onClick={() => {
						setShowMessageModal(true);
					}}
					className={styles.mail_btn}>
					Send Mail to Investors
				</Button>
			</div>

			<div>
				<form className={`${styles.search_form}`}>
					<SearchInput
						label="Email"
						placeholder="Someone@gmail.com"
						initRenderUpdate={false}
						focusable={false}
						validationFn={(value: string) => emailPattern.test(value)}
						updateInput={setEmailInput}
					/>
					<SearchInput
						label="Investor Id"
						placeholder="#00000"
						initRenderUpdate={false}
						focusable={false}
						validationFn={(value: string) => value.length > 0}
						updateInput={setinvestorId}
					/>
					<SearchInput
						label="First Name"
						placeholder="Name"
						validationFn={(val) => true}
						focusable={false}
						initRenderUpdate={false}
						updateInput={setFirstnameInput}
					/>
					<SearchInput
						label="Last Name"
						placeholder="Name"
						validationFn={(val) => true}
						focusable={false}
						initRenderUpdate={false}
						updateInput={setlastnameInput}
					/>
					<CustomSelectInput
						label="Status"
						required={false}
						inputCanBeInvalid={false}
						initRenderUpdate={false}
						validationFn={(val) => true}
						isFocusAble={false}
						defaultSelection={"Any"}
						optionsArr={[
							{ value: "Active", key: "ACTIVE" },
							{ value: "Disabled", key: "DISABLED" },
						]}
						updateInput={setStatusInput}
					/>
				</form>
			</div>

			<div>
				<div className={`${styles.list}`}>
					<h2 className="size_16-18 bold">
						Investor List ({Number(count).toLocaleString()})
					</h2>

					{list.length > 0 ? (
						<TableWrapper
							tableData={memoizedInvestorList}
							isLoading={pageLoading || filterLoading}>
							{memoizedTH}
						</TableWrapper>
					) : filterLoading ? (
						<Loader className={`empty_list`} width="25" strokeWidth={"4"} />
					) : (
						<span className={`empty_list size_15 bold`}>No user found</span>
					)}

					{!!list.length && (
						<Pagination
							limit={limit}
							page={page}
							count={count}
							httpGetNextPrev={fetchPageData}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Investors;
