import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { PostType } from "../types";

const BASE_URL = "http://localhost:5096";
const BASE_URL_API = "http://localhost:5096/api";
const PAGE_SIZE = 5;

type ResponseType = {
  post: PostType;
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const useGetPost = (postId: string | null) => {
  const [data, setData] = useState<PostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPost = async (postId: string, options?: Options) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_URL_API}/post/${postId}`
      );

      setData(response.data.post);

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
    if (!postId) {
      return;
    }

    fetchPost(postId);
  }, [postId]);

  return {
    data,
    isLoading,
  };
};
