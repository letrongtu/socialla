import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ReactionType } from "@/utils/types";

import * as signalR from "@microsoft/signalr";

const BASE_URL = "https://socialla.azurewebsites.net";
const BASE_API_URL = "https://socialla.azurewebsites.net/api";

type ResponseType = {
  postReactions: ReactionType[];
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const useGetPostReactions = (postId: string | null) => {
  const [data, setData] = useState<ReactionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPostReactions = async (postId: string, options?: Options) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_API_URL}/post-reaction/${postId}`
      );

      setData(response.data.postReactions ? response.data.postReactions : []);

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
    if (!postId) {
      return;
    }

    fetchPostReactions(postId);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/postReactionHub`)
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

    connection.on("ReceivePostReactionChange", (updatedPostId: string) => {
      if (updatedPostId === postId) {
        fetchPostReactions(postId);
      }
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
  }, [postId]);

  return {
    data,
    isLoading,
  };
};
