import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { PostReactionType } from "../types";
import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5096";
const BASE_API_URL = "http://localhost:5096/api";

type ResponseType = {
  postReactions: PostReactionType[];
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const useGetPostReactions = (postId: string) => {
  const [data, setData] = useState<PostReactionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPostReactions = async (postId: string, options?: Options) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_API_URL}/post-reaction/${postId}`
      );

      setData(response.data.postReactions);

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
      .withUrl("http://localhost:5096/postReactionHub")
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR connected");
      })
      .catch((err) => console.log("SignalR connection error: ", err));

    connection.on("ReceivePostReactionUpdate", (updatedPostId: string) => {
      if (updatedPostId === postId) {
        console.log("Here");
        fetchPostReactions(postId);
      }
    });

    return () => {
      connection
        .stop()
        .then(() => console.log("SignalR disconnected"))
        .catch((err) => console.error("Error stopping SignalR:", err));
    };
  }, [postId]);

  return {
    data,
    isLoading,
  };
};
