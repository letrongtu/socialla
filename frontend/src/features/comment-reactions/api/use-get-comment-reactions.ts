import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ReactionType } from "@/utils/types";

import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5096";
const BASE_API_URL = "http://localhost:5096/api";

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
      .withUrl(`${BASE_URL}/commentReactionHub`)
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
      "ReceiveCommentReactionChange",
      (updatedCommentId: string) => {
        console.log(updatedCommentId);
        console.log(commentId);
        if (updatedCommentId === commentId) {
          fetchCommentReactions(commentId);
        }
      }
    );

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
  }, [commentId]);

  return {
    data,
    isLoading,
  };
};
