import { useState } from "react";
import { cn } from "@/lib/utils";

import { MessageType } from "../../../types";
import { UserType } from "@/features/auth/types";
import { useUnsendMessage } from "../../../store/use-unsend-message";

import { UseDeleteMessageForUser } from "../../../api/use-delete-message-for-user";
import { UseUnsendMessage } from "../../../api/use-unsend-message";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Hint } from "@/components/ui/hint";
import { Button } from "@/components/ui/button";

import { FaTrash } from "react-icons/fa";

interface DeleteButtonProps {
  message: MessageType;
  currentUser: UserType;
}

export const DeleteButton = ({ message, currentUser }: DeleteButtonProps) => {
  const [open, setOpen] = useUnsendMessage();

  const { mutate: unsendMessage, isPending: isPendingUnsendMessage } =
    UseUnsendMessage();
  const { mutate: removeForUser, isPending: isPendingRemoveForUser } =
    UseDeleteMessageForUser();

  const [isUnsendEveryone, setIsUnsentEveryone] = useState(false);

  const handleRemove = () => {
    if (isUnsendEveryone) {
      unsendMessage(
        { messageId: message.id },
        {
          onSuccess: (data) => {
            // console.log(data);
          },
          onError: (error) => {
            // console.log(error);
          },
        }
      );
    } else {
      if (!currentUser.id || !message.conversationId) {
        return;
      }

      removeForUser(
        {
          messageId: message.id,
          userId: currentUser.id,
          conversationId: message.conversationId,
        },
        {
          onSuccess: (data) => {
            // console.log(data);
          },
          onError: (error) => {
            // console.log(error);
          },
        }
      );
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Hint label="Unsend">
          <div className="p-1.5 rounded-full text-gray-600/90 hover:bg-[#c9ccd1]/50 cursor-pointer">
            <FaTrash className="size-3" />
          </div>
        </Hint>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Who do you want to unsend this message for?</DialogTitle>
          <DialogDescription className="hidden">
            This action cannot be undone
          </DialogDescription>
        </DialogHeader>

        <div
          onClick={() => setIsUnsentEveryone(true)}
          className="flex items-start space-x-4 cursor-pointer"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#c9ccd1]/50 shrink-0 cursor-pointer">
            <div
              className={cn(
                "w-5 h-5 border-[2px] border-black rounded-full flex items-center justify-center",
                isUnsendEveryone && "border-[#1823ab]"
              )}
            >
              {isUnsendEveryone && (
                <div className="w-2.5 h-2.5 bg-[#1823ab] rounded-full"></div>
              )}
            </div>
          </div>

          <div className="py-1 flex flex-col gap-y-0.5">
            <p className="font-semibold">Unsend for everyone</p>
            <p className="text-sm text-muted-foreground">
              This message will be unsent for everyone in the chat. Others may
              have already seen or forwarded it. Unsent messages can still be
              included in reports.
            </p>
          </div>
        </div>

        <div
          onClick={() => setIsUnsentEveryone(false)}
          className="flex items-start space-x-4 cursor-pointer"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#c9ccd1]/50 shrink-0 ">
            <div
              className={cn(
                "w-5 h-5 border-[2px] border-black rounded-full flex items-center justify-center",
                !isUnsendEveryone && "border-[#1823ab]"
              )}
            >
              {!isUnsendEveryone && (
                <div className="w-2.5 h-2.5 bg-[#1823ab] rounded-full"></div>
              )}
            </div>
          </div>

          <div className="py-1 flex flex-col gap-y-0.5">
            <p className="font-semibold">Unsend for you</p>
            <p className="text-sm text-muted-foreground">
              This will remove the message from your devices. Other chat members
              will still be able to see it.
            </p>
          </div>
        </div>

        <DialogClose className="flex items-center justify-end space-x-2">
          <div className="flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold border rounded-md border-input hover:bg-accent text-[#1823ab] hover:text-[#1823ab]">
            Cancel
          </div>

          <div
            onClick={handleRemove}
            className="flex items-center justify-center h-10 px-4 py-2 text-sm font-semibold border rounded-md text-white border-[#1823ab] bg-[#1823ab] hover:bg-[#1823ab]/80"
          >
            Remove
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
