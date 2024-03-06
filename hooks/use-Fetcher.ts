import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { AppStoreType } from "../store";
import useHttp, { CustomError } from "./use-Http";

const useFetcher = <T extends object>(url: string) => {
  const { sendGetRequest } = useHttp();
  const [initialLoading, setInitialLoading] = useState<boolean>(
    url ? true : false
  );
  const [revalidating, setRevalidating] = useState<boolean>(false);
  const [error, setError] = useState<CustomError>();
  const [data, setData] = useState<
    { [key in string]: any[] } & {
      count: number;
    }
  >();

  const fetchData = useCallback(async () => {
    const { error, message, status, data } = await sendGetRequest(url);

    if (error) {
      // @ts-ignore
      const error: CustomError = new Error();
      error.status = status;
      error.message = message;
      return setInitialLoading(false), setError(error);
    }

    setInitialLoading(false);
    setData(data);
  }, [sendGetRequest, url]);

  useEffect(() => {
    // Effect for fetching initial data

    if (url) {
      setInitialLoading(true);
      fetchData();
    }
    // eslint-disable-next-line
  }, [url]);

  const revaidate = useCallback(async () => {
    setRevalidating(true);
    await fetchData();
    setRevalidating(false);
  }, [fetchData]);

  return {
    data,
    error,
    isLoading: initialLoading,
    isValidating: revalidating,
    revaidate
  };
};

export default useFetcher;
