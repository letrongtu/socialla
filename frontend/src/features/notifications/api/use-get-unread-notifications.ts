import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { NotificationType } from "../types";

const BASE_URL = "https://socialla.azurewebsites.net";
const BASE_URL_API = "https://socialla.azurewebsites.net/api";
const PAGE_SIZE = 5;

type ResponseType = {
  notifications: NotificationType[];
  totalNotifications: number;
  hasNextPage: boolean;
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const useGetUnReadNotifications = (userId: string | null) => {
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [data, setData] = useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async (
    userId: string,
    pageNumber: number,
    options?: Options
  ) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_URL_API}/notification/${userId}`,
        {
          params: { pageNumber, pageSize: PAGE_SIZE, isFetchingUnRead: true },
        }
      );

      setData((prev) => [...prev, ...response.data.notifications]);
      setTotalNotifications(response.data.totalNotifications);
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

    fetchNotifications(userId, 1);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/notificationHub`, {
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

    connection.on(
      "ReceiveNotificationCreate",
      (notification: NotificationType) => {
        if (notification.receiveUserId === userId) {
          setData((prev) => [notification, ...prev]);

          setTotalNotifications((prev) => prev + 1);
        }
      }
    );

    connection.on(
      "ReceiveNotificationDelete",
      (notification: NotificationType) => {
        setData((prev) =>
          prev.filter(
            (existingNotification) =>
              existingNotification.id !== notification.id
          )
        );

        if (!notification.isRead) {
          setTotalNotifications((prev) => prev - 1);
        }
      }
    );

    connection.on(
      "ReceiveNotificationUpdate",
      (notification: NotificationType) => {
        if (!notification.isRead) {
          setData((prev) => [notification, ...prev]);
          setTotalNotifications((prev) => prev + 1);
        } else {
          setData((prev) =>
            prev.filter(
              (existingNotification) =>
                existingNotification.id !== notification.id
            )
          );

          setTotalNotifications((prev) => prev - 1);
        }
      }
    );

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
  }, [userId]);

  const loadMore = async (options?: Options) => {
    // prevent duplicate requests
    if (!canLoadMore || isLoading || !userId) return;

    const nextPage = currentPageNumber + 1;
    await fetchNotifications(userId, nextPage);
    setCurrentPageNumber(nextPage);
  };

  return {
    data,
    isLoading,
    totalNotifications,
    canLoadMore,
    loadMore,
  };
};
