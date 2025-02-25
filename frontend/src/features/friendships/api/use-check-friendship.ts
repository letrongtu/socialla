import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const BASE_URL = "https://socialla.azurewebsites.net";
const BASE_API_URL = "https://socialla.azurewebsites.net/api";

type ResponseType = {
  hasFriendship: boolean;
  isAccepted: boolean;
  isFirstUserSent: boolean;
} | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: AxiosError) => void;
  onSettled?: () => void;
};

export const useCheckFriendShip = (
  firstUserId: string,
  secondUserId: string
) => {
  const [data, setData] = useState<ResponseType>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkIsFriendShip = async (
    firstUserId: string,
    secondUserId: string
  ) => {
    try {
      setIsLoading(true);

      const response = await axios.get<ResponseType>(
        `${BASE_API_URL}/friendship`,
        {
          params: {
            firstUserId,
            secondUserId,
          },
        }
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
    if (!firstUserId || !secondUserId) {
      return;
    }
    checkIsFriendShip(firstUserId, secondUserId);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/friendshipHub`, {
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
        console.error("SignalR connection error:", error);
      }
    };

    startConnection();

    connection.on(
      "ReceiveFriendshipCreate",
      (firstCreatedUserId: string, secondCreatedUserId: string) => {
        if (
          (firstUserId === firstCreatedUserId &&
            secondUserId === secondCreatedUserId) ||
          (firstUserId === secondCreatedUserId &&
            secondUserId === firstCreatedUserId)
        ) {
          checkIsFriendShip(firstUserId, secondUserId);
        }
      }
    );

    connection.on(
      "ReceiveFriendshipDelete",
      (firstDeletedUserId: string, secondDeletedUserId: string) => {
        if (
          (firstUserId === firstDeletedUserId &&
            secondUserId === secondDeletedUserId) ||
          (firstUserId === secondDeletedUserId &&
            secondUserId === firstDeletedUserId)
        ) {
          checkIsFriendShip(firstUserId, secondUserId);
        }
      }
    );

    connection.on(
      "ReceiveFriendshipUpdate",
      (firstUpdatedUserId: string, secondUpdatedUserId: string) => {
        if (
          (firstUserId === firstUpdatedUserId &&
            secondUserId === secondUpdatedUserId) ||
          (firstUserId === secondUpdatedUserId &&
            secondUserId === firstUpdatedUserId)
        ) {
          checkIsFriendShip(firstUserId, secondUserId);
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
  }, [firstUserId, secondUserId]);

  return {
    data,
    isLoading,
  };
};
