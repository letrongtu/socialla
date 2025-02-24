import { useRouter } from "next/navigation";

import { UserType } from "@/features/auth/types";

import { FiTrash } from "react-icons/fi";
import { useMessageModal } from "@/features/messages/store/use-message-modal";
import { UseDeleteConversation } from "../../api/use-delete-conversation";

interface DeleteChatButtonProps {
  user: UserType;
  conversationId: string | null;
}

export const DeleteChatButton = ({
  user,
  conversationId,
}: DeleteChatButtonProps) => {
  const [, setOpen] = useMessageModal();

  const { mutate, isPending } = UseDeleteConversation();

  const handleDeleteConversation = () => {
    mutate(
      { conversationId: conversationId, userId: user.id ? user.id : null },
      {
        onSuccess: (data) => {
          // console.log(data);
        },
        onError: (error) => {
          // console.log(error);
        },
      }
    );

    setOpen({ open: false, userId: null, conversationId: null });
  };

  return (
    <div
      onClick={handleDeleteConversation}
      className="px-2 w-full h-10 flex justify-start items-center space-x-2 hover:bg-red-100 hover:text-red-500 rounded-md cursor-pointer"
    >
      <div className="py-1 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer">
        <FiTrash className="size-5" />
      </div>

      <p className="text-sm font-semibold">Delete chat</p>
    </div>
  );
};
