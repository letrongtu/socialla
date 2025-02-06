import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { PostType } from "../types";

const BASE_URL = "http://localhost:5096";
const BASE_URL_API = "http://localhost:5096/api";
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

      const response = await axios.get<ResponseType>(`${BASE_URL_API}/post`, {
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

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/postHub`)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        //TODO: Find a way to handle this
        // console.log("SignalR connected");
      })
      .catch((error) => {
        //TODO: Find a way to handle this
        // console.log("SignalR connection error: ", error);
      });

    connection.on("ReceivePostCreate", (post: PostType) => {
      console.log("Here");
      setData((prev) => [post, ...prev]);
    });

    return () => {
      connection
        .stop()
        .then(() => {
          ////TODO: Find a way to handle this
          console.log("SignalR disconnected");
        })
        .catch((error) => {
          //TODO: Find a way to handle this
          console.log("Error stopping SignalR:", error);
        });
    };
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
