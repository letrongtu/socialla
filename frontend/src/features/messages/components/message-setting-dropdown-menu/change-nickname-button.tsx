import { useRouter } from "next/navigation";

import { UserType } from "@/features/auth/types";

import { LuPencilLine } from "react-icons/lu";

interface ChangeNicknameButtonProps {
  user: UserType;
}

export const ChangeNicknameButton = ({ user }: ChangeNicknameButtonProps) => {
  return (
    <div
      onClick={() => {}}
      className="px-2 w-full h-10 flex justify-start items-center space-x-2 hover:text-[#1823ab] hover:bg-[#1823ab]/15 rounded-md cursor-pointer"
    >
      <div className="py-1 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer">
        <LuPencilLine className="size-5" />
      </div>

      <p className="text-sm font-semibold">Nicknames</p>
    </div>
  );
};
