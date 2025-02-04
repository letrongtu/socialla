import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { CommentType } from "../types";
import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5096";
const BASE_API_URL = "http://localhost:5096/api";

const PAGE_SIZE = 5;

type ResponseType = {
  comments: CommentType[];
  totalReplyComments: number;
  hasNextPage: boolean;
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const UseGetCommentsByParentCommentId = (
  parentCommentId: string,
  sortBy: string = "top"
) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [totalReplyComments, setTotalReplyComments] = useState(0);
  const [remainingCommentsCount, setRemainingCommentsCount] = useState(0);

  const [data, setData] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async (
    parentCommentId: string,
    pageNumber: number,
    sortBy: string,
    options?: Options
  ) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_API_URL}/comment/get-by-parent-comment-id`,
        {
          params: { parentCommentId, sortBy, pageNumber, pageSize: PAGE_SIZE },
        }
      );

      setData((previousData) => [...previousData, ...response.data.comments]);

      setTotalReplyComments(response.data.totalReplyComments);
      setRemainingCommentsCount(
        response.data.totalReplyComments >= PAGE_SIZE * pageNumber
          ? response.data.totalReplyComments - pageNumber * PAGE_SIZE
          : 0
      );

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
    setTotalReplyComments(0);
    setRemainingCommentsCount(0);
    setCanLoadMore(true); // Reset load more flag
    fetchComments(parentCommentId, 1, sortBy); // Fetch first page with new sortBy
  }, [parentCommentId, sortBy]);

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
      if (createdComment.parentCommentId !== parentCommentId) return;

      setTotalReplyComments((prevTotal) => prevTotal + 1);

      setData((prev) => {
        const filteredComments = prev.filter(
          (existingComment) => existingComment.id !== createdComment.id
        );

        return sortBy === "newest"
          ? [createdComment, ...filteredComments] // Newest at the top
          : [...filteredComments, createdComment]; // Oldest at the top
      });
    });

    connection.on("ReceivePostCommentUpdate", (updatedComment: CommentType) => {
      if (updatedComment.parentCommentId === parentCommentId) {
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
      if (deletedComment.parentCommentId === parentCommentId) {
        setTotalReplyComments((prevTotal) => prevTotal - 1);

        setData((prev) =>
          prev.filter(
            (existingComment) => existingComment.id !== deletedComment.id
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
  }, [parentCommentId, sortBy]);

  const loadMore = async (options?: Options) => {
    // prevent duplicate requests
    if (!canLoadMore || isLoading) return;

    const nextPage = currentPageNumber + 1;
    await fetchComments(parentCommentId, nextPage, sortBy, options);
    setCurrentPageNumber(nextPage);
  };

  return {
    data,
    isLoading,
    canLoadMore,
    loadMore,
    totalReplyComments,
    remainingCommentsCount,
  };
};
