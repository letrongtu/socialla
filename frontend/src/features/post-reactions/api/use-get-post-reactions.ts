import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { PostReactionType } from "../types";
import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5096/api";

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
        `${BASE_URL}/post-reaction/${postId}`
      );

      console.log(response);
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
    console.log("Here");
    fetchPostReactions(postId);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/postReactionHub`)
      .withAutomaticReconnect()
      .build();

    connection.on("ReceivePostReaction", (updatedPostId: string) => {
      if (updatedPostId === postId) {
        console.log("Here");
        fetchPostReactions(postId);
      }
    });

    return () => {
      connection.stop();
    };
  }, [postId]);

  return {
    data,
    isLoading,
  };
};
