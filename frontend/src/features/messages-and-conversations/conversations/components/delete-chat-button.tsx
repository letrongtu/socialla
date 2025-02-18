import { useRouter } from "next/navigation";

import { UserType } from "@/features/auth/types";

import { FiTrash } from "react-icons/fi";

interface DeleteChatButtonProps {
  user: UserType;
}

export const DeleteChatButton = ({ user }: DeleteChatButtonProps) => {
  return (
    <div
      onClick={() => {}}
      className="px-2 w-full h-10 flex justify-start items-center space-x-2 hover:bg-red-100 hover:text-red-500 rounded-md cursor-pointer"
    >
      <div className="py-1 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer">
        <FiTrash className="size-5" />
      </div>

      <p className="text-sm font-semibold">Delete chat</p>
    </div>
  );
};
