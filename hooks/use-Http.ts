import { useCallback, useState } from "react";
import { TOKEN_KEY } from "@/store/userSlice";

export interface CustomResponse {
  message: any;
  status: number;
}
export class CustomError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super();
    this.message = message;
    this.status = status;
  }
}

export type Method = "POST" | "PATCH" | "DELETE" | "PUT";
type reqData = "FORMDATA" | "JSON";

const useHttp = () => {
  const [httpIsLoading, setHttpIsLoading] = useState(false);

  const sendRequest = useCallback(
    async (
      method: Method,
      url: string,
      data: any,
      dataType: reqData
    ): Promise<{
      error: boolean;
      message: string;
      data: any;
      status: number;
    }> => {
      setHttpIsLoading(true);
      let reqData = data;
      if (dataType !== "FORMDATA") reqData = JSON.stringify(data);

      let headers = new Headers({});
      if (dataType !== "FORMDATA") {
        headers.append("Content-type", "application/json");
      }
      const token = sessionStorage.getItem(TOKEN_KEY);
      headers.append("Authorization", `Bearer ${token}`);

      try {
        const response = await fetch(`/api/${url}`, {
          method: method,
          headers,
          body: reqData,
          credentials: "include"
        });
        const res = await response.json();

        if (!response.ok) {
          throw new CustomError(res.error, response.status);
        }
        setHttpIsLoading(false);

        return {
          error: false,
          message: res.message,
          data: res.data,
          status: response.status
        };
      } catch (err: any) {
        setHttpIsLoading(false);

        return {
          error: true,
          message: err?.message,
          data: {},
          status: err?.status
        };
      }
    },
    []
  );

  const sendGetRequest = useCallback(
    async (
      url: string
    ): Promise<{
      error: boolean;
      message: string;
      data: any;
      status: number;
    }> => {
      setHttpIsLoading(true);
      const token = sessionStorage.getItem(TOKEN_KEY);

      let headers = new Headers({});
      headers.append("Authorization", `Bearer ${token}`);

      try {
        const response = await fetch(`/api/${url}`, {
          method: "GET",
          headers,
          credentials: "include"
        });
        const res = await response.json();

        if (!response.ok) {
          throw new CustomError(res.error, response.status);
        }
        setHttpIsLoading(false);

        return {
          error: false,
          message: res.message,
          data: res.data,
          status: response.status
        };
      } catch (err: any) {
        setHttpIsLoading(false);

        return {
          error: true,
          message: err?.message,
          data: {},
          status: err?.status
        };
      }
    },
    []
  );

  return {
    httpIsLoading,
    sendRequest,
    sendGetRequest
  };
};

export default useHttp;
