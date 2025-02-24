import axios, { AxiosError } from "axios";
import { useMemo, useState } from "react";

const baseURL = "https://socialla.azurewebsites.net/api";

type RequestType = {
  id: string;
};

type ResponseType = {
  message: string;
  commentId: string;
} | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const UseDeletePost = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "pending" | "settled" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutate = async (values: RequestType, options?: Options) => {
    try {
      setData(null);
      setError(null);
      setStatus("pending");

      const response = await axios.delete<ResponseType>(
        `${baseURL}/post/${values.id}`
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
    mutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
  };
};
