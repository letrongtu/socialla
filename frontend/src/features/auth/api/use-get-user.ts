import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { UserType } from "../types";
import * as signalR from "@microsoft/signalr";

const BASE_URL = "https://socialla.azurewebsites.net";
const BASE_URL_API = "https://socialla.azurewebsites.net/api";

type ResponseType = UserType | null;

export const useGetUser = (userId: string | null) => {
  const [data, setData] = useState<ResponseType>(null);

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get<ResponseType>(
        `${BASE_URL_API}/user/${userId}`
      );

      setData(response.data);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      return;
    }

    fetchData(userId);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/userStatusHub`, {
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

    connection.on("ReceiveUserOnline", (id: string) => {
      if (userId === id) {
        setData((prev) =>
          prev ? { ...prev, isActive: true, lastActiveAt: undefined } : prev
        );
      }
    });

    connection.on("ReceiveUserOffline", (id: string, lastActiveAt: Date) => {
      if (userId === id) {
        setData((prev) =>
          prev ? { ...prev, isActive: false, lastActiveAt } : prev
        );
      }
    });

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
  }, [userId]);

  return {
    data,
    isLoading,
  };
};
