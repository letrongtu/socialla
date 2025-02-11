import { NotificationType } from "../../types";
import { UseUpdateReadNotification } from "../../api/use-update-read-notification";

import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa6";

interface MarkAsUnReadButtonProps {
  notification: NotificationType;
  setOpen: (open: boolean) => void;
}

export const MarkAsUnReadButton = ({
  notification,
  setOpen,
}: MarkAsUnReadButtonProps) => {
  const { mutate: unReadNotification, isPending: isPendingUnReadNotification } =
    UseUpdateReadNotification();

  const handleUnReadNotification = (e: React.MouseEvent) => {
    e.stopPropagation();

    unReadNotification(
      { id: notification.id, isRead: false },
      {
        onSuccess: (data) => {
          //   console.log(data);
        },
        onError: (error) => {
          //   console.log(error);
        },
      }
    );
  };

  return (
    <Button
      onClick={handleUnReadNotification}
      className="w-full flex items-center justify-start text-sm text-black bg-[#ffffff] hover:bg-[#1823ab]/10 hover:text-[#1823ab] transition-all duration-200"
    >
      <FaCheck />
      <p>Mark as unread</p>
    </Button>
  );
};
