import { NotificationType } from "@/features/notifications/types";
import { UseDeleteFriendship } from "../api/use-delete-friendship";
import { Button } from "@/components/ui/button";
import { FaUserXmark } from "react-icons/fa6";

interface ConfirmButtonProps {
  label?: string;
  firstUserId: string;
  secondUserId: string;
  handleReadNotification?: () => void;
}

export const DeleteButton = ({
  label = "Delete",
  firstUserId,
  secondUserId,
  handleReadNotification,
}: ConfirmButtonProps) => {
  const { mutate: deleteRequest, isPending: isPendingDeleteRequest } =
    UseDeleteFriendship();

  const handleDelete = () => {
    deleteRequest(
      {
        firstUserId,
        secondUserId,
      },
      {
        onSuccess: (data) => {
          //   console.log(data);
        },
        onError: (error) => {
          //   console.log(error);
        },
      }
    );

    if (handleReadNotification) {
      handleReadNotification();
    }
  };

  return (
    <Button
      onClick={handleDelete}
      className="w-full text-black bg-[#c9ccd1]/30 hover:bg-[#c9ccd1]/70"
    >
      {label === "Unfriend" && <FaUserXmark className="size-5" />}
      {label}
    </Button>
  );
};
