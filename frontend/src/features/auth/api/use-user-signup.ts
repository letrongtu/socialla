import axios, { Axios, AxiosError } from "axios";
import { useMemo, useState } from "react";

const baseURL = "https://socialla.azurewebsites.net/api";

type RequestType = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | undefined;
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

export const UseUserSignUp = () => {
  const [data, setData] = useState<ResponeType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "pending" | "settled" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const signUp = async (values: RequestType, options?: Options) => {
    try {
      setData(null);
      setError(null);
      setStatus("pending");

      const response = await axios.post<ResponeType>(
        `${baseURL}/account/sign-up`,
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
    signUp,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
  };
};
