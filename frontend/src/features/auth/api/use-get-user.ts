import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";

const baseURL = "http://localhost:5096/api";

type ResponseType = {
  id: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  dateOfBirth: Date | undefined;
  email: string | undefined;
  phoneNumber: string | undefined;
  profilePictureUrl: string | undefined;
  createdAt: Date | undefined;
} | null;

interface UseGetUserProps {
  userId: string;
}

export const useGetUser = ({ userId }: UseGetUserProps) => {
  const [data, setData] = useState<ResponseType>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ResponseType>(
          `${baseURL}/user/${userId}`
        );

        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return {
    data,
    isLoading,
  };
};
