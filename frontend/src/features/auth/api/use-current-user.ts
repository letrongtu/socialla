import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie, hasCookie } from "cookies-next";

const baseURL = "http://localhost:5096/api";

export const useCurrentUser = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (hasCookie("userId") && hasCookie("token")) {
        const userId = getCookie("userId");
        const token = getCookie("token");
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        const response = await axios.get(`${baseURL}/user/${userId}`);
        setData(response.data);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  return {
    data,
    isLoading,
  };
};
