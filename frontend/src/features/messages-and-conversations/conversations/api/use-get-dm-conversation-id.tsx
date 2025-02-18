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
  firstUserId: string | null,
  secondUserId: string | null
) => {
  const [, setOpen] = useMessageModal();
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversationId = async (
    firstUserId: string,
    secondUserId: string,
    options?: Options
  ) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_URL_API}/conversations/${firstUserId}/${secondUserId}`
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
    if (!firstUserId || !secondUserId) {
      return;
    }

    fetchConversationId(firstUserId, secondUserId);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/conversationHub`)
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
      "ReceiveConversationCreate",
      (conversationId: string, userIds: string[]) => {
        if (userIds.includes(firstUserId) && userIds.includes(secondUserId)) {
          setOpen({
            open: true,
            userId: userIds[0], //This is dm -> the only user
            conversationId: conversationId,
          });
        }
      }
    );

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
  }, [firstUserId, secondUserId, setOpen]);

  return {
    data,
    isLoading,
  };
};
