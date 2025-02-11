import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ReactionType } from "@/utils/types";

const BASE_URL = "http://localhost:5096";
const BASE_API_URL = "http://localhost:5096/api";

type ResponseType = {
  reaction: ReactionType;
} | null;

export const useGetCommentReaction = (
  commentId: string | null,
  postId: string | null,
  userId: string | null
) => {
  const [data, setData] = useState<ResponseType>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReaction = async (
    commentId: string,
    postId: string,
    userId: string
  ) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_API_URL}/comment-reaction/${commentId}/${postId}/${userId}`
      );

      setData(response.data);

      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!commentId || !postId || !userId) {
      return;
    }
    fetchReaction(commentId, postId, userId);
  }, [commentId, postId, userId]);

  return {
    data,
    isLoading,
  };
};
