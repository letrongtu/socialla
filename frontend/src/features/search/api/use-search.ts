import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";
import { SearchUserType } from "../types";

const BASE_API_URL = "https://socialla.azurewebsites.net/api";

type ResponseType = {
  results: SearchUserType[];
} | null;

export const useSearch = (query: string | null, userId: string | null) => {
  const [data, setData] = useState<ResponseType>(null);
  const [isLoading, setIsLoading] = useState(false);

  const search = async (query: string, userId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get<ResponseType>(
        `${BASE_API_URL}/user/search`,
        {
          params: { query, userId },
        }
      );

      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const debounceSearch = useMemo(() => debounce(search, 300), []);

  useEffect(() => {
    if (!query || !userId) {
      setData(null);
      return;
    }

    debounceSearch(query, userId);

    return () => {
      debounceSearch.cancel();
    };
  }, [query, userId, debounceSearch]);

  return {
    data,
    isLoading,
  };
};
