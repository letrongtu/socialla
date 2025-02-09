import { FaUserPlus } from "react-icons/fa6";
import { FaUserXmark } from "react-icons/fa6";

export const AddFriendButton = () => {
  return (
    <div
      onClick={() => {}}
      className="w-full py-2 px-4 flex items-center justify-center gap-x-2 rounded-md text-white bg-[#1823ab] hover:bg-[#1823ab]/70 cursor-pointer"
    >
      <FaUserPlus className="size-5" />
      <p className="text-sm text-white font-semibold">Add Friend</p>
    </div>
  );
};
