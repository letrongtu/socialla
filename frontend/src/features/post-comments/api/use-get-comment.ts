import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { CommentType } from "../types";

const BASE_URL = "https://socialla.azurewebsites.net";
const BASE_URL_API = "https://socialla.azurewebsites.net/api";
const PAGE_SIZE = 5;

type ResponseType = {
  comment: CommentType;
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const useGetComment = (commentId: string | null) => {
  const [data, setData] = useState<CommentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPost = async (commentId: string, options?: Options) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_URL_API}/comment/${commentId}`
      );

      setData(response.data.comment);

      options?.onSuccess?.(response.data);

      return response;
    } catch (error) {
      options?.onError?.(error as AxiosError);
    } finally {
      options?.onSettled?.();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!commentId) {
      return;
    }

    fetchPost(commentId);
  }, [commentId]);

  return {
    data,
    isLoading,
  };
};
