import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie, hasCookie } from "cookies-next";
import { UserType } from "../types";

const baseURL = "https://socialla.azurewebsites.net/api";

type ResponseType = UserType | null;

export const useCurrentUser = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleOffline = async () => {
    if (hasCookie("userId")) {
      const userId = getCookie("userId");
      await axios.post(`${baseURL}/user/active`, {
        userId,
        isActive: false,
      });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (hasCookie("userId") && hasCookie("token")) {
        const userId = getCookie("userId");
        const token = getCookie("token");
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        const response = await axios.get<ResponseType>(
          `${baseURL}/user/${userId}`
        );
        setData(response.data);

        // Online/Offline update
        await axios.post(`${baseURL}/user/active`, {
          userId,
          isActive: true,
        });
      }
      setIsLoading(false);
    };

    fetchUser();

    // Mark the user as offline when they leave
    window.addEventListener("beforeunload", handleOffline);

    return () => {
      window.removeEventListener("beforeunload", handleOffline);
    };
  }, []);

  return {
    data,
    isLoading,
    handleOffline,
  };
};
