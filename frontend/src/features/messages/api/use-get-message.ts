import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { MessageType } from "../types";

const BASE_URL = "http://localhost:5096";
const BASE_API_URL = "http://localhost:5096/api";

type ResponseType = {
  message: MessageType | null;
};

export const useGetMessage = (
  messageId: string | null,
  userId: string | null
) => {
  const [data, setData] = useState<MessageType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReaction = async (messageId: string, userId: string) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_API_URL}/messages/get-by-id/${messageId}/${userId}`
      );

      setData(response.data.message);

      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!messageId || !userId) {
      return;
    }
    fetchReaction(messageId, userId);
  }, [messageId, userId]);

  return {
    data,
    isLoading,
  };
};
