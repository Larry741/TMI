import {
	useState,
	useMemo,
	useEffect,
	useContext,
	useRef,
	useCallback,
} from "react";
import Image from "next/legacy/image";
import { Loader } from "../../../UI/loader";
import Paginate from "../../../UI/Pagination";
import usePagination from "../../../../hooks/use-Pagination";
import { BsThreeDotsVertical } from "react-icons/bs";
import moment from "moment";
import SearchInput from "../../../Inputs/SearchInput";
import CustomSelectInput from "../../../Inputs/CustomSelectInput";
import { InputType } from "@/interface/input";
import Modal from "../../../Modals/Modal";
// import WithdrawalDetails from "./WithdrawalDetails/WithdrawalDetails";
import TableWrapper from "../../../Wrappers/TableWrapper";
import useDropdown from "../../../../hooks/use-Dropdown";
import DropdownList from "../../../UI/DropdownList";
import useFetcher from "../../../../hooks/use-Fetcher";

import styles from "./Withdrawals.module.scss";
// import { investValueIcon, waveyMoney } from "helpers/image-paths";
import NotificationContext from "@/context/notification";
import useHttp from "@/hooks/use-Http";
import { CURRENCY_SYMBOLS } from "@/utils/constants";

const Withdrawals = ({ data, revaidate }: any) => {
	const { httpIsLoading, sendRequest } = useHttp();
	const usersEditing = useRef<{ [key in string]: boolean }>({});
	const [withdrawaIdQuery, setwithdrawaIdQuery] = useState<InputType>({
		value: "",
		isValid: false,
		isTouched: false,
	});
	const [userIdQuery, setUserIdQuery] = useState<InputType>({
		value: "",
		isValid: false,
		isTouched: false,
	});
	const [statusQuery, setStatusQuery] = useState<InputType>({
		value: "",
		isValid: false,
		isTouched: false,
	});
	const { setNotification } = useContext(NotificationContext);
	const {
		list,
		limit,
		count,
		page,
		pageLoading,
		filterLoading,
		setList,
		filterData,
		fetchPageData,
	} = usePagination(
		`transactions/withdrawal/admin?${
			statusQuery?.value ? `status=${statusQuery.value}` : ""
		}${withdrawaIdQuery?.value ? `&withdrawId=${withdrawaIdQuery.value}` : ""}${
			userIdQuery?.value ? `&userId=${userIdQuery.value}` : ""
		}`,
		data.withdrawals,
		data.count,
		20
	);
	const nodeTimerRef = useRef<NodeJS.Timeout>();
	const { style, dropdownId, setDropdownId, showDropdown } = useDropdown();

	useEffect(() => {
		if (
			withdrawaIdQuery.isTouched ||
			statusQuery?.isTouched ||
			userIdQuery?.isTouched
		) {
			if (nodeTimerRef.current) {
				clearTimeout(nodeTimerRef.current);
			}
			nodeTimerRef.current = setTimeout(() => {
				filterData();
			}, 500);
		}
	}, [withdrawaIdQuery?.value, statusQuery?.value, userIdQuery?.value]); // eslint-disable-line react-hooks/exhaustive-deps

	const approveWithdrawal = useCallback(
		async (withdrawalId: string, e: React.MouseEvent<HTMLButtonElement>) => {
			usersEditing.current[`${withdrawalId}`] = true;

			const { error, message, status } = await sendRequest(
				`PUT`,
				`transactions/withdrawal/admin/approve`,
				{ withdrawalId: withdrawalId },
				"JSON"
			);
			delete usersEditing.current[`${withdrawalId}`];

			if (error) {
				return setNotification({
					message: message,
					status: "ERROR",
					title: "Error",
				});
			}
			setNotification({
				message: "Withdrawal approved",
				status: "SUCCESS",
				title: "Success",
			});

			revaidate();
		},
		[sendRequest, setNotification, revaidate]
	);

	const memoizedList = useMemo(
		() =>
			list.map((withdrawal: any, idx: number) => {
				return (
					<tr className="size_15" key={idx}>
						<td>
							<div className={styles.img_container}>
								{withdrawal?.userId.avatar ? (
									<span className={styles.avatar}>
										<Image
											alt=""
											src={`${withdrawal?.userId.avatar}`}
											layout={"fill"}
											objectFit="contain"
										/>
									</span>
								) : (
									<span className={`${styles.text_avatar} size_20 bold`}>
										{withdrawal.userId.firstName.slice(0, 1)}
									</span>
								)}
								<span>
									{withdrawal.userId.firstName} {withdrawal.userId.lastName}
								</span>
							</div>
						</td>
						<td>{moment(withdrawal.createdAt).format("DD MMM YYYY")}</td>
						<td>
							<span className="naira_curr_font">
								{CURRENCY_SYMBOLS[withdrawal.userId?.currency as "GBP"]}
							</span>
							{Number(+withdrawal.amount).toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</td>
						<td>{withdrawal.currency}</td>
						<td>{withdrawal.channel}</td>
						<td>{withdrawal.address}</td>
						<td className={`${styles.approvalStatus} size_12`}>
							<span
								className={`${
									withdrawal.status === "successfull"
										? styles.approved
										: withdrawal.status === "failed"
										? styles.declined
										: withdrawal.status === "pending"
										? styles.pending
										: ""
								}`}>
								{withdrawal.status}
							</span>
						</td>
						<td>
							<div className={styles.dropdown}>
								<button
									onClick={showDropdown.bind(this, withdrawal._id)}
									className={`${styles.action_investor} ${
										dropdownId == withdrawal._id
											? styles.active_withdrawal
											: null
									}`}>
									<BsThreeDotsVertical size={23} />
								</button>

								{dropdownId == withdrawal._id && (
									<DropdownList style={style}>
										{withdrawal.status === "pending" && (
											<li>
												<button
													className={`size_15`}
													onClick={approveWithdrawal.bind(
														this,
														withdrawal._id
													)}>
													Approve
												</button>
											</li>
										)}
									</DropdownList>
								)}
							</div>
						</td>
						<td className={styles.loader_container}>
							{usersEditing.current[`${withdrawal._id as number}`] ? (
								<Loader width="20" strokeWidth="3" />
							) : null}
						</td>
					</tr>
				);
			}),
		[list, dropdownId, style, approveWithdrawal, showDropdown]
	);

	const memoizedTH = useMemo(() => {
		return (
			<tr className="size_15 bold">
				<th>Name</th>
				<th>Date</th>
				<th>Amount</th>
				<th>currency</th>
				<th>Channel</th>
				<th>address</th>
				<th>status</th>
				<th>Actions</th>
				<th></th>
			</tr>
		);
	}, []);

	return (
		<div className={`${styles.withdrawals}`}>
			<div className={styles.heading}>
				<h1 style={{ color: "black" }} className="size_22-28 bold">
					Withdrawals
				</h1>
				<span className="size_18">Track and manage all withdrawal</span>
			</div>

			<div>
				<form className={`${styles.search_form}`}>
					<SearchInput
						label="Search By Withdraw Id"
						placeholder="Search Withdrawals"
						validationFn={(val) => true}
						initRenderUpdate={false}
						focusable={false}
						updateInput={setwithdrawaIdQuery}
					/>
					<SearchInput
						label="Search By User Id"
						placeholder="Search Withdrawals"
						validationFn={(val) => true}
						initRenderUpdate={false}
						focusable={false}
						updateInput={setUserIdQuery}
					/>
					<CustomSelectInput
						label="Status"
						validationFn={(val) => true}
						initRenderUpdate={false}
						isFocusAble={false}
						optionsArr={[
							{ key: "", value: "Any" },
							{ key: "pending", value: "Pending" },
							{ key: "successfull", value: "Approved" },
							{ key: "failed", value: "Failed" },
						]}
						updateInput={setStatusQuery}
					/>
				</form>
			</div>

			<div>
				<div className={`${styles.withdraw_control}`}>
					<div className={`${styles.heading}`}>
						<h2 style={{ color: "black" }} className="size_16-18 bold">
							Requests ({Number(count).toLocaleString()})
						</h2>
					</div>

					{list.length > 0 ? (
						<TableWrapper
							tableData={memoizedList}
							isLoading={filterLoading || pageLoading}>
							{memoizedTH}
						</TableWrapper>
					) : filterLoading ? (
						<Loader className={`empty_list`} width="25" strokeWidth={"4"} />
					) : (
						<span className={`empty_list size_15 bold`}>
							No Withdrawals found
						</span>
					)}

					{!!list.length && (
						<Paginate
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

export default Withdrawals;
