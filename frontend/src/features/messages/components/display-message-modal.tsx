import { UserType } from "@/features/auth/types";
import { DisplayMessageModalHeader } from "./display-message-modal-header";
import { useGetUser } from "@/features/auth/api/use-get-user";

interface DisplayMessageModalProps {
  currentUser: UserType;
  otherUserId: string;
}

export const DisplayMessageModal = ({
  currentUser,
  otherUserId,
}: DisplayMessageModalProps) => {
  const { data: otherUserData, isLoading: isLoadingOtherUserData } =
    useGetUser(otherUserId);

  if (!otherUserData) {
    return null;
  }

  return (
    <div className="">
      <DisplayMessageModalHeader otherUser={otherUserData} />
    </div>
  );
};
