import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ReactionType } from "@/utils/types";

import * as signalR from "@microsoft/signalr";

const BASE_URL = "https://socialla.azurewebsites.net";
const BASE_API_URL = "https://socialla.azurewebsites.net/api";

type ResponseType = {
  commentReactions: ReactionType[];
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const useGetCommentReactions = (commentId: string) => {
  const [data, setData] = useState<ReactionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCommentReactions = async (
    commentId: string,
    options?: Options
  ) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_API_URL}/comment-reaction/${commentId}`
      );

      setData(
        response.data.commentReactions ? response.data.commentReactions : []
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
    if (!commentId) {
      return;
    }

    fetchCommentReactions(commentId);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/commentReactionHub`, {
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
        // console.error("SignalR connection error:", error);
      }
    };

    startConnection();

    connection.on(
      "ReceiveCommentReactionChange",
      (updatedCommentId: string) => {
        if (updatedCommentId === commentId) {
          fetchCommentReactions(commentId);
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
  }, [commentId]);

  return {
    data,
    isLoading,
  };
};
