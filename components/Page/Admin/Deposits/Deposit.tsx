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
import TableWrapper from "../../../Wrappers/TableWrapper";
import useDropdown from "../../../../hooks/use-Dropdown";
import DropdownList from "../../../UI/DropdownList";
import useFetcher from "../../../../hooks/use-Fetcher";

import styles from "./Deposit.module.scss";
import NotificationContext from "@/context/notification";
import useHttp from "@/hooks/use-Http";
import { CURRENCY_SYMBOLS } from "@/utils/constants";

const Deposits = ({ data, revaidate }: any) => {
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
		`transactions/deposit/admin?${
			statusQuery?.value ? `status=${statusQuery.value}` : ""
		}${withdrawaIdQuery?.value ? `&withdrawId=${withdrawaIdQuery.value}` : ""}${
			userIdQuery?.value ? `&userId=${userIdQuery.value}` : ""
		}`,
		data.deposits,
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

	const approveDeposit = useCallback(
		async (depositId: string, e: React.MouseEvent<HTMLButtonElement>) => {
			usersEditing.current[`${depositId}`] = true;

			const { error, message, status } = await sendRequest(
				`PUT`,
				`transactions/deposit/admin/approve`,
				{ depositId: depositId },
				"JSON"
			);
			delete usersEditing.current[`${depositId}`];

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
			list.map((deposit: any, idx: number) => {
				return (
					<tr className="size_15" key={idx}>
						<td>
							<div className={styles.img_container}>
								{deposit?.userId?.avatar ? (
									<span className={styles.avatar}>
										<Image
											alt=""
											src={`${deposit?.userId?.avatar}`}
											layout={"fill"}
											objectFit="contain"
										/>
									</span>
								) : (
									<span className={`${styles.text_avatar} size_20 bold`}>
										{deposit.userId?.firstName.slice(0, 1)}
									</span>
								)}
								<span>
									{deposit.userId?.firstName} {deposit.userId?.lastName}
								</span>
							</div>
						</td>
						<td>{moment(deposit.createdAt).format("DD MMM YYYY")}</td>
						<td>
							<span className="naira_curr_font">
								{CURRENCY_SYMBOLS[deposit.userId?.currency as "GBP"]}
							</span>
							{Number(+deposit.amount).toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</td>
						<td>{deposit.currency}</td>
						<td>{deposit.channel}</td>
						<td>{deposit.address}</td>
						<td className={`${styles.approvalStatus} size_12`}>
							<span
								className={`${
									deposit.status === "successfull"
										? styles.approved
										: deposit.status === "failed"
										? styles.declined
										: deposit.status === "pending"
										? styles.pending
										: ""
								}`}>
								{deposit.status}
							</span>
						</td>
						<td>
							<div className={styles.dropdown}>
								<button
									onClick={showDropdown.bind(this, deposit._id)}
									className={`${styles.action_investor} ${
										dropdownId == deposit._id ? styles.active_withdrawal : null
									}`}>
									<BsThreeDotsVertical size={23} />
								</button>

								{dropdownId == deposit._id && (
									<DropdownList style={style}>
										{deposit.status === "pending" && (
											<li>
												<button
													className={`size_15`}
													onClick={approveDeposit.bind(this, deposit._id)}>
													Approve
												</button>
											</li>
										)}
									</DropdownList>
								)}
							</div>
						</td>
						<td className={styles.loader_container}>
							{usersEditing.current[`${deposit._id as number}`] ? (
								<Loader width="20" strokeWidth="3" />
							) : null}
						</td>
					</tr>
				);
			}),
		[list, dropdownId, style, approveDeposit, showDropdown]
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
					Deposits
				</h1>
				<span className="size_18">Track and manage all deposits</span>
			</div>

			<div>
				<form className={`${styles.search_form}`}>
					<SearchInput
						label="Search By deposit Id"
						placeholder="Search Deposits"
						validationFn={(val) => true}
						initRenderUpdate={false}
						focusable={false}
						updateInput={setwithdrawaIdQuery}
					/>
					<SearchInput
						label="Search By User Id"
						placeholder="Search Deposits"
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

export default Deposits;
