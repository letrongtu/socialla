import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { CommentType } from "../types";
import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5096";
const BASE_API_URL = "http://localhost:5096/api";
const PAGE_SIZE = 5;

type ResponseType = {
  comments: CommentType[];
  totalComments: number;
  hasNextPage: boolean;
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const UseGetCommentsByPostId = (
  postId: string,
  sortBy: string = "top"
) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [data, setData] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async (
    postId: string,
    pageNumber: number,
    sortBy: string,
    options?: Options
  ) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_API_URL}/comment/get-by-post-id`,
        {
          params: {
            postId: postId,
            pageNumber,
            pageSize: PAGE_SIZE,
            sortBy: sortBy,
          },
        }
      );

      setData((previousData) => [...previousData, ...response.data.comments]);
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

  useEffect(() => {
    setData([]); // Reset comments
    setCurrentPageNumber(1); // Reset page number
    setCanLoadMore(true); // Reset load more flag
    fetchComments(postId, 1, sortBy); // Fetch first page with new sortBy
  }, [postId, sortBy]);

  //fetch the first page when mounted
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/postCommentHub`)
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

    connection.on("ReceivePostCommentCreate", (createdComment: CommentType) => {
      if (
        createdComment.postId === postId &&
        createdComment.parentCommentId === null
      ) {
        setData((prev) => [
          ...prev.filter(
            (existingComment) => existingComment.id !== createdComment.id
          ),
          createdComment,
        ]);
      }
    });

    connection.on("ReceivePostCommentUpdate", (updatedComment: CommentType) => {
      if (
        updatedComment.postId === postId &&
        updatedComment.parentCommentId === null
      ) {
        setData((prev) =>
          prev.map((existingComment) =>
            existingComment.id === updatedComment.id
              ? updatedComment
              : existingComment
          )
        );
      }
    });

    return () => {
      connection
        .stop()
        .then(() => {
          ////TODO: Find a way to handle this
          // console.log("SignalR disconnected");
        })
        .catch((error) => {
          //TODO: Find a way to handle this
          // console.log("Error stopping SignalR:", error);
        });
    };
  }, [postId]);

  const loadMore = async (options?: Options) => {
    // prevent duplicate requests
    if (!canLoadMore || isLoading) return;

    const nextPage = currentPageNumber + 1;
    await fetchComments(postId, nextPage, sortBy);
    setCurrentPageNumber(nextPage);
  };

  return {
    data,
    isLoading,
    canLoadMore,
    loadMore,
  };
};
