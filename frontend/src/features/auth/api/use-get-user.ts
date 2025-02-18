import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { UserType } from "../types";
import * as signalR from "@microsoft/signalr";

const BASE_URL = "http://localhost:5096";
const BASE_URL_API = "http://localhost:5096/api";

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
      .withUrl(`${BASE_URL}/userStatusHub`)
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
      connection
        .stop()
        .then(() => {
          ////TODO: Find a way to handle this
          // console.log("SignalR disconnected");
        })
        .catch((error) => {
          //TODO: Find a way to handle this
          console.log("Error stopping SignalR:", error);
        });
    };
  }, [userId]);

  return {
    data,
    isLoading,
  };
};
