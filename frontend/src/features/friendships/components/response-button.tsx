import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FaUserPen } from "react-icons/fa6";
import { ConfirmButton } from "./confirm-button";
import { DeleteButton } from "./delete-button";
import { useState } from "react";

interface ResponseButtonProps {
  currentUserId: string;
  otherUserId: string;
}

export const ResponseButton = ({
  currentUserId,
  otherUserId,
}: ResponseButtonProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => {}}
          className="w-full py-2 px-4 flex items-center justify-center gap-x-2 rounded-md bg-[#1823ab] hover:bg-[#1823ab]/70 cursor-pointer"
        >
          <FaUserPen className="size-5" />
          <p className="text-sm text-white font-semibold">Response</p>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        onClick={() => setOpen(false)}
        side="right"
        className="max-w-48 p-2 flex flex-col items-center justify-center space-y-2"
      >
        <ConfirmButton firstUserId={currentUserId} secondUserId={otherUserId} />
        <DeleteButton firstUserId={currentUserId} secondUserId={otherUserId} />
      </PopoverContent>
    </Popover>
  );
};
