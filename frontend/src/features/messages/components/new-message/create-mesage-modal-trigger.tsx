import { useMessageModal } from "../../store/use-message-modal";
import { Hint } from "@/components/ui/hint";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

import { HiOutlinePencilAlt } from "react-icons/hi";

export const CreateMessageModalTrigger = () => {
  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useCurrentUser();

  const [, setOpen] = useMessageModal();

  if (!currentUser) {
    return null;
  }

  return (
    <Hint label="New Message" side="left">
      <div
        onClick={() => {
          setOpen((prev) => {
            if (prev.open && !prev.userId) {
              return { open: false, userId: null, conversationId: null };
            } else {
              return { open: true, userId: null, conversationId: null };
            }
          });
        }}
        className="absolute bottom-5 right-10 flex items-center justify-center p-3 bg-white rounded-full shadow-xl cursor-pointer"
      >
        <HiOutlinePencilAlt className="size-6" />
      </div>
    </Hint>
  );
};
