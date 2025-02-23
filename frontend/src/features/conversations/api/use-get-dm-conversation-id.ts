import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useMessageModal } from "../../messages/store/use-message-modal";

const BASE_URL = "http://localhost:5096";
const BASE_URL_API = "http://localhost:5096/api";

type ResponseType = {
  conversationId: string | null;
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const useGetDmConversationId = (
  otherUserId: string | null,
  currentUserId: string | null
) => {
  const [, setOpen] = useMessageModal();
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversationId = async (
    otherUserId: string,
    currentUserId: string,
    options?: Options
  ) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_URL_API}/conversations/${currentUserId}/${otherUserId}`
      );

      setData(response.data.conversationId);

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
    if (!currentUserId || !otherUserId) {
      return;
    }

    fetchConversationId(otherUserId, currentUserId);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/conversationHub`)
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

    connection.on(
      "ReceiveConversationCreate",
      (conversationId: string, userIds: string[]) => {
        if (userIds.includes(currentUserId) && userIds.includes(otherUserId)) {
          setData(conversationId);

          setOpen({
            open: true,
            userId: currentUserId == userIds[0] ? userIds[1] : userIds[0], //This is dm -> the only user
            conversationId: conversationId,
          });
        }
      }
    );

    connection.on("ReceiveConversationDelete", (conversationId: string) => {
      if (data === conversationId) {
        setData(null);

        setOpen({
          open: false,
          userId: null,
          conversationId: null,
        });
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
  }, [currentUserId, otherUserId, setOpen, data]);

  return {
    data,
    isLoading,
  };
};
