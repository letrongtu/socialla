import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ReturnConversationType } from "../types";

const BASE_URL = "http://localhost:5096";
const BASE_URL_API = "http://localhost:5096/api";
const PAGE_SIZE = 5;

type ResponseType = {
  conversations: ReturnConversationType[];
  totalConversations: number;
  hasNextPage: boolean;
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const useGetConversations = (userId: string | null) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [data, setData] = useState<ReturnConversationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async (
    userId: string,
    pageNumber: number,
    options?: Options
  ) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_URL_API}/conversations/${userId}`,
        {
          params: { pageNumber, pageSize: PAGE_SIZE },
        }
      );

      setData((prev) => [...prev, ...response.data.conversations]);
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
    if (!userId) {
      return;
    }

    fetchConversations(userId, 1);

    // const connection = new signalR.HubConnectionBuilder()
    //   .withUrl(`${BASE_URL}/notificationHub`)
    //   .withAutomaticReconnect()
    //   .build();

    // const startConnection = async () => {
    //   try {
    //     if (connection.state === signalR.HubConnectionState.Disconnected) {
    //       await connection.start();
    //     }
    //   } catch (error) {
    //     // console.error("SignalR connection error:", error);
    //   }
    // };

    // startConnection();

    // connection.on(
    //   "ReceiveConversationCreate",
    //   (notification: ConversationType) => {
    //     if (notification.receiveUserId === userId) {
    //       setData((prev) => [notification, ...prev]);
    //     }
    //   }
    // );

    // connection.on(
    //   "ReceiveConversationDelete",
    //   (notification: ConversationType) => {
    //     setData((prev) =>
    //       prev.filter(
    //         (existingConversation) =>
    //           existingConversation.id !== notification.id
    //       )
    //     );
    //   }
    // );

    // connection.on(
    //   "ReceiveConversationUpdate",
    //   (notification: ConversationType) => {
    //     setData((prev) =>
    //       prev.map((existingConversation) =>
    //         existingConversation.id === notification.id
    //           ? { ...existingConversation, isRead: notification.isRead }
    //           : existingConversation
    //       )
    //     );
    //   }
    // );

    // return () => {
    //   const stopConnection = async () => {
    //     if (connection.state === signalR.HubConnectionState.Connected) {
    //       try {
    //         await connection.stop();
    //       } catch (error) {
    //         // console.error("Error stopping SignalR:", error);
    //       }
    //     }
    //   };

    //   stopConnection();
    // };
  }, [userId]);

  const loadMore = async (options?: Options) => {
    // prevent duplicate requests
    if (!canLoadMore || isLoading || !userId) return;

    const nextPage = currentPageNumber + 1;
    await fetchConversations(userId, nextPage);
    setCurrentPageNumber(nextPage);
  };

  return {
    data,
    isLoading,
    canLoadMore,
    loadMore,
  };
};
