import { useState, useCallback, useEffect, useRef, useContext } from "react";
import useHttp from "./use-Http";
import NotificationContext from "@/context/notification";

const usePagination = <T extends object>(
  url: string,
  dataList: T[],
  dataListCount: number,
  fetchLimit: number
) => {
  const [list, setList] = useState<T[]>(dataList?.length ? dataList : []);
  const [limit, setLimit] = useState<number>(fetchLimit);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(dataListCount ?? 0);
  const { httpIsLoading: pageLoading, sendGetRequest: sendGetPageRequest } =
    useHttp();
  const { httpIsLoading: filterLoading, sendGetRequest: sendGetFilterRequest } =
    useHttp();
  const { setNotification } = useContext(NotificationContext);
  const firstRenderRef = useRef<number>(0);

  useEffect(() => {
    if (firstRenderRef.current === 0) {
      ++firstRenderRef.current;
      return;
    }
    setList(dataList?.length ? dataList : []);
    setCount(dataListCount);
  }, [dataList, dataListCount]);

  const fetchPageData = useCallback(
    async (page: number, subLimit?: number) => {
      const skip = limit * (page - 1);
      const { error, message, status, data } = await sendGetPageRequest(
        `${url}${skip > 0 ? `&skip=${skip}` : ""}&limit=${
          subLimit ? subLimit : limit
        }`
      );

      if (error) {
        return setNotification({
          message: message,
          status: "ERROR",
          title: "Error"
        });
      }

      if (data?.users) setList(data.users);
      if (data?.withdrawals) setList(data.withdrawals);
      if (data?.deposits) setList(data.deposits);
      setCount(data.count);
      setPage(page);
    },
    [limit, url, setNotification, sendGetPageRequest]
  );

  const filterData = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const { error, message, status, data } = await sendGetFilterRequest(
        `${url}${url.includes("?") ? "&" : "?"}limit=${limit}`
      );

      if (error) {
        setNotification({
          message: message,
          status: "ERROR",
          title: "Error"
        });
        return { error: error };
      }

      if (data?.users) setList(data.users);
      if (data?.withdrawals) setList(data.withdrawals);
      if (data?.deposits) setList(data.deposits);
      setCount(data.count);
      setPage(1);
    },
    [url, limit, setNotification, sendGetFilterRequest]
  );

  const resetList = useCallback(() => {
    setList(dataList);
    setCount(dataListCount);
    setPage(1);
  }, [dataList, dataListCount]);

  return {
    list,
    limit,
    page,
    count,
    pageLoading,
    filterLoading,
    setPage,
    setList,
    setLimit,
    setCount,
    resetList: resetList,
    filterData,
    fetchPageData
  };
};

export default usePagination;
