import { NotificationType } from "@/features/notifications/types";
import { UseAcceptFriendship } from "../api/use-accept-friendship";
import { Button } from "@/components/ui/button";

interface ConfirmButtonProps {
  firstUserId: string;
  secondUserId: string;
  handleReadNotification?: () => void;
}

export const ConfirmButton = ({
  firstUserId,
  secondUserId,
  handleReadNotification,
}: ConfirmButtonProps) => {
  const { mutate: acceptRequest, isPending: isPendingAcceptRequest } =
    UseAcceptFriendship();

  const handleConfirm = () => {
    acceptRequest(
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
      onClick={handleConfirm}
      className="w-full bg-[#1823ab] hover:bg-[#1823ab]/70"
    >
      Confirm
    </Button>
  );
};
