import { HiOutlinePencilAlt } from "react-icons/hi";
import { useMessageModal } from "../store/use-message-modal";
import { Hint } from "@/components/ui/hint";

export const CreateMessageModalTrigger = () => {
  const [, setOpen] = useMessageModal();
  return (
    <Hint label="New Message" side="left">
      <div
        onClick={() => {
          setOpen((prev) => {
            if (prev.open && !prev.userId) {
              return { open: false, userId: null };
            } else {
              return { open: true, userId: null };
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
