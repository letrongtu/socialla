import { NotificationType } from "../types";
import { UseUpdateReadNotification } from "../api/use-update-read-notification";

import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa6";

interface MarkAsReadButtonProps {
  notification: NotificationType;
  setOpen: (open: boolean) => void;
}

export const MarkAsReadButton = ({
  notification,
  setOpen,
}: MarkAsReadButtonProps) => {
  const { mutate: readNotification, isPending: isPendingReadNotification } =
    UseUpdateReadNotification();

  const handleReadNotification = (e: React.MouseEvent) => {
    e.stopPropagation();

    readNotification(
      { id: notification.id, isRead: true },
      {
        onSuccess: (data) => {
          console.log(data);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  return (
    <Button
      onClick={handleReadNotification}
      className="w-full flex items-center justify-start text-sm text-black bg-[#ffffff] hover:bg-[#1823ab]/10 hover:text-[#1823ab] transition-all duration-200"
    >
      <FaCheck />
      <p>Mark as read</p>
    </Button>
  );
};
