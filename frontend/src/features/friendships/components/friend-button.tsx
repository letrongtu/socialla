import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaUserCheck } from "react-icons/fa6";
import { DeleteButton } from "./delete-button";

interface FriendButtonProps {
  currentUserId: string;
  otherUserId: string;
}

export const FriendButton = ({
  currentUserId,
  otherUserId,
}: FriendButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          onClick={() => {}}
          className="w-full py-2 px-4 flex items-center justify-center gap-x-2 rounded-md text-white bg-[#1823ab] hover:bg-[#1823ab]/70 cursor-pointer"
        >
          <FaUserCheck className="size-5" />
          <p className="text-sm text-white font-semibold">Friend</p>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        className="max-w-48 p-2 flex flex-col items-center justify-center space-y-2"
      >
        <DeleteButton
          label="Unfriend"
          firstUserId={currentUserId}
          secondUserId={otherUserId}
        />
      </PopoverContent>
    </Popover>
  );
};
