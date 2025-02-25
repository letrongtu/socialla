import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { CommentType } from "../types";
import * as signalR from "@microsoft/signalr";

const BASE_URL = "https://socialla.azurewebsites.net";
const BASE_API_URL = "https://socialla.azurewebsites.net/api";

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
      .withUrl(`${BASE_URL}/postCommentHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
          await connection.start();
        }
      } catch (error) {
        console.error("SignalR connection error:", error);
      }
    };

    startConnection();

    connection.on("ReceivePostCommentCreate", (createdComment: CommentType) => {
      if (createdComment.parentCommentId !== parentCommentId) return;

      setData((prev) => {
        const filteredComments = prev.filter(
          (existingComment) => existingComment.id !== createdComment.id
        );

        return sortBy === "newest"
          ? [createdComment, ...filteredComments] // Newest at the top
          : [...filteredComments, createdComment]; // Oldest at the top
      });

      setTotalReplyComments((prevTotal) => prevTotal + 1);
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
        setData((prev) =>
          prev.filter(
            (existingComment) => existingComment.id !== deletedComment.id
          )
        );
      }

      setTotalReplyComments((prevTotal) => prevTotal - 1);
    });

    return () => {
      const stopConnection = async () => {
        if (connection.state === signalR.HubConnectionState.Connected) {
          try {
            await connection.stop();
          } catch (error) {
            console.error("Error stopping SignalR:", error);
          }
        }
      };

      stopConnection();
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
