import { useRouter } from "next/navigation";

import { UserType } from "@/features/auth/types";

import { BsEmojiSmile } from "react-icons/bs";

interface ChangeEmojiButtonProps {
  user: UserType;
}

export const ChangeEmojiButton = ({ user }: ChangeEmojiButtonProps) => {
  return (
    <div
      onClick={() => {}}
      className="px-2 w-full h-10 flex justify-start items-center space-x-2 hover:text-[#f78c6a] hover:bg-[#f78c6a]/20 rounded-md cursor-pointer"
    >
      <div className="py-1 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer">
        <BsEmojiSmile className="size-5" />
      </div>

      <p className="text-sm font-semibold">Emoji</p>
    </div>
  );
};
