import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ReturnConversationType } from "../types";

const BASE_URL = "https://socialla.azurewebsites.net";
const BASE_URL_API = "https://socialla.azurewebsites.net/api";
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

export const useGetConversations = (currentUserId: string | null) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [data, setData] = useState<ReturnConversationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async (
    currentUserId: string,
    pageNumber: number,
    options?: Options
  ) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_URL_API}/conversations/${currentUserId}`,
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
    if (!currentUserId) {
      return;
    }

    fetchConversations(currentUserId, 1);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/conversationHub`, {
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

    // connection.on(
    //   "ReceiveConversationCreate",
    //   (conversationId: string, userIds: string[]) => {
    //     if (userIds.includes(currentUserId) && userIds.includes(otherUserId)) {
    //       setData(conversationId);

    //       setOpen({
    //         open: true,
    //         userId: currentUserId == userIds[0] ? userIds[1] : userIds[0], //This is dm -> the only user
    //         conversationId: conversationId,
    //       });
    //     }
    //   }
    // );

    connection.on(
      "ReceiveConversationDelete",
      (conversationId: string, userId: string) => {
        if (currentUserId === userId) {
          setData((prev) =>
            prev.filter((c) => c.conversation.id !== conversationId)
          );
        }
      }
    );

    connection.on(
      "ReceiveConversationUpdateRead",
      (conversationId: string, userId: string) => {
        if (currentUserId === userId) {
          setData((prev) =>
            prev.map((c) =>
              c.conversation.id === conversationId
                ? { ...c, isLastMessageRead: true }
                : c
            )
          );
        }
      }
    );

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
  }, [currentUserId]);

  const loadMore = async (options?: Options) => {
    // prevent duplicate requests
    if (!canLoadMore || isLoading || !currentUserId) return;

    const nextPage = currentPageNumber + 1;
    await fetchConversations(currentUserId, nextPage);
    setCurrentPageNumber(nextPage);
  };

  return {
    data,
    isLoading,
    canLoadMore,
    loadMore,
  };
};
