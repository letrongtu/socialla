import { useCheckFriendShip } from "../api/use-check-friendship";

import { FaUserPlus } from "react-icons/fa6";
import { FriendButton } from "./friend-button";
import { UseCreateFriendship } from "../api/use-create-friendship";
import { CancelRequestButton } from "./cancel-request-button";
import { Button } from "@/components/ui/button";

interface AddFriendButtonProps {
  currentUserId: string;
  otherUserId: string;
}

export const AddFriendButton = ({
  currentUserId,
  otherUserId,
}: AddFriendButtonProps) => {
  const { data, isLoading } = useCheckFriendShip(currentUserId, otherUserId);
  const { mutate: addFriend, isPending } = UseCreateFriendship();

  const handleAddFriend = () => {
    addFriend(
      { firstUserId: currentUserId, secondUserId: otherUserId },
      {
        onSuccess: (data) => {
          // console.log(data);
        },
        onError: (error) => {
          // console.log(error);
        },
      }
    );
  };

  return (
    <>
      {!data?.hasFriendship ? (
        <Button
          disabled={isLoading || isPending}
          onClick={handleAddFriend}
          className="w-full py-2 px-4 flex items-center justify-center gap-x-2 rounded-md bg-[#1823ab] hover:bg-[#1823ab]/70 cursor-pointer"
        >
          <FaUserPlus className="size-5" />
          <p className="text-sm font-semibold">Add Friend</p>
        </Button>
      ) : data.isAccepted ? (
        <FriendButton />
      ) : (
        <CancelRequestButton
          currentUserId={currentUserId}
          otherUserId={otherUserId}
        />
      )}
    </>
  );
};
