import axios, { AxiosError } from "axios";
import { useMemo, useState } from "react";

const baseURL = "https://socialla.azurewebsites.net/api";

type RequestType = {
  reaction: string;
  userId: string;
  postId: string;
  commentId: string;
};

type ResponseType = {
  message: string;
  reactionId: string;
} | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const UseUpdateCommentReaction = () => {
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

      const response = await axios.put<ResponseType>(
        `${baseURL}/comment-reaction`,
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
    mutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
  };
};
