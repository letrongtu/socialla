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

export const useGetMessages = (conversationId: string | null) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const [data, setData] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async (
    conversationId: string,
    pageNumber: number,
    options?: Options
  ) => {
    try {
      setIsLoading(true);

      if (pageNumber > 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const response = await axios.get<ResponseType>(
        `${BASE_URL_API}/messages/${conversationId}`,
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
    }
  };

  //fetch the first page when mounted
  useEffect(() => {
    if (!conversationId) {
      return;
    }

    fetchMessages(conversationId, 1);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/messageHub`)
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
  }, [conversationId]);

  const loadMore = async (options?: Options) => {
    // prevent duplicate requests
    if (!canLoadMore || isLoading || !conversationId) return;

    const nextPage = currentPageNumber + 1;
    await fetchMessages(conversationId, nextPage);
    setCurrentPageNumber(nextPage);
  };

  return {
    data,
    isLoading,
    canLoadMore,
    loadMore,
  };
};
