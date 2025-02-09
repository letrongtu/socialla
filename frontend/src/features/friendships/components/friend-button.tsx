import { Button } from "@/components/ui/button";
import { FaUserCheck } from "react-icons/fa6";

export const FriendButton = () => {
  return (
    <Button
      onClick={() => {}}
      className="w-full py-2 px-4 flex items-center justify-center gap-x-2 rounded-md text-white bg-[#1823ab] hover:bg-[#1823ab]/70 cursor-pointer"
    >
      <FaUserCheck className="size-5" />
      <p className="text-sm text-white font-semibold">Friend</p>
    </Button>
  );
};
