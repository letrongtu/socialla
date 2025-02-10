import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { NotificationType } from "../types";

const BASE_URL = "http://localhost:5096";
const BASE_URL_API = "http://localhost:5096/api";
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

export const UseGetNotifications = (userId: string) => {
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
          params: { pageNumber, pageSize: PAGE_SIZE },
        }
      );

      setData((previousData) => [
        ...previousData,
        ...response.data.notifications,
      ]);
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
    fetchNotifications(userId, 1);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/notificationHub`)
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

    connection.on(
      "ReceiveNotificationCreate",
      (notification: NotificationType) => {
        setData((prev) => [notification, ...prev]);
      }
    );

    connection.on("ReceiveNotificationDelete", (notificationId: string) => {
      setData((prev) =>
        prev.filter(
          (existingNotification) => existingNotification.id !== notificationId
        )
      );
    });

    connection.on("ReceiveNotificationUpdate", (notificationId: string) => {
      setData((prev) =>
        prev.map((existingNotification) =>
          existingNotification.id === notificationId
            ? { ...existingNotification, isRead: true }
            : existingNotification
        )
      );
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
  }, [userId]);

  const loadMore = async (options?: Options) => {
    // prevent duplicate requests
    if (!canLoadMore || isLoading) return;

    const nextPage = currentPageNumber + 1;
    await fetchNotifications(userId, nextPage);
    setCurrentPageNumber(nextPage);
  };

  return {
    data,
    isLoading,
    canLoadMore,
    loadMore,
  };
};
