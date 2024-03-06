import { useEffect, useMemo, useState } from "react";
import Image from "next/legacy/image";
import moment from "moment";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Loader } from "../../../../UI/loader";
import Pagination from "../../../../UI/Pagination";
import usePagination from "../../../../../hooks/use-Pagination";
import Modal from "../../../../Modals/Modal";
import TableWrapper from "../../../../Wrappers/TableWrapper";
import useFetcher from "../../../../../hooks/use-Fetcher";
import useSession from "@/hooks/use-Session";
import useDropdown from "../../../../../hooks/use-Dropdown";
import DropdownList from "../../../../UI/DropdownList";

import styles from "./TransactionsTable.module.scss";

let initialLimit = 20;
const TransactionsTable = ({ userId }: { userId: number }) => {
  const { data: sessionData } = useSession();
  const [dataIsFetched, setDataIsFetched] = useState<boolean>(false);
  const {
    data: transactionsData,
    error: transactionsError,
    isLoading
  } = useFetcher(!dataIsFetched ? `$?limit=${initialLimit}` : "");
  const [transactType, setTransactType] = useState<any>("");
  const { style, dropdownId, setDropdownId, showDropdown } =
    useDropdown("content_container");
  const {
    list,
    limit,
    count,
    page,
    pageLoading,
    filterLoading,
    filterData,
    fetchPageData
  } = usePagination(
    `$?type=${transactType}`,
    transactionsData?.transactions!,
    transactionsData?.count!,
    initialLimit
  );
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [statementGenerated, setStatementGenerated] = useState<boolean>(false);
  const [showGenerateStatementModal, setShowGenerateStatementModal] =
    useState<boolean>(false);
  const loading = isLoading || pageLoading || filterLoading;

  useEffect(() => {
    if (isFiltered) {
      filterData();
    }
  }, [isFiltered, filterData]);

  const transactionList = useMemo(() => list || [], [list]);

  const memoizedList = useMemo(
    () =>
      transactionList.map((transact: any, idx) => {
        return (
          <tr className="size_15" key={idx}>
            <td>{transact.reference}</td>
            <td>
              <span className="naira_curr_font">&#8358;</span>
              {Number(transact?.amount)?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </td>
            <td>{moment(transact.date).format("Do MMM YYYY")}</td>
            <td>{transact.type}</td>
            <td>{transact.description}</td>
            <td className={`${styles.status} size_12`}>
              <span
                className={`${
                  transact.status === "success"
                    ? styles.completed
                    : transact.status === "pending"
                    ? styles.pending
                    : styles.failed
                }`}>
                {transact.status}
              </span>
            </td>
            <td>
              <div className={styles.dropdown}>
                <button
                  onClick={showDropdown.bind(this, transact.id)}
                  className={`${styles.action_investor} ${
                    dropdownId == transact.id ? styles.active_investor : null
                  }`}>
                  <BsThreeDotsVertical size={28} />
                </button>

                {dropdownId == transact.id && (
                  <DropdownList style={style}>
                    <li className={`${styles.dropdown_listitem}`}>
                      <div
                        onClick={() => {}}
                        className={`${styles.listItem_control} size_15`}>
                        Resend Notification
                      </div>
                    </li>
                    <li className={`${styles.dropdown_listitem}`}>
                      <div
                        onClick={() => {}}
                        className={`${styles.listItem_control} size_16`}>
                        Print
                      </div>
                    </li>
                  </DropdownList>
                )}
              </div>
            </td>
          </tr>
        );
      }),
    [showDropdown, style, transactionList, dropdownId]
  );

  const memoizedTH = useMemo(() => {
    return (
      <tr className="size_15 bold">
        <th>Serial No</th>
        <th>Amount</th>
        <th>Date</th>
        <th>Type</th>
        <th>Description</th>
        <th>Status</th>
        <td>Actions</td>
      </tr>
    );
  }, []);

  if (transactionsError) {
    return (
      <div className={styles.transaction_control}>
        <span className={`empty_list size_15 bold`}>
          Error fetching user Transaction
        </span>
      </div>
    );
  }

  return (
    <div className={styles.transactions_container}>
      <nav className={`${styles.navbar} size_16 bold`}>
        <button
          className={`${
            transactType === "" ? styles.active_nav : null
          } size_16 bold`}
          disabled={transactType === ""}
          onClick={() => {
            setTransactType("");
            setIsFiltered(true);
          }}>
          All
        </button>
        <button
          className={`${
            transactType === "credit" ? styles.active_nav : null
          } size_16 bold`}
          disabled={transactType === "credit"}
          onClick={() => {
            setTransactType("credit");
            setIsFiltered(true);
          }}>
          Credit
        </button>
        <button
          className={`${
            transactType === "debit" ? styles.active_nav : null
          } size_16 bold`}
          disabled={transactType === "debit"}
          onClick={() => {
            setTransactType("debit");
            setIsFiltered(true);
          }}>
          Debit
        </button>
      </nav>

      <>
        {!loading ? (
          <>
            {memoizedList.length ? (
              <>
                <TableWrapper
                  tableData={memoizedList}
                  isLoading={pageLoading || filterLoading}>
                  {memoizedTH}
                </TableWrapper>
              </>
            ) : filterLoading ? (
              <Loader className={`empty_state`} width="25" strokeWidth={"4"} />
            ) : (
              <span className={`empty_loader_container size_15 bold`}>
                No transactions found
              </span>
            )}
          </>
        ) : (
          <Loader className="empty_state" width="25" strokeWidth={"4"} />
        )}

        {!!list.length && !isLoading && (
          <Pagination
            limit={limit}
            page={page}
            count={count}
            httpGetNextPrev={fetchPageData}
          />
        )}
      </>
    </div>
  );
};

export default TransactionsTable;
