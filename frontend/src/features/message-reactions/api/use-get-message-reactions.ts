import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ReactionType } from "@/utils/types";

import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5096";
const BASE_API_URL = "http://localhost:5096/api";

type ResponseType = {
  messageReactions: ReactionType[];
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const useGetMessageReactions = (messageId: string) => {
  const [data, setData] = useState<ReactionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessageReactions = async (
    messageId: string,
    options?: Options
  ) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_API_URL}/message-reactions/${messageId}`
      );

      setData(
        response.data.messageReactions ? response.data.messageReactions : []
      );

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
    if (!messageId) {
      return;
    }

    fetchMessageReactions(messageId);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/messageReactionHub`)
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

    connection.on(
      "ReceiveMessageReactionChange",
      (updatedMessageId: string) => {
        if (updatedMessageId === messageId) {
          fetchMessageReactions(messageId);
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
  }, [messageId]);

  return {
    data,
    isLoading,
  };
};
