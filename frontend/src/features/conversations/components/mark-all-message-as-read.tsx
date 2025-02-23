import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa6";
import { MessageType } from "@/features/messages/types";

interface MarkAllMessageAsReadButtonProps {
  messages: MessageType[];
  setOpen: (open: boolean) => void;
}

export const MarkAllMessageAsReadButton = ({
  messages,
  setOpen,
}: MarkAllMessageAsReadButtonProps) => {
  //   const { mutate: readNotifications, isPending: isPendingReadNotifications } =
  //     UseUpdateReadNotifications();

  const messageIds = messages.map((m) => m.id);

  //   const handleReadNotification = (e: React.MouseEvent) => {
  //     e.stopPropagation();

  //     readNotifications(
  //       { ids: notificationIds },
  //       {
  //         onSuccess: (data) => {
  //           // console.log(data);
  //         },
  //         onError: (error) => {
  //           // console.log(error);
  //         },
  //       }
  //     );

  //     setOpen(false);
  //   };

  return (
    <Button
      //   onClick={handleReadNotification}
      className="w-full flex items-center justify-start text-sm text-black bg-[#ffffff] hover:bg-[#1823ab]/10 hover:text-[#1823ab] transition-all duration-200"
    >
      <FaCheck />
      <p>Mark all messages as read</p>
    </Button>
  );
};
