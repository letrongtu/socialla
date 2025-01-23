import axios, { AxiosError } from "axios";
import { useMemo, useState } from "react";

const baseURL = "http://localhost:5096/api";

type RequestType = {
  files: File[];
  userId: string;
};

type ResponeType = {
  message: string;
  results: {
    FileUrl: string;
  }[];
} | null;

type Options = {
  onSuccess?: (data: ResponeType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const UseMediaLocalUpload = () => {
  const [data, setData] = useState<ResponeType>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "pending" | "settled" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const localUploadMedia = async (values: RequestType, options?: Options) => {
    try {
      setData(null);
      setError(null);
      setStatus("pending");

      const formData = new FormData();
      values.files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("userId", values.userId);

      const response = await axios.post<ResponeType>(
        `${baseURL}/media/local-multi-upload`,
        formData
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
    localUploadMedia,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
  };
};
