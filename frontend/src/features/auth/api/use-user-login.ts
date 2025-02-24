import axios, { AxiosError } from "axios";
import { useMemo, useState } from "react";

const baseURL = "https://socialla.azurewebsites.net/api";

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
  const [status, setStatus] = useState<
    "success" | "error" | "pending" | "settled" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const login = async (values: RequestType, options?: Options) => {
    try {
      setStatus("pending");

      const response = await axios.post<ResponeType>(
        `${baseURL}/account/login`,
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
    isPending,
    isSuccess,
    isError,
    isSettled,
  };
};
