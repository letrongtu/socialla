import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { CommentType } from "../types";
import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5096";
const BASE_API_URL = "http://localhost:5096/api";
const PAGE_SIZE = 5;

type ResponseType = {
  comments: CommentType[];
  totalParentComments: number;
  totalPostComments: number;
  hasNextPage: boolean;
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const UseGetParentCommentsByPostId = (
  postId: string,
  sortBy: string = "top"
) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [totalPostComments, setTotalPostComments] = useState(0);

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
      setTotalPostComments(response.data.totalPostComments);
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
    setTotalPostComments(0);
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
        setData((prev) => {
          const filteredComments = prev.filter(
            (existingComment) => existingComment.id !== createdComment.id
          );

          return sortBy === "newest"
            ? [createdComment, ...filteredComments] // Newest at the top
            : [...filteredComments, createdComment]; // Oldest at the top
        });
      }

      setTotalPostComments((prevTotal) => prevTotal + 1);
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

    connection.on("ReceivePostCommentDelete", (deletedComment: CommentType) => {
      if (
        deletedComment.postId === postId &&
        deletedComment.parentCommentId === null
      ) {
        setData((prev) =>
          prev.filter(
            (existingComment) => existingComment.id !== deletedComment.id
          )
        );
      }

      setTotalPostComments((prevTotal) => prevTotal - 1);
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
  }, [postId, sortBy]);

  const loadMore = async (options?: Options) => {
    // prevent duplicate requests
    if (!canLoadMore || isLoading) return;

    const nextPage = currentPageNumber + 1;
    await fetchComments(postId, nextPage, sortBy, options);
    setCurrentPageNumber(nextPage);
  };

  return {
    data,
    totalPostComments,
    isLoading,
    canLoadMore,
    loadMore,
  };
};
