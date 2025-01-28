import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { PostType } from "../types";

const BASE_URL = "http://localhost:5096/api";
const PAGE_SIZE = 5;

type ResponseType = {
  posts: PostType[];
  totalPosts: number;
  hasNextPage: boolean;
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const UseGetPosts = () => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [data, setData] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async (pageNumber: number, options?: Options) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(`${BASE_URL}/post`, {
        params: { pageNumber, pageSize: PAGE_SIZE },
      });

      setData((previousData) => [...previousData, ...response.data.posts]);
      setCanLoadMore(response.data.hasNextPage);

      options?.onSuccess?.(response.data);

      return response;
    } catch (error) {
      options?.onError?.(error as AxiosError);
    } finally {
      options?.onSettled?.();
      setIsLoading(false);
    }
  };

  //fetch the first page when mounted
  useEffect(() => {
    fetchPosts(1);
  }, []);

  const loadMore = async (options?: Options) => {
    // prevent duplicate requests
    if (!canLoadMore || isLoading) return;

    const nextPage = currentPageNumber + 1;
    await fetchPosts(nextPage);
    setCurrentPageNumber(nextPage);
  };

  return {
    data,
    isLoading,
    canLoadMore,
    loadMore,
  };
};
