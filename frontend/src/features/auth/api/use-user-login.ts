import axios, { AxiosError } from "axios";
import { useMemo, useState } from "react";

const api = "http://localhost:5096/api/";

type RequestType = {
  email: string;
  password: string;
};

type ResponeType = {
  message: string;
  userId: number;
  token: string;
} | null;

type Options = {
  onSuccess?: (data: ResponeType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const UseUserLogin = () => {
  const [data, setData] = useState<ResponeType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "pending" | "settled" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const login = async (values: RequestType, options?: Options) => {
    try {
      setData(null);
      setError(null);
      setStatus("pending");

      const response = await axios.post<ResponeType>(
        api + "account/login",
        values
      );

      options?.onSuccess?.(response.data);

      return response;
    } catch (error) {
      setStatus("error");
      options?.onError?.(error as AxiosError);
    } finally {
      setStatus("settled");
      options?.onSettled?.();
    }
  };

  return {
    login,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
  };
};
