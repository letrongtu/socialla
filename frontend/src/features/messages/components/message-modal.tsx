import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useMessageModal } from "../store/use-message-modal";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateMessageModalTrigger } from "./new-message/create-mesage-modal-trigger";
import { NewMessageModal } from "./new-message/new-message-modal";

import { MdClose } from "react-icons/md";
import { DisplayMessageModal } from "./display-message-modal";

export const MessageModal = () => {
  const { data: currentUser, isLoading: isLoadingCurrentUser } =
    useCurrentUser();
  const [{ open, userId }, setOpen] = useMessageModal();

  if (!currentUser) {
    return null;
  }

  return (
    <Dialog open={open} modal={false}>
      <DialogTrigger asChild>
        <CreateMessageModalTrigger />
      </DialogTrigger>
      <DialogContent
        isMessageModalDialog={true}
        showOverlayBackground={false}
        showCloseButton={false}
        className={cn(
          "lg:max-w-80 lg:h-[27rem] px-0 py-0 flex flex-col gap-2",
          !userId && "py-3"
        )}
      >
        <DialogHeader className={cn("relative", userId && "hidden")}>
          <DialogTitle className="px-3 text-base font-semibold">
            New Message
          </DialogTitle>
          <DialogDescription className="hidden">Nothing here</DialogDescription>

          <DialogClose>
            <div
              onClick={() => {
                setOpen({ open: false, userId: null });
              }}
              className="absolute -top-[0.1rem] right-3 flex p-0.5 justify-center items-center rounded-full hover:bg-[#c9ccd1]/50 cursor-pointer"
            >
              <MdClose className="size-6 text-[#1823ab]" />
            </div>
          </DialogClose>
        </DialogHeader>

        {userId ? (
          <DisplayMessageModal currentUser={currentUser} otherUserId={userId} />
        ) : (
          <NewMessageModal currentUser={currentUser} />
        )}
      </DialogContent>
    </Dialog>
  );
};
