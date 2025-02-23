import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ReactionType } from "@/utils/types";

import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5096";
const BASE_API_URL = "http://localhost:5096/api";

type ResponseType = {
  friendIds: string[];
  totalFriends: number;
  hasNextPage: boolean;
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const useGetFriends = (userId: string | null, pageSize: number) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [data, setData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFriends = async (
    userId: string,
    pageNumber: number,
    pageSize: number,
    options?: Options
  ) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_API_URL}/friendship/${userId}`,
        { params: { pageNumber, pageSize: pageSize } }
      );

      setData(response.data.friendIds);
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
    if (!userId) {
      return;
    }

    fetchFriends(userId, 1, 20);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/friendshipHub`)
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

    connection.on(
      "ReceiveFriendshipDelete",
      (firstDeletedUserId: string, secondDeletedUserId: string) => {
        const deletedFriendId =
          firstDeletedUserId === userId
            ? firstDeletedUserId
            : secondDeletedUserId;

        setData((prev) =>
          prev?.filter((friendId) => friendId !== deletedFriendId)
        );
      }
    );

    connection.on(
      "ReceiveFriendshipUpdate",
      (firstUpdatedUserId: string, secondUpdatedUserId: string) => {
        const addedFriendId =
          firstUpdatedUserId === userId
            ? firstUpdatedUserId
            : secondUpdatedUserId;

        setData((prev) => [addedFriendId, ...prev]);
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
  }, [userId]);

  const loadMore = async (options?: Options) => {
    // prevent duplicate requests
    if (!canLoadMore || isLoading || !userId) return;

    const nextPage = currentPageNumber + 1;
    await fetchFriends(userId, nextPage, pageSize);
    setCurrentPageNumber(nextPage);
  };

  return {
    data,
    isLoading,
    canLoadMore,
    loadMore,
  };
};
