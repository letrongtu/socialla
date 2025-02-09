import { FaUserXmark } from "react-icons/fa6";
import { UseDeleteFriendship } from "../api/use-delete-friendship";
import { Button } from "@/components/ui/button";

interface CancelRequestButtonProps {
  currentUserId: string;
  otherUserId: string;
}

export const CancelRequestButton = ({
  currentUserId,
  otherUserId,
}: CancelRequestButtonProps) => {
  const { mutate, isPending } = UseDeleteFriendship();
  const handleCancelRequest = () => {
    mutate(
      { firstUserId: currentUserId, secondUserId: otherUserId },
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
      disabled={isPending}
      onClick={handleCancelRequest}
      className="w-full py-2 px-4 flex items-center justify-center gap-x-2 rounded-md text-black bg-[#c9ccd1]/30 hover:bg-[#c9ccd1]/70  cursor-pointer"
    >
      <FaUserXmark className="size-5" />
      <p className="text-sm font-semibold">Cancel Request</p>
    </Button>
  );
};
