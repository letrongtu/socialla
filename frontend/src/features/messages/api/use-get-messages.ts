import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { MessageType } from "../types";

const BASE_URL = "http://localhost:5096";
const BASE_URL_API = "http://localhost:5096/api";
const PAGE_SIZE = 10;

type ResponseType = {
  messages: MessageType[];
  totalPosts: number;
  hasNextPage: boolean;
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const useGetMessages = (
  conversationId: string | null,
  currentUserId: string | null
) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [data, setData] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMessages = async (
    conversationId: string,
    currentUserId: string,
    pageNumber: number,
    options?: Options
  ) => {
    try {
      setIsLoading(true);

      if (pageNumber > 1) {
        setIsLoadingMore(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const response = await axios.get<ResponseType>(
        `${BASE_URL_API}/messages/${conversationId}/${currentUserId}`,
        {
          params: { pageNumber, pageSize: PAGE_SIZE },
        }
      );

      setData((previousData) => [...response.data.messages, ...previousData]);
      setCanLoadMore(response.data.hasNextPage);

      options?.onSuccess?.(response.data);

      return response;
    } catch (error) {
      options?.onError?.(error as AxiosError);
    } finally {
      options?.onSettled?.();
      setIsLoading(false);

      if (pageNumber > 1) {
        setIsLoadingMore(false);
      }
    }
  };

  //fetch the first page when mounted
  useEffect(() => {
    // prevent -> When one conversation is open, click on another user will keep the old data, then add the new data on top of the old data
    setData([]);

    if (!conversationId || !currentUserId) {
      return;
    }

    fetchMessages(conversationId, currentUserId, 1);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/messageHub`)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
          await connection.start();
        }
      } catch (error) {
        // console.error("SignalR connection error:", error);
      }
    };

    startConnection();

    connection.on("ReceiveMessageCreate", (message: MessageType) => {
      if (message.conversationId === conversationId) {
        setData((prev) => [...prev, message]);
      }
    });

    connection.on("ReceiveMessageDelete", (message: MessageType) => {
      if (message.conversationId === conversationId) {
        setData((prev) => prev.filter((m) => m.id !== message.id));
      }
    });

    connection.on(
      "ReceiveMessageVisibilityDelete",
      (messageId: string, userId: string, conversationId: string) => {
        if (userId === currentUserId && conversationId === conversationId) {
          setData((prev) => prev.filter((m) => m.id !== messageId));
        }
      }
    );

    return () => {
      const stopConnection = async () => {
        if (connection.state === signalR.HubConnectionState.Connected) {
          try {
            await connection.stop();
          } catch (error) {
            // console.error("Error stopping SignalR:", error);
          }
        }
      };

      stopConnection();
    };
  }, [conversationId, currentUserId]);

  const loadMore = async (options?: Options) => {
    // prevent duplicate requests
    if (!canLoadMore || isLoading || !conversationId || !currentUserId) return;

    setIsLoadingMore(true);
    const nextPage = currentPageNumber + 1;
    await fetchMessages(conversationId, currentUserId, nextPage);
    setCurrentPageNumber(nextPage);
  };

  return {
    data,
    isLoading,
    isLoadingMore,
    canLoadMore,
    loadMore,
  };
};
