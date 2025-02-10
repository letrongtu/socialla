import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ReactionType } from "@/utils/types";

import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5096";
const BASE_API_URL = "http://localhost:5096/api";

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

    connection.on("ReceivePostReactionChange", (updatedPostId: string) => {
      if (updatedPostId === postId) {
        fetchPostReactions(postId);
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
  }, [postId]);

  return {
    data,
    isLoading,
  };
};
